// src/pages/public/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginUser, getUserProfile } from '../../services/authService'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth'
import { auth } from '../../services/firebase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [unverifiedUser, setUnverifiedUser] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await loginUser(form)
      const profile = await getUserProfile(user.uid)
      toast.success('Welcome back!')
      if (profile?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      if (err.message.includes('verify your email')) {
        setUnverifiedUser(form.email)
        toast.error('Please verify your email before logging in.')
      } else {
        toast.error('Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password)
      await sendEmailVerification(userCredential.user)
      await signOut(auth)
      toast.success('Verification email sent! Check your inbox.')
      setUnverifiedUser(null)
    } catch (err) {
      toast.error('Could not resend email. Please try again.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <h2>Welcome back to <em>Homemade skincare</em></h2>
          <p>Your skincare journey continues here.</p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <motion.div className="auth-card"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1>Sign In</h1>
          <p className="auth-subtitle">Don't have an account? <Link to="/register">Create one</Link></p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button type="button" className="icon-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {unverifiedUser && (
              <p className="verify-message">
                Email not verified.{' '}
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="resend-link"
                >
                  Resend verification email
                </button>
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  )
}