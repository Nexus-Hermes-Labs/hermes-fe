// WebSocket client — connects to realtime-service with JWT token from ?token= query param
// Backend protocol uses `op` field (not `type`) matching ServerMsg / ClientMsg enums

import { tokenStorage } from '../storage/tokenStorage'

export type WsStatus = 'connecting' | 'open' | 'closed' | 'error'
type WsListener = (event: MessageEvent) => void

const HEARTBEAT_INTERVAL_MS = 30_000
const RECONNECT_BASE_DELAY_MS = 2_000
const MAX_RECONNECT_ATTEMPTS = 5

// In dev the Vite dev server proxies nothing for WS — connect direct through
// Traefik (port 80) which routes /ws → realtime-service.
const WS_BASE =
  typeof window !== 'undefined'
    ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
    : 'ws://localhost/ws'

export class WsClient {
  private ws: WebSocket | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectAttempts = 0
  private explicitDisconnect = false
  /** op → handlers */
  private listeners: Map<string, Set<WsListener>> = new Map()
  private statusCallbacks: Set<(status: WsStatus) => void> = new Set()

  connect(): void {
    const token = tokenStorage.getAccessToken()
    if (!token) return
    this.explicitDisconnect = false
    const url = `${WS_BASE}?token=${token}`
    this.setStatus('connecting')
    this.ws = new WebSocket(url)
    this.ws.onopen = this.handleOpen
    this.ws.onmessage = this.handleMessage
    this.ws.onclose = this.handleClose
    this.ws.onerror = this.handleError
  }

  disconnect(): void {
    this.explicitDisconnect = true
    this.clearTimers()
    this.ws?.close()
    this.ws = null
    this.setStatus('closed')
  }

  /** Send a SUBSCRIBE frame for the given channel/conversation UUID */
  subscribe(contextId: string): void {
    this.send({ op: 'SUBSCRIBE', context_id: contextId })
  }

  /** Send an UNSUBSCRIBE frame for the given channel/conversation UUID */
  unsubscribe(contextId: string): void {
    this.send({ op: 'UNSUBSCRIBE', context_id: contextId })
  }

  /** Register a handler for a specific server `op` code */
  on(op: string, listener: WsListener): () => void {
    if (!this.listeners.has(op)) this.listeners.set(op, new Set())
    this.listeners.get(op)!.add(listener)
    return () => this.listeners.get(op)?.delete(listener)
  }

  onStatusChange(cb: (status: WsStatus) => void): () => void {
    this.statusCallbacks.add(cb)
    return () => this.statusCallbacks.delete(cb)
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  private send(payload: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload))
    }
  }

  private handleOpen = (): void => {
    this.reconnectAttempts = 0
    this.setStatus('open')
    this.startHeartbeat()
  }

  private handleMessage = (event: MessageEvent): void => {
    try {
      const parsed = JSON.parse(event.data as string) as { op?: string }
      const op = parsed.op ?? 'UNKNOWN'
      this.listeners.get(op)?.forEach((l) => l(event))
      this.listeners.get('*')?.forEach((l) => l(event))
    } catch {
      // ignore non-JSON frames
    }
  }

  private handleClose = (): void => {
    this.clearTimers()
    this.setStatus('closed')
    if (!this.explicitDisconnect) {
      this.scheduleReconnect()
    }
  }

  private handleError = (): void => {
    this.setStatus('error')
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.send({ op: 'HEARTBEAT' })
    }, HEARTBEAT_INTERVAL_MS)
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return
    this.reconnectAttempts++
    const delay = RECONNECT_BASE_DELAY_MS * this.reconnectAttempts
    this.reconnectTimer = setTimeout(() => this.connect(), delay)
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

export const wsClient = new WsClient()
