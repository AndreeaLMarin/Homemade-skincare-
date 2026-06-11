// src/services/orderService.js
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { createNotification } from './notificationService'
import { emailAdminNewOrder, emailCustomerOrderUpdate } from './emailService'

const COL = 'orders'

// Status labels shown to the customer
export const STATUS_LABELS = {
  pending:    'Pending',
  processing: 'Being prepared',
  ready:      'Ready',
  completed:  'Collected',
  cancelled:  'Cancelled',
}

/**
 * Customer places an order.
 * → Creates Firestore order
 * → Sends in-app notification to admin (if admin uid known) — skipped here, admin sees it in dashboard
 * → Sends email to admin
 */
export const createOrder = async (user, orderData) => {
  const order = await addDoc(collection(db, COL), {
    userId:        user.uid,
    userName:      user.displayName || 'Customer',
    userEmail:     user.email,
    ...orderData,
    status:        'pending',
    createdAt:     serverTimestamp(),
  })

  // Email admin
  await emailAdminNewOrder({
    customerName:  user.displayName || 'Customer',
    customerEmail: user.email,
    productName:   orderData.productName,
    quantity:      orderData.quantity,
    note:          orderData.note,
  })

  return order
}

export const getOrdersByUser = async (userId) => {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getAllOrders = async () => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Admin updates order status.
 * → Updates Firestore
 * → Creates in-app notification for the customer
 * → Sends email to customer (only for meaningful status changes)
 */
export const updateOrderStatus = async (orderId, status, adminNote = '') => {
  // Fetch order to get customer details
  const orderSnap = await getDoc(doc(db, COL, orderId))
  if (!orderSnap.exists()) throw new Error('Order not found')
  const order = orderSnap.data()

  // Update order doc
  await updateDoc(doc(db, COL, orderId), {
    status,
    adminNote,
    updatedAt: serverTimestamp(),
  })

  // Build notification content per status
  const notifMap = {
    processing: {
      title:   'Your order is being prepared 🌿',
      message: `"${order.productName}" is now being handmade. We'll let you know when it's ready.`,
      type:    'order_processing',
    },
    ready: {
      title:   'Your order is ready! ✅',
      message: `"${order.productName}" is ready for collection.${adminNote ? ` Note: ${adminNote}` : ''}`,
      type:    'order_ready',
    },
    cancelled: {
      title:   'Order cancelled ❌',
      message: `Your order for "${order.productName}" was cancelled.${adminNote ? ` Reason: ${adminNote}` : ''}`,
      type:    'order_cancelled',
    },
    completed: {
      title:   'Order completed 🎉',
      message: `Your order for "${order.productName}" is marked as collected. Thank you!`,
      type:    'order_completed',
    },
  }

  const notifData = notifMap[status]

  // Create in-app notification for the customer
  if (notifData) {
    await createNotification({
      userId:  order.userId,
      type:    notifData.type,
      title:   notifData.title,
      message: notifData.message,
      orderId,
    })

    // Send email to customer for key statuses
    if (['processing', 'ready', 'cancelled'].includes(status)) {
      await emailCustomerOrderUpdate({
        customerName:  order.userName,
        customerEmail: order.userEmail,
        productName:   order.productName,
        status:        STATUS_LABELS[status] || status,
        adminNote,
      })
    }
  }
}
