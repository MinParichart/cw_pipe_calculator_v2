// Authentication Service
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import prisma from '../config/database'
import { jwtConfig } from '../config/jwt'
import type { JwtPayload } from '../config/jwt'

export class AuthService {
  /**
   * Hash password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }

  /**
   * Compare password
   */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  /**
   * Generate JWT token
   */
  generateToken(payload: JwtPayload): string {
    const expiresIn = 60 * 60 * 24 * 7 // 7 days in seconds
    return jwt.sign(payload, jwtConfig.secret, { expiresIn })
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, jwtConfig.secret) as JwtPayload
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  /**
   * Register new user
   */
  async register(email: string, password: string, name?: string) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('Email already registered')
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Verify password
    const isValid = await this.comparePassword(password, user.password)

    if (!isValid) {
      throw new Error('Invalid email or password')
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }
}

export default new AuthService()
