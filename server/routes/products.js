// server/routes/products.js
const router = require('express').Router()
const { verifyToken, requireAdmin } = require('../middleware/auth')
const { db } = require('../config/firebase')
const { FieldValue } = require('firebase-admin/firestore')

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('products').orderBy('createdAt', 'desc').get()
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single product (public)
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    res.json({ id: doc.id, ...doc.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create product (admin only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const ref = await db.collection('products').add({
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    })
    res.status(201).json({ id: ref.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH update product (admin only)
router.patch('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).update({
      ...req.body,
      updatedAt: FieldValue.serverTimestamp(),
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE product (admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
