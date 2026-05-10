import dotenv from 'dotenv'
import app from './app'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 3003

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV}`)
})
