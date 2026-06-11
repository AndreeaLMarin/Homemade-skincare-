// src/pages/admin/AdminOrdersPage.jsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAllOrders, updateOrderStatus, STATUS_LABELS } from '../../services/orderService'
import { Clock, Cog, CheckCircle2, XCircle, PackageCheck, ChevronDown, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending:    { icon: <Clock size={15} />,         label: 'Pending',         color: 'status-pending',    next: ['processing', 'cancelled'] },
  processing: { icon: <Cog size={15} />,           label: 'Being Prepared',  color: 'status-processing', next: ['ready', 'cancelled'] },
  ready:      { icon: <CheckCircle2 size={15} />,  label: 'Ready',           color: 'status-ready',      next: ['completed', 'cancelled'] },
  completed:  { icon: <PackageCheck size={15} />,  label: 'Collected',       color: 'status-completed',  next: [] },
  cancelled:  { icon: <XCircle size={15} />,       label: 'Cancelled',       color: 'status-cancelled',  next: [] },
}

const FILTER_TABS = [
  { key: 'all',        label: 'All' },
  { key: 'pending',    label: 'Pending' },
  { key: 'processing', label: 'Being Prepared' },
  { key: 'ready',      label: 'Ready' },
  { key: 'completed',  label: 'Collected' },
  { key: 'cancelled',  label: 'Cancelled' },
]

const fmt = (ts) => ts?.toDate
  ? ts.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  : '—'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState({}) // orderId → true/false
  const [noteMap, setNoteMap] = useState({})    // orderId → note string
  const [expanded, setExpanded] = useState({})  // orderId → bool

  const load = () => {
    getAllOrders().then(data => { setOrders(data); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const pendingCount = orders.filter(o => o.status === 'pending').length

  const handleStatusChange = async (order, newStatus) => {
    const note = noteMap[order.id] || ''
    setUpdating(u => ({ ...u, [order.id]: true }))
    try {
      await updateOrderStatus(order.id, newStatus, note)
      toast.success(
        newStatus === 'ready'
          ? `✅ Customer notified — order is ready!`
          : `Order updated to "${STATUS_LABELS[newStatus] || newStatus}"`
      )
      load()
    } catch (err) {
      toast.error('Update failed: ' + err.message)
    } finally {
      setUpdating(u => ({ ...u, [order.id]: false }))
    }
  }

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }))

  return (
    <div className="admin-orders-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Orders</h1>
          <p className="page-subtitle">
            Handmade to order — manage each request from placed to collected.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="new-orders-badge">
            <Clock size={16} />
            {pendingCount} pending {pendingCount === 1 ? 'order' : 'orders'} waiting
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="order-filter-tabs">
        {FILTER_TABS.map(tab => {
          const count = tab.key === 'all'
            ? orders.length
            : orders.filter(o => o.status === tab.key).length
          return (
            <button
              key={tab.key}
              className={`order-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              {count > 0 && <span className="order-tab-count">{count}</span>}
            </button>
          )
        })}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="page-loader" />
      ) : filtered.length === 0 ? (
        <div className="empty-state-lg">
          <PackageCheck size={44} />
          <p>No orders in this category.</p>
        </div>
      ) : (
        <div className="order-queue">
          {filtered.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const isExpanded = expanded[order.id]
            const isUpdating = updating[order.id]

            return (
              <motion.div
                key={order.id}
                className={`order-queue-card status-border-${order.status}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Card header — always visible */}
                <div className="oqc-header" onClick={() => toggleExpand(order.id)}>
                  <div className="oqc-header-left">
                    <span className={`status-pill ${cfg.color}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <div className="oqc-product">
                      <h3>{order.productName}</h3>
                      <span>×{order.quantity}</span>
                    </div>
                  </div>
                  <div className="oqc-header-right">
                    <div className="oqc-meta">
                      <span className="oqc-customer">{order.userName || 'Customer'}</span>
                      <span className="oqc-date">{fmt(order.createdAt)}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`oqc-chevron ${isExpanded ? 'rotated' : ''}`}
                    />
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <motion.div
                    className="oqc-body"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="oqc-details-grid">
                      <div className="oqc-detail-item">
                        <span className="oqc-detail-label">Customer email</span>
                        <span>{order.userEmail || '—'}</span>
                      </div>
                      <div className="oqc-detail-item">
                        <span className="oqc-detail-label">Total</span>
                        <span>£{order.totalPrice?.toFixed(2) || '—'}</span>
                      </div>
                      {order.note && (
                        <div className="oqc-detail-item oqc-full-width">
                          <span className="oqc-detail-label">Customer note</span>
                          <span>{order.note}</span>
                        </div>
                      )}
                      {order.adminNote && (
                        <div className="oqc-detail-item oqc-full-width">
                          <span className="oqc-detail-label">Previous admin note</span>
                          <span className="oqc-prev-note">{order.adminNote}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions — only if there are next statuses */}
                    {cfg.next.length > 0 && (
                      <div className="oqc-actions">
                        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                          <label>Note to customer <span style={{ fontWeight: 400, color: 'var(--warm-ink-faint)' }}>(optional — included in notification)</span></label>
                          <input
                            value={noteMap[order.id] || ''}
                            onChange={e => setNoteMap(m => ({ ...m, [order.id]: e.target.value }))}
                            placeholder="e.g. Ready tomorrow after 2pm, will call you"
                          />
                        </div>
                        <div className="oqc-action-btns">
                          {cfg.next.map(nextStatus => {
                            const nextCfg = STATUS_CONFIG[nextStatus]
                            const isPrimary = nextStatus !== 'cancelled'
                            return (
                              <button
                                key={nextStatus}
                                className={`btn ${isPrimary ? 'btn-primary' : 'btn-danger'} btn-sm`}
                                onClick={() => handleStatusChange(order, nextStatus)}
                                disabled={isUpdating}
                              >
                                {isUpdating
                                  ? <><Loader2 size={14} className="spin" /> Updating…</>
                                  : <>{nextCfg.icon} Mark as {nextCfg.label}</>
                                }
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {cfg.next.length === 0 && (
                      <p className="oqc-final-note">
                        This order is {order.status === 'completed' ? 'complete' : 'cancelled'} — no further actions needed.
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
