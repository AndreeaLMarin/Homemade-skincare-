// src/pages/customer/MyOrdersPage.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrdersByUser, STATUS_LABELS } from '../../services/orderService'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { Clock, Cog, CheckCircle2, XCircle, PackageCheck, ShoppingBag, Bell } from 'lucide-react'

const STATUS_CONFIG = {
  pending:    { icon: <Clock size={15} />,        color: 'status-pending',    desc: 'Your order has been received and is in the queue.' },
  processing: { icon: <Cog size={15} />,          color: 'status-processing', desc: 'Your product is currently being handmade.' },
  ready:      { icon: <CheckCircle2 size={15} />, color: 'status-ready',      desc: 'Your order is ready! Please arrange collection.' },
  completed:  { icon: <PackageCheck size={15} />, color: 'status-completed',  desc: 'Order collected. Thank you!' },
  cancelled:  { icon: <XCircle size={15} />,      color: 'status-cancelled',  desc: 'This order was cancelled.' },
}

const fmt = (ts) => ts?.toDate
  ? ts.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  : '—'

export default function MyOrdersPage() {
  const { user } = useAuth()
  const { notifications, markAsRead } = useNotifications()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getOrdersByUser(user.uid).then(data => { setOrders(data); setLoading(false) })
  }, [user])

  // Mark all order-related notifications as read when this page opens
  useEffect(() => {
    const unread = notifications.filter(n => !n.read && n.orderId)
    unread.forEach(n => markAsRead(n.id))
  }, [notifications])

  // Find any unread notification for a specific order
  const getOrderNotif = (orderId) =>
    notifications.find(n => n.orderId === orderId && !n.read)

  if (loading) return <div className="page-loader" />

  return (
    <div className="my-orders-page">
      <div className="container section-pad">
        <div className="my-orders-header">
          <div>
            <h1>My Orders</h1>
            <p className="page-subtitle">
              Each product is handmade — thank you for your patience.
            </p>
          </div>
          <Link to="/products" className="btn-warm-outline">Browse products</Link>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state-lg">
            <ShoppingBag size={48} />
            <p>No orders yet.</p>
            <Link to="/products" className="btn-warm-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="my-orders-list">
            {orders.map((order, i) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
              const hasNewNotif = getOrderNotif(order.id)

              return (
                <motion.div
                  key={order.id}
                  className={`my-order-card ${hasNewNotif ? 'has-new-notif' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  {/* New notification banner */}
                  {hasNewNotif && (
                    <div className="order-notif-banner">
                      <Bell size={14} />
                      <strong>{hasNewNotif.title}</strong>
                      <span>{hasNewNotif.message}</span>
                    </div>
                  )}

                  <div className="my-order-card-inner">
                    <div className="my-order-top">
                      <div>
                        <h3>{order.productName}</h3>
                        <span className="my-order-date">Placed {fmt(order.createdAt)}</span>
                      </div>
                      <span className={`status-pill ${cfg.color}`}>
                        {cfg.icon} {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>

                    <p className="my-order-status-desc">{cfg.desc}</p>

                    <div className="my-order-meta">
                      <span>Qty: <strong>{order.quantity}</strong></span>

                    </div>

                    {order.note && (
                      <p className="my-order-note">Your note: {order.note}</p>
                    )}
                    {order.adminNote && (
                      <div className="my-order-admin-note">
                        <strong>Message from us:</strong> {order.adminNote}
                      </div>
                    )}

                    {/* Progress bar */}
                    <div className="order-progress">
                      {['pending', 'processing', 'ready', 'completed'].map((s, si) => {
                        const steps = ['pending', 'processing', 'ready', 'completed']
                        const currentIdx = steps.indexOf(order.status)
                        const isDone   = si <= currentIdx
                        const isActive = si === currentIdx
                        return (
                          <div key={s} className={`progress-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                            <div className="progress-dot" />
                            <span>{STATUS_LABELS[s]}</span>
                            {si < steps.length - 1 && <div className={`progress-line ${si < currentIdx ? 'done' : ''}`} />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
