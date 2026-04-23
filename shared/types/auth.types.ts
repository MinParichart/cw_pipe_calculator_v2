// Authentication Types

export interface User {
  id: number
  email: string
  name?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface RegisterDto {
  email: string
  password: string
  name?: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface JwtPayload {
  userId: number
  email: string
  role: UserRole
  iat: number
  exp: number
}

export interface RefreshTokenDto {
  refreshToken: string
}

// Request with authenticated user
export interface AuthenticatedRequest extends Express.Request {
  user?: {
    userId: number
    email: string
    role: UserRole
  }
}

// Export Express namespace augmentation
declare namespace Express {
  export interface Request {
    user?: {
      userId: number
      email: string
      role: UserRole
    }
  }
}
