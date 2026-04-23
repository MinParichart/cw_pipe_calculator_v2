// Authentication Controller
import { Request, Response } from 'express'
import authService from '../services/authService'

export class AuthController {
  /**
   * Register new user
   * POST /auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required',
          },
        })
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Password must be at least 6 characters',
          },
        })
      }

      // Register user
      const result = await authService.register(email, password, name)

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message || 'Registration failed',
        },
      })
    }
  }

  /**
   * Login user
   * POST /auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required',
          },
        })
      }

      // Login
      const result = await authService.login(email, password)

      res.json({
        success: true,
        data: result,
        message: 'Login successful',
      })
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: error.message || 'Login failed',
        },
      })
    }
  }

  /**
   * Get current user
   * GET /auth/me
   */
  async me(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        })
      }

      const user = await authService.getUserById(req.user.userId)

      res.json({
        success: true,
        data: user,
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message || 'User not found',
        },
      })
    }
  }

  /**
   * Logout user (client-side token removal)
   * POST /auth/logout
   */
  async logout(req: Request, res: Response) {
    res.json({
      success: true,
      message: 'Logout successful',
    })
  }
}

export default new AuthController()
