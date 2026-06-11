// server/routes/users.js
const router = require('express').Router()
const { verifyToken, requireAdmin } = require('../middleware/auth')
const { db } = require('../config/firebase')
const { FieldValue } = require('firebase-admin/firestore')

// GET all users (admin only)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const snap = await db.collection('users').orderBy('createdAt', 'desc').get()
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH update user role (admin only)
router.patch('/:uid/role', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body
    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }
    await db.collection('users').doc(req.params.uid).update({ role })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
