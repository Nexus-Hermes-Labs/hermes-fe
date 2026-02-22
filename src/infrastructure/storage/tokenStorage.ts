// Mirrors: infrastructure/ external concerns — localStorage adapter
// Persists access + refresh tokens across page reloads

const ACCESS_TOKEN_KEY = 'hermes_access_token'
const REFRESH_TOKEN_KEY = 'hermes_refresh_token'
const EXPIRES_AT_KEY = 'hermes_expires_at'

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  getExpiresAt(): number | null {
    const v = localStorage.getItem(EXPIRES_AT_KEY)
    return v ? parseInt(v, 10) : null
  },

  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const expiresAt = Date.now() + expiresIn * 1000
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt))
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
  },

  isAccessTokenExpired(): boolean {
    const expiresAt = this.getExpiresAt()
    if (!expiresAt) return true
    // Consider expired 60s before actual expiry to avoid edge cases
    return Date.now() >= expiresAt - 60_000
  },

  hasTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken()
  },
}
