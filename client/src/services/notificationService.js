// src/services/notificationService.js
import {
  collection, doc, addDoc, updateDoc, query,
  where, orderBy, onSnapshot, serverTimestamp, writeBatch, getDocs
} from 'firebase/firestore'
import { db } from './firebase'

const COL = 'notifications'

/**
 * Create a notification for a specific user.
 * type: 'order_placed' | 'order_ready' | 'order_processing' | 'order_cancelled'
 */
export const createNotification = async ({ userId, type, title, message, orderId }) => {
  return addDoc(collection(db, COL), {
    userId,
    type,
    title,
    message,
    orderId,
    read: false,
    createdAt: serverTimestamp(),
  })
}

/**
 * Real-time listener for a user's unread + recent notifications.
 * Returns an unsubscribe function.
 */
export const subscribeToNotifications = (userId, callback) => {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    const notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(notifications)
  })
}

/** Mark a single notification as read */
export const markAsRead = async (notifId) => {
  return updateDoc(doc(db, COL, notifId), { read: true })
}

/** Mark all of a user's notifications as read */
export const markAllAsRead = async (userId) => {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    where('read', '==', false)
  )
  const snap = await getDocs(q)
  const batch = writeBatch(db)
  snap.docs.forEach(d => batch.update(d.ref, { read: true }))
  return batch.commit()
}
