// server/routes/recipes.js
const router = require('express').Router()
const { verifyToken, requireAdmin } = require('../middleware/auth')
const { db } = require('../config/firebase')
const { FieldValue } = require('firebase-admin/firestore')

router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('recipes').orderBy('createdAt', 'desc').get()
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('recipes').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    res.json({ id: doc.id, ...doc.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const ref = await db.collection('recipes').add({
      ...req.body,
      published: true,
      createdAt: FieldValue.serverTimestamp(),
    })
    res.status(201).json({ id: ref.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.collection('recipes').doc(req.params.id).update({
      ...req.body,
      updatedAt: FieldValue.serverTimestamp(),
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.collection('recipes').doc(req.params.id).delete()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
