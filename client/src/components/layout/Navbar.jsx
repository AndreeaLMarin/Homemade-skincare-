// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutUser } from '../../services/authService'
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import NotificationBell from '../common/NotificationBell'
import toast from 'react-hot-toast'

const navLinks = [
  { to: '/about',     label: 'Story' },
  { to: '/tutorials', label: 'Tutorials' },
  { to: '/products',  label: 'Products' },
  { to: '/research',  label: 'Research' },
]

export default function Navbar() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const handleLogout = async () => {
    await logoutUser()
    toast.success('See you soon!')
    navigate('/')
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">

        <Link to="/" className="navbar-logo">Homemade skincare</Link>

        <ul className="navbar-links">
          {navLinks.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <>
              {/* Notification bell — only for logged-in non-admin customers */}
              {!isAdmin && <NotificationBell />}

              {isAdmin && (
                <Link to="/admin" className="btn-nav-outline">
                  <LayoutDashboard size={15} /> Admin
                </Link>
              )}
              {!isAdmin && (
                <Link to="/my-orders" className="btn-nav-outline">
                  My Orders
                </Link>
              )}
              <button onClick={handleLogout} className="btn-nav-ghost" title="Sign out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-nav-ghost">Sign in</Link>
              <Link to="/register" className="btn-nav-pill">Join</Link>
            </>
          )}
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => isActive ? 'active' : ''}>
              {l.label}
            </NavLink>
          ))}
          <div className="mobile-nav-divider" />
          {user ? (
            <>
              {isAdmin  && <Link to="/admin">Admin Dashboard</Link>}
              {!isAdmin && <Link to="/my-orders">My Orders</Link>}
              <button onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Create Account</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
