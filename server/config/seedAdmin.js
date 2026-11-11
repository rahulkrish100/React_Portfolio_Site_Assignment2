const User = require('../models/User')

// bcrypt hashes look like $2a$10$<53 chars> (also $2b$ / $2y$)
const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/

/**
 * Ensures exactly one known administrator account exists.
 *
 * Credentials come only from environment configuration:
 *   ADMIN_EMAIL, ADMIN_PASSWORD_HASH (bcrypt hash, never plain text), ADMIN_NAME
 *
 * The .env file is the source of truth: if the admin already exists, its role
 * and password hash are re-synced on every start, so rotating the password is
 * just "generate a new hash, update .env, restart".
 */
module.exports = async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const passwordHash = (process.env.ADMIN_PASSWORD_HASH || '').trim()
  const name = (process.env.ADMIN_NAME || 'Site Administrator').trim()

  if (!email || !passwordHash) {
    console.warn('Admin seed skipped: set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in .env')
    return null
  }
  if (!BCRYPT_HASH.test(passwordHash)) {
    console.warn('Admin seed skipped: ADMIN_PASSWORD_HASH is not a bcrypt hash (run `npm run hash-password`)')
    return null
  }

  const admin = await User.findOneAndUpdate(
    { email },
    { $set: { role: 'admin', passwordHash }, $setOnInsert: { name, email } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  console.log(`Administrator account ready: ${admin.email}`)
  return admin
}
