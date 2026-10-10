const mongoose = require('mongoose')

module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`Connected to MongoDB database: ${mongoose.connection.name}`)
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  }
}
