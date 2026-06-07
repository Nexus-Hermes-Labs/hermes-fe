// Mirrors: infrastructure/persistence/postgres/auth_credential/repository.rs
// Maps backend snake_case JSON → TypeScript camelCase
// Routes: POST /auth/register, POST /auth/login, POST /auth/logout, POST /auth/refresh

import { httpClient } from '../http/client'
import { tokenStorage } from '../storage/tokenStorage'
import type { AuthTokens, AuthUser } from '@/domain/auth/entities'

// ── Raw API response shapes (snake_case from backend) ────────────────────────
interface RawAuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: 'Bearer'
}

interface RawUserProfile {
  user_id: string
  email: string
  username: string
  display_name: string
  avatar: string | null
  bio: string | null
  created_at: string
}

interface RawAuthResponseWithUser extends RawAuthResponse {
  user: RawUserProfile
}

// ── DTO shapes for requests ───────────────────────────────────────────────────
export interface RegisterDto {
  email: string
  username: string
  display_name: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
  device_name?: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  new_password: string
}

export interface ChangePasswordDto {
  current_password: string
  new_password: string
}

interface MessageResponse {
  message: string
}

// ── Repository ────────────────────────────────────────────────────────────────
function mapTokens(raw: RawAuthResponse): AuthTokens {
  return {
    accessToken: raw.access_token,
    refreshToken: raw.refresh_token,
    expiresIn: raw.expires_in,
    tokenType: raw.token_type,
  }
}

function mapUser(raw: RawUserProfile): AuthUser {
  return {
    userId: raw.user_id,
    email: raw.email,
    username: raw.username,
    displayName: raw.display_name,
    avatar: raw.avatar,
    bio: raw.bio,
    createdAt: raw.created_at,
  }
}

export const authRepository = {
  async register(dto: RegisterDto): Promise<{ tokens: AuthTokens; user: AuthUser }> {
    const { data } = await httpClient.post<RawAuthResponseWithUser>('/auth/register', dto)
    const tokens = mapTokens(data)
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn)
    return { tokens, user: mapUser(data.user) }
  },

  async login(dto: LoginDto): Promise<AuthTokens> {
    const { data } = await httpClient.post<RawAuthResponse>('/auth/login', dto)
    const tokens = mapTokens(data)
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn)
    return tokens
  },

  async logout(allDevices = false): Promise<void> {
    try {
      await httpClient.post('/auth/logout', {
        refresh_token: tokenStorage.getRefreshToken(),
        all_devices: allDevices,
      })
    } finally {
      tokenStorage.clearTokens()
    }
  },

  async refresh(): Promise<AuthTokens> {
    const refreshToken = tokenStorage.getRefreshToken()
    const { data } = await httpClient.post<RawAuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    const tokens = mapTokens(data)
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn)
    return tokens
  },

  // Backend: GET /auth/verify-email?token=...
  async verifyEmail(token: string): Promise<void> {
    await httpClient.get('/auth/verify-email', { params: { token } })
  },

  async forgotPassword(dto: ForgotPasswordDto): Promise<MessageResponse> {
    const { data } = await httpClient.post<MessageResponse>('/auth/forgot-password', dto)
    return data
  },

  async resetPassword(dto: ResetPasswordDto): Promise<MessageResponse> {
    const { data } = await httpClient.post<MessageResponse>('/auth/reset-password', dto)
    return data
  },

  async changePassword(dto: ChangePasswordDto): Promise<MessageResponse> {
    const { data } = await httpClient.post<MessageResponse>('/auth/change-password', dto)
    return data
  },
}
