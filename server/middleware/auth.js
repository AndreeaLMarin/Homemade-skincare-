// server/middleware/auth.js
const { auth, db } = require('../config/firebase')

// Verify Firebase ID token from Authorization header
const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  try {
    const token = header.split('Bearer ')[1]
    const decoded = await auth.verifyIdToken(token)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Verify user has admin role
const requireAdmin = async (req, res, next) => {
  try {
    const snap = await db.collection('users').doc(req.user.uid).get()
    if (!snap.exists || snap.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    next()
  } catch {
    res.status(500).json({ error: 'Authorization check failed' })
  }
}

module.exports = { verifyToken, requireAdmin }
