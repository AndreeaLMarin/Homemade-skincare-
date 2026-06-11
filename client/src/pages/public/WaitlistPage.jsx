// src/pages/public/WaitlistPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, PackageCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { createOrder } from '../../services/orderService'
import toast from 'react-hot-toast'

export default function WaitlistPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.displayName || '')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // If not logged in, redirect to register
  if (!user) {
    return (
      <div className="waitlist-page">
        <div className="waitlist-split">

          {/* Left — message */}
          <motion.div
            className="waitlist-form-side"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="lp-section-label">Waiting List</span>
            <h1>Almost there.</h1>
            <p className="waitlist-intro">
              To join the waiting list you need a free account. 
              This lets us match your request to your email and keep you updated on your box.
            </p>
            <div className="waitlist-auth-btns">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/register', { state: { from: '/waitlist' } })}
              >
                Create a free account
              </button>
              <button
                className="btn-text"
                onClick={() => navigate('/login', { state: { from: '/waitlist' } })}
              >
                Already have an account? Sign in
              </button>
            </div>
          </motion.div>

          {/* Right — box placeholder */}
          <motion.div
            className="waitlist-image-side"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="waitlist-image-content">
              <Leaf size={64} />
              <p>A curated box of handmade skincare — one of each product, made for you.</p>
            </div>
          </motion.div>

        </div>
      </div>
    )
  }

  // Success state after submit
  if (submitted) {
    return (
      <div className="waitlist-page">
        <div className="container section-pad">
          <motion.div
            className="waitlist-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PackageCheck size={56} />
            <h2>You're on the list!</h2>
            <p>
              Thank you, <strong>{name}</strong>. We'll prepare your skincare box and get in touch 
              when it's ready to be sent to you.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/my-orders')}
            >
              View my orders
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) return toast.error('Please enter your name.')
    if (!address.trim()) return toast.error('Please enter your delivery address.')

    setSubmitting(true)
    try {
      await createOrder(user, {
        productName: 'Skincare Box',
        productId:   'waitlist-box',
        quantity:    1,
        note:        `Delivery address: ${address}`,
      })
      setSubmitted(true)
      toast.success('You\'re on the waiting list!')
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Logged in — show form
  return (
    <div className="waitlist-page">
      <div className="waitlist-split">

        {/* Left — form */}
        <motion.div
          className="waitlist-form-side"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="lp-section-label">Waiting List</span>
          <h1>Get your box.</h1>
          <p className="waitlist-intro">
            Leave your details below and we'll reach out when your handmade skincare box 
            is ready. Each box contains one of every product in our current range, 
            made fresh in small batches.
          </p>

          <form onSubmit={handleSubmit} className="waitlist-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Address</label>
              <textarea
                id="address"
                placeholder="Street, City, Postcode"
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="waitlist-notice">
              🌿 You will receive one of each product from our current range. 
              No individual selection — this is a curated box, handmade for you.
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={submitting}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {submitting ? 'Joining...' : 'Join the Waiting List'}
            </button>
          </form>
        </motion.div>

        {/* Right — box image placeholder */}
        <motion.div
          className="waitlist-image-side"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Replace the div below with <img src="your-image.jpg" alt="Skincare box" /> when ready */}
          <div className="waitlist-box-placeholder">
            <Leaf size={64} />
            <p>A curated box of handmade skincare — one of each product, made for you.</p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
