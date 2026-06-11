// src/components/common/NotificationBell.jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Package, CheckCheck, X } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import { motion, AnimatePresence } from 'framer-motion'

const TYPE_ICON = {
  order_placed:     '🛍️',
  order_ready:      '✅',
  order_processing: '⚙️',
  order_cancelled:  '❌',
}

const timeAgo = (ts) => {
  if (!ts) return ''
  const now = Date.now()
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  const diff = Math.floor((now - date.getTime()) / 1000)
  if (diff < 60)  return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleClick = async (notif) => {
    if (!notif.read) await markAsRead(notif.id)
    setOpen(false)
    navigate('/my-orders')
  }

  const recent = notifications.slice(0, 20)

  return (
    <div className="notif-bell-wrap" ref={ref}>
      <button
        className={`notif-bell-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={`${unreadCount} notifications`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notif-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="notif-dropdown-header">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button className="notif-mark-all" onClick={markAllAsRead}>
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>

            <div className="notif-list">
              {recent.length === 0 ? (
                <div className="notif-empty">
                  <Bell size={28} />
                  <p>No notifications yet</p>
                </div>
              ) : (
                recent.map(n => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => handleClick(n)}
                  >
                    <span className="notif-type-icon">{TYPE_ICON[n.type] || '📦'}</span>
                    <div className="notif-item-content">
                      <p className="notif-title">{n.title}</p>
                      <p className="notif-message">{n.message}</p>
                      <span className="notif-time">{timeAgo(n.createdAt)}</span>
                    </div>
                    {!n.read && <span className="notif-dot" />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
