// Mirrors: auth-service/src/domain/auth_credential/entity.rs
// and auth-service/src/presentation/http/dto/shared.rs

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
}

export interface AuthUser {
  userId: string
  email: string
  username: string
  displayName: string
  avatar: string | null
  bio: string | null
  createdAt: string
}

export interface AuthSession {
  sessionId: string
  userId: string
  deviceName: string | null
  createdAt: string
  expiresAt: string
}
