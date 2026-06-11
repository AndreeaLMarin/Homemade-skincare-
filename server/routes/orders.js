// server/routes/orders.js
const router = require('express').Router()
const { verifyToken, requireAdmin } = require('../middleware/auth')
const { db } = require('../config/firebase')
const { FieldValue } = require('firebase-admin/firestore')

// GET all orders (admin)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const snap = await db.collection('orders').orderBy('createdAt', 'desc').get()
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET orders by user (authenticated)
router.get('/my', verifyToken, async (req, res) => {
  try {
    const snap = await db.collection('orders')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get()
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create order (authenticated)
router.post('/', verifyToken, async (req, res) => {
  try {
    const ref = await db.collection('orders').add({
      userId: req.user.uid,
      ...req.body,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    })
    res.status(201).json({ id: ref.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH update order status (admin)
router.patch('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body
    await db.collection('orders').doc(req.params.id).update({
      status,
      adminNote: adminNote || '',
      updatedAt: FieldValue.serverTimestamp(),
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
