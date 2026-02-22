// WebSocket client stub — ready for realtime-service integration
// Implements reconnect + heartbeat stubs

import { tokenStorage } from '../storage/tokenStorage'

type WsStatus = 'connecting' | 'open' | 'closed' | 'error'
type WsListener = (event: MessageEvent) => void

const HEARTBEAT_INTERVAL_MS = 30_000
const RECONNECT_DELAY_MS = 3_000
const MAX_RECONNECT_ATTEMPTS = 5

export class WsClient {
  private ws: WebSocket | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectAttempts = 0
  private listeners: Map<string, Set<WsListener>> = new Map()
  private statusCallbacks: Set<(status: WsStatus) => void> = new Set()
  private url: string

  constructor(url: string) {
    this.url = url
  }

  connect(): void {
    const token = tokenStorage.getAccessToken()
    const wsUrl = token ? `${this.url}?token=${token}` : this.url
    this.setStatus('connecting')
    this.ws = new WebSocket(wsUrl)
    this.ws.onopen = this.handleOpen
    this.ws.onmessage = this.handleMessage
    this.ws.onclose = this.handleClose
    this.ws.onerror = this.handleError
  }

  disconnect(): void {
    this.clearTimers()
    this.reconnectAttempts = MAX_RECONNECT_ATTEMPTS // prevent reconnect
    this.ws?.close()
    this.ws = null
    this.setStatus('closed')
  }

  on(eventType: string, listener: WsListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(listener)
    return () => this.listeners.get(eventType)?.delete(listener)
  }

  onStatusChange(cb: (status: WsStatus) => void): () => void {
    this.statusCallbacks.add(cb)
    return () => this.statusCallbacks.delete(cb)
  }

  private handleOpen = (): void => {
    this.reconnectAttempts = 0
    this.setStatus('open')
    this.startHeartbeat()
  }

  private handleMessage = (event: MessageEvent): void => {
    try {
      const parsed = JSON.parse(event.data as string) as { type?: string }
      const eventType = parsed.type ?? 'unknown'
      const typeListeners = this.listeners.get(eventType)
      const wildcardListeners = this.listeners.get('*')
      typeListeners?.forEach((l) => l(event))
      wildcardListeners?.forEach((l) => l(event))
    } catch {
      // non-JSON message
    }
  }

  private handleClose = (): void => {
    this.clearTimers()
    this.setStatus('closed')
    this.scheduleReconnect()
  }

  private handleError = (): void => {
    this.setStatus('error')
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'heartbeat' }))
      }
    }, HEARTBEAT_INTERVAL_MS)
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return
    this.reconnectAttempts++
    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, RECONNECT_DELAY_MS * this.reconnectAttempts)
  }

  private clearTimers(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer)
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.heartbeatTimer = null
    this.reconnectTimer = null
  }

  private setStatus(status: WsStatus): void {
    this.statusCallbacks.forEach((cb) => cb(status))
  }
}

const WS_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('http', 'ws') + '/ws'
  : 'ws://localhost:8080/ws'

export const wsClient = new WsClient(WS_URL)
