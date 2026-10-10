const router = require('express').Router()
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { requireAuth, requireAdmin, requireTestMode } = require('../middleware/auth')
const ctrl = require('../controllers/project.controller')

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('completion').isISO8601().withMessage('Completion must be a valid date (YYYY-MM-DD)'),
  body('description').trim().notEmpty().withMessage('Description is required'),
]

// Reads are public; writes require a valid JWT
router.get('/', ctrl.list)
router.post('/', requireAuth, rules, validate, ctrl.create)
router.delete('/', requireAuth, requireAdmin, requireTestMode, ctrl.removeAll)
router.get('/:id', ctrl.get)
router.put('/:id', requireAuth, rules, validate, ctrl.update)
router.delete('/:id', requireAuth, ctrl.remove)

module.exports = router
