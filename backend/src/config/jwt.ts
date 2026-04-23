// JWT Configuration
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'cw-pipe-calculator-secret-key-2024',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
} as const

export interface JwtPayload {
  userId: number
  email: string
  role: string
}
