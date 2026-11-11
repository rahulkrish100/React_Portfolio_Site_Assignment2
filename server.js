require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./server/config/db')
const seedAdmin = require('./server/config/seedAdmin')

// Fail fast if required configuration is missing (secrets come only from .env)
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET']
const missing = REQUIRED_ENV.filter((key) => !process.env[key])
if (missing.length) {
  console.error(`Missing required environment variable(s): ${missing.join(', ')}. See .env.example`)
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MyPortfolio backend API.' })
})

// API routes
app.use('/api/auth', require('./server/routes/auth.routes'))
app.use('/api/contacts', require('./server/routes/contact.routes'))
app.use('/api/projects', require('./server/routes/project.routes'))
app.use('/api/qualifications', require('./server/routes/qualification.routes'))
app.use('/api/users', require('./server/routes/user.routes'))

// 404 + error handlers
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` }))
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON body' })
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid ID format' })
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map((e) => ({ field: e.path, message: e.message })),
    })
  }
  if (err.code === 11000) return res.status(409).json({ error: 'Duplicate value', fields: err.keyValue })
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Server error' })
})

connectDB()
  .then(seedAdmin)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
