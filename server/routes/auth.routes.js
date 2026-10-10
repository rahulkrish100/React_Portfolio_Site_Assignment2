const router = require('express').Router()
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { requireAuth } = require('../middleware/auth')
const ctrl = require('../controllers/auth.controller')

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  ctrl.signup
)
router.post(
  '/signin',
  [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty().withMessage('Password is required')],
  validate,
  ctrl.signin
)
router.get('/signout', requireAuth, ctrl.signout)
// Simple protected route to demo authorized vs unauthorized requests
router.get('/me', requireAuth, (req, res) => res.status(200).json(req.user))

module.exports = router
