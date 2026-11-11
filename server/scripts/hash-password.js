// Generates a bcrypt hash for ADMIN_PASSWORD_HASH in .env.
//
//   npm run hash-password
//
// The password is typed at a hidden prompt so it never lands in shell history.
const bcrypt = require('bcryptjs')
const readline = require('readline')

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    let muted = false
    // Once the prompt is shown, print "*" instead of whatever is typed
    rl._writeToOutput = (str) => rl.output.write(muted ? '*' : str)
    rl.question(question, (answer) => {
      rl.close()
      process.stdout.write('\n')
      resolve(answer)
    })
    muted = true
  })
}

;(async () => {
  const password = await askHidden('Admin password (min 8 characters): ')
  if (!password || password.length < 8) {
    console.error('Password must be at least 8 characters.')
    process.exit(1)
  }
  const confirm = await askHidden('Confirm password: ')
  if (confirm !== password) {
    console.error('Passwords do not match.')
    process.exit(1)
  }
  const hash = await bcrypt.hash(password, 10)
  console.log('\nAdd this line to your .env (keep the single quotes):\n')
  console.log(`ADMIN_PASSWORD_HASH='${hash}'\n`)
})()
