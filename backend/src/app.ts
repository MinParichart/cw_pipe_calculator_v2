/**
 * app.ts — Express app instance (แยกจาก server.ts เพื่อให้ Supertest import ได้)
 * server.ts ทำหน้าที่แค่ app.listen()
 * test files import จาก app.ts
 */

import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import path from 'path'
import apiRoutes from './routes'

dotenv.config()

const app = express()

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:3003',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3004',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}))

// Security middleware (ตรงกับ server.ts เดิม)
app.use(helmet({
  contentSecurityPolicy: false,
  hsts: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
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
      status: err.status || 500,
    },
  })
})

export default app
