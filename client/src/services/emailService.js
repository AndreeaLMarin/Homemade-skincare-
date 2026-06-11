// src/services/emailService.js
//
// Uses EmailJS — free tier, no backend required.
// Setup:
//   1. Go to https://www.emailjs.com and create a free account
//   2. Add an Email Service (Gmail recommended)
//   3. Create TWO email templates (see template variables below)
//   4. Copy your Public Key, Service ID, and both Template IDs
//   5. Add them to client/.env:
//
//   VITE_EMAILJS_PUBLIC_KEY=your_public_key
//   VITE_EMAILJS_SERVICE_ID=your_service_id
//   VITE_EMAILJS_TEMPLATE_NEW_ORDER=template_id_for_admin
//   VITE_EMAILJS_TEMPLATE_ORDER_READY=template_id_for_customer
//   VITE_ADMIN_EMAIL=your_admin_email@example.com
//
// ─── TEMPLATE: "new_order" (sent to admin) ───────────────────────────
// Subject: New order received — {{product_name}}
// Body:
//   Hi Admin,
//   A new order has been placed.
//
//   Customer: {{customer_name}} ({{customer_email}})
//   Product:  {{product_name}}
//   Quantity: {{quantity}}
//   Note:     {{note}}
//   Placed:   {{date}}
//
//   Log in to review: {{dashboard_url}}
//
// ─── TEMPLATE: "order_ready" (sent to customer) ──────────────────────
// Subject: Your order is ready — {{product_name}}
// Body:
//   Hi {{customer_name}},
//   Great news! Your handmade order is ready.
//
//   Product: {{product_name}}
//   Status:  {{status}}
//   Message: {{admin_note}}
//
//   Log in to view your order: {{orders_url}}
//
//   Thank you for your patience.
// ─────────────────────────────────────────────────────────────────────

const PUBLIC_KEY       = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const SERVICE_ID       = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_NEW_ORDER   = import.meta.env.VITE_EMAILJS_TEMPLATE_NEW_ORDER
const TEMPLATE_ORDER_READY = import.meta.env.VITE_EMAILJS_TEMPLATE_ORDER_READY
const ADMIN_EMAIL      = import.meta.env.VITE_ADMIN_EMAIL

let emailjsReady = false

// Lazy-load EmailJS SDK from CDN (avoids adding a package)
const loadEmailJS = () => new Promise((resolve, reject) => {
  if (window.emailjs) { resolve(window.emailjs); return }
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
  script.onload = () => {
    window.emailjs.init({ publicKey: PUBLIC_KEY })
    emailjsReady = true
    resolve(window.emailjs)
  }
  script.onerror = reject
  document.head.appendChild(script)
})

/**
 * Notify the ADMIN that a new order was placed.
 */
export const emailAdminNewOrder = async ({ customerName, customerEmail, productName, quantity, note }) => {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_NEW_ORDER) {
    console.warn('EmailJS not configured — skipping admin email')
    return
  }
  try {
    const ejs = await loadEmailJS()
    await ejs.send(SERVICE_ID, TEMPLATE_NEW_ORDER, {
      to_email:       ADMIN_EMAIL,
      customer_name:  customerName,
      customer_email: customerEmail,
      product_name:   productName,
      quantity:       quantity,
      note:           note || '—',
      date:           new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      dashboard_url:  `${window.location.origin}/admin/orders`,
    })
  } catch (err) {
    console.error('Admin email failed:', err)
  }
}

/**
 * Notify the CUSTOMER that their order status changed (ready / processing / etc).
 */
export const emailCustomerOrderUpdate = async ({ customerName, customerEmail, productName, status, adminNote }) => {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ORDER_READY) {
    console.warn('EmailJS not configured — skipping customer email')
    return
  }
  try {
    const ejs = await loadEmailJS()
    await ejs.send(SERVICE_ID, TEMPLATE_ORDER_READY, {
      to_email:      customerEmail,
      customer_name: customerName,
      product_name:  productName,
      status:        status,
      admin_note:    adminNote || 'No additional message.',
      orders_url:    `${window.location.origin}/my-orders`,
    })
  } catch (err) {
    console.error('Customer email failed:', err)
  }
}
