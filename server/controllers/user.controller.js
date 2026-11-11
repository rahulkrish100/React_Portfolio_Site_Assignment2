const bcrypt = require('bcryptjs')
const User = require('../models/User')

exports.list = async (req, res, next) => {
  try { res.status(200).json(await User.find().sort({ created: -1 })) } catch (e) { next(e) }
}

exports.get = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.status(200).json(user)
  } catch (e) { next(e) }
}

exports.create = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body
    if (await User.findOne({ email })) return res.status(409).json({ error: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash, role })
    res.status(201).json(user)
  } catch (e) { next(e) }
}

exports.update = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (name !== undefined) user.name = name
    if (email !== undefined) user.email = email
    if (password) user.passwordHash = await bcrypt.hash(password, 10)
    if (role !== undefined) user.role = role // route is admin-only
    await user.save()
    res.status(200).json(user)
  } catch (e) { next(e) }
}

exports.remove = async (req, res, next) => {
  try {
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ error: 'Administrators cannot delete their own account' })
    }
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.status(200).json({ message: 'User deleted', id: user._id })
  } catch (e) { next(e) }
}

exports.removeAll = async (req, res, next) => {
  try {
    // Keep the calling admin so the test session isn't locked out
    const result = await User.deleteMany({ _id: { $ne: req.user._id } })
    res.status(200).json({ message: 'All other users deleted', deletedCount: result.deletedCount })
  } catch (e) { next(e) }
}
