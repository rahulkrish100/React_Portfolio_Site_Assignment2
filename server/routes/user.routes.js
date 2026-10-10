const router = require('express').Router()
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { requireAuth, requireAdmin, requireTestMode } = require('../middleware/auth')
const ctrl = require('../controllers/user.controller')

const createRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]
const updateRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]

// All user routes are protected
router.use(requireAuth)
router.get('/', ctrl.list)
router.post('/', createRules, validate, ctrl.create)
router.delete('/', requireAdmin, requireTestMode, ctrl.removeAll)
router.get('/:id', ctrl.get)
router.put('/:id', updateRules, validate, ctrl.update)
router.delete('/:id', ctrl.remove)

module.exports = router
