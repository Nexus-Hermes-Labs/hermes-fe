// Mirrors: state/app_state.rs — authentication domain state
// { user, isAuthenticated, setUser, setTokensAndUser, clearAuth }

import { create } from 'zustand'
import type { AuthUser } from '@/domain/auth/entities'
import { tokenStorage } from '@/infrastructure/storage/tokenStorage'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean

  setUser: (user: AuthUser) => void
  setTokensAndUser: (
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    user: AuthUser,
  ) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: tokenStorage.hasTokens(),

  setUser: (user) => set({ user, isAuthenticated: true }),

  setTokensAndUser: (accessToken, refreshToken, expiresIn, user) => {
    tokenStorage.setTokens(accessToken, refreshToken, expiresIn)
    set({ user, isAuthenticated: true })
  },

  clearAuth: () => {
    tokenStorage.clearTokens()
    set({ user: null, isAuthenticated: false })
  },
}))
