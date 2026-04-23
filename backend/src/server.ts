import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import path from 'path'
import apiRoutes from './routes'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT

// CORS middleware - MUST be before helmet!
app.use(cors({
  origin: [
    'http://localhost:3003', // Frontend
    'http://localhost:3000',
    'http://localhost:5173', // Nuxt default
    'http://localhost:3004', // Backend itself
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

// Security middleware (after CORS)
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP in development
  hsts: false, // Disable HSTS in development
  crossOriginEmbedderPolicy: false, // Disable COEP in development
  crossOriginResourcePolicy: false, // Allow CORS
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'CW Pipe Calculator API is running', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api', apiRoutes)

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV}`)
})
