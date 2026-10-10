const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Verifies the Bearer token and attaches the user to req.user
exports.requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Authentication required: missing token' })

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if (!user) return res.status(401).json({ error: 'User no longer exists' })
    req.user = user
    next()
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
    res.status(401).json({ error: msg })
  }
}

exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator access required' })
  }
  next()
}

// Delete-all routes only work when explicitly enabled for testing
exports.requireTestMode = (req, res, next) => {
  if (process.env.ALLOW_DELETE_ALL !== 'true') {
    return res.status(403).json({ error: 'Delete-all is disabled (set ALLOW_DELETE_ALL=true in a test environment)' })
  }
  next()
}
