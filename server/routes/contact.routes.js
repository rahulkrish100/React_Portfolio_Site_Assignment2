const router = require('express').Router()
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { requireAuth, requireAdmin, requireTestMode } = require('../middleware/auth')
const ctrl = require('../controllers/contact.controller')

const rules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
]

// POST is public so the website's contact form works; everything else needs a token
router.post('/', rules, validate, ctrl.create)
router.get('/', requireAuth, ctrl.list)
router.delete('/', requireAuth, requireAdmin, requireTestMode, ctrl.removeAll)
router.get('/:id', requireAuth, ctrl.get)
router.put('/:id', requireAuth, rules, validate, ctrl.update)
router.delete('/:id', requireAuth, ctrl.remove)

module.exports = router
