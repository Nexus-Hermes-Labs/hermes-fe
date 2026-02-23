// Mirrors: state/app_state.rs — authentication domain state
// Stores UserProfile (from user-service) as the user shape

import { create } from 'zustand'
import type { UserProfile } from '@/domain/user/entities'
import { tokenStorage } from '@/infrastructure/storage/tokenStorage'

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean

  setUser: (user: UserProfile) => void
  // Stores tokens and marks as authenticated; user is then loaded by useGetMe
  setAuthenticated: (accessToken: string, refreshToken: string, expiresIn: number) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: tokenStorage.hasTokens(),

  setUser: (user) => set({ user, isAuthenticated: true }),

  setAuthenticated: (accessToken, refreshToken, expiresIn) => {
    tokenStorage.setTokens(accessToken, refreshToken, expiresIn)
    set({ isAuthenticated: true })
  },

  clearAuth: () => {
    tokenStorage.clearTokens()
    set({ user: null, isAuthenticated: false })
  },
}))
