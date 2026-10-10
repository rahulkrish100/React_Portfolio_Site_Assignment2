const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  })

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (await User.findOne({ email })) return res.status(409).json({ error: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    // First registered user becomes admin so the admin-only routes can be demonstrated
    const role = (await User.countDocuments()) === 0 ? 'admin' : 'user'
    const user = await User.create({ name, email, passwordHash, role })
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

// Stateless JWT design: sign-out = client discards the token.
// The server simply confirms; tokens expire on their own (JWT_EXPIRES_IN).
exports.signout = (req, res) => {
  res.status(200).json({ message: 'Signed out. Discard the token on the client.' })
}
