const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  })

// Public sign-up ALWAYS creates a regular user. The only administrator is the
// account seeded from .env (see server/config/seedAdmin.js); a "role" field in
// the request body is ignored so nobody can self-promote.
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (await User.findOne({ email })) return res.status(409).json({ error: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash, role: 'user' })
    res.status(201).json({ token: sign(user), user })
  } catch (e) { next(e) }
}

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    res.status(200).json({ token: sign(user), user })
  } catch (e) { next(e) }
}

// Stateless JWT design: the server keeps no session, so sign-out means the
// client deletes its stored token. This endpoint only confirms the action.
// Any copy of the token stays valid until it expires (JWT_EXPIRES_IN), which
// is why the expiry is kept short. See README "Sign-out design".
exports.signout = (req, res) => {
  res.status(200).json({ message: 'Signed out. Discard the token on the client.' })
}
