// server/routes/auth.js
const router = require('express').Router()
const { verifyToken } = require('../middleware/auth')
const { db, auth } = require('../config/firebase')
const { FieldValue } = require('firebase-admin/firestore')

const { sendVerificationEmail } = require('../utils/emailService')

// Registration with custom verification email

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    })

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role: 'customer',
      createdAt: FieldValue.serverTimestamp(),
    })

    await sendVerificationEmail(email, name)

    res.json({ success: true, message: 'Account created. Please check your email to verify your account.' })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(400).json({ error: err.message })
  }
})


// Called after client-side Firebase registration to sync role in Firestore
router.post('/sync', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body
    const ref = db.collection('users').doc(req.user.uid)
    const snap = await ref.get()
    if (!snap.exists) {
      await ref.set({ uid: req.user.uid, name, email, role: 'customer', createdAt: FieldValue.serverTimestamp() })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const snap = await db.collection('users').doc(req.user.uid).get()
    if (!snap.exists) return res.status(404).json({ error: 'User not found' })
    res.json({ id: snap.id, ...snap.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
