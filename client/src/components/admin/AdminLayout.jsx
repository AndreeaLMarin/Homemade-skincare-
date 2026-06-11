// src/components/admin/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutUser } from '../../services/authService'
import { LayoutDashboard, Package, ShoppingBag, BookOpen, LogOut, ChevronRight, Youtube, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
  { to: '/admin/products', label: 'Products', icon: <Package size={18} /> },
  { to: '/admin/tutorials', label: 'Tutorials', icon: <Youtube size={18} /> },
  { to: '/admin/story', label: 'Story Page', icon: <BookOpen size={18} /> },
  { to: '/admin/blog', label: 'Recipes', icon: <Leaf size={18} /> },
]

export default function AdminLayout() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    toast.success('Signed out')
    navigate('/')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span>Homemade skincare</span>
          <small>Admin</small>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight size={14} className="sidebar-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{profile?.name?.[0]?.toUpperCase()}</div>
            <div>
              <p>{profile?.name}</p>
              <small>Administrator</small>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
