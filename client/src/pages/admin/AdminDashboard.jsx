// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllOrders } from '../../services/orderService'
import { getAllProducts } from '../../services/productService'
import { getAllRecipes } from '../../services/blogService'
import { ShoppingBag, Package, BookOpen, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, recipes: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    Promise.all([getAllOrders(), getAllProducts(), getAllRecipes()]).then(
      ([orders, products, recipes]) => {
        setStats({
          orders: orders.length,
          products: products.length,
          recipes: recipes.length,
          pending: orders.filter(o => o.status === 'pending').length,
        })
        setRecentOrders(orders.slice(0, 5))
      }
    )
  }, [])

  const statCards = [
    { label: 'Total Orders', value: stats.orders, icon: <ShoppingBag size={24} />, to: '/admin/orders', color: 'var(--color-sage)' },
    { label: 'Pending Orders', value: stats.pending, icon: <Clock size={24} />, to: '/admin/orders', color: 'var(--color-rose)' },
    { label: 'Products', value: stats.products, icon: <Package size={24} />, to: '/admin/products', color: 'var(--color-gold)' },
    { label: 'Recipes', value: stats.recipes, icon: <BookOpen size={24} />, to: '/admin/blog', color: 'var(--color-terracotta)' },
  ]

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <p className="page-subtitle">Overview of your Homemade skincare store</p>

      <div className="stats-grid">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={s.to} className="stat-card" style={{ '--card-accent': s.color }}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-content">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-recent">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders" className="link-arrow">View all</Link>
        </div>
        <div className="mini-orders">
          {recentOrders.map(order => (
            <div key={order.id} className="mini-order-row">
              <span className="mini-order-name">{order.productName}</span>
              <span className="mini-order-qty">×{order.quantity}</span>
              <span className={`status-badge status-${order.status}`}>{order.status}</span>
              <span className="mini-order-price">£{order.totalPrice?.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
