// Mirrors: presentation/http/middleware (JWT auth middleware)
// Implements:
//   1. Request interceptor — attaches Bearer token (mirrors Axum auth_middleware)
//   2. Response interceptor — 401 → queue → POST /api/v1/auth/refresh → retry all
//      Uses request-queue pattern to handle concurrent 401s correctly

import axios from 'axios'
import { deviceId } from '../storage/deviceId'
import { tokenStorage } from '../storage/tokenStorage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const httpClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
})

// ── Request interceptor: attach Bearer token + device id ─────────────────────
httpClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['X-Device-Id'] = deviceId.get()
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor: 401 handling with request queue ────────────────────
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return httpClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = tokenStorage.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      // Use a plain axios call to avoid interceptor loops. We still need to
      // send X-Device-Id manually so the refreshed session stays bound to the
      // same device row on the backend.
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/auth/refresh`,
        { refresh_token: refreshToken },
        { headers: { 'X-Device-Id': deviceId.get() } },
      )

      tokenStorage.setTokens(data.access_token, data.refresh_token, data.expires_in)

      processQueue(null, data.access_token)

      originalRequest.headers.Authorization = `Bearer ${data.access_token}`
      return httpClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      tokenStorage.clearTokens()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
