// Authentication Middleware
import { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'

// Role type (since we use strings in SQLite)
type UserRole = 'ADMIN' | 'USER'

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number
        email: string
        role: UserRole
      }
    }
  }
}

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided',
        },
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const payload = authService.verifyToken(token)

    // Attach user to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as UserRole,
    }

    next()
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message || 'Invalid or expired token',
      },
    })
  }
}

/**
 * Check if user has required role
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      })
    }

    next()
  }
}

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = authService.verifyToken(token)

      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role as UserRole,
      }
    }
  } catch (error) {
    // Ignore errors for optional auth
  }

  next()
}
