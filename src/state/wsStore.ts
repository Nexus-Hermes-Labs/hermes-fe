// WebSocket gateway state — manages connection lifecycle and active subscriptions.
// Mirrors the ClientRegistry / SubscriptionRegistry concepts from realtime-service.

import { create } from 'zustand'
import { wsClient, type WsStatus } from '@/infrastructure/websocket/wsClient'
import { wsEventBus } from '@/infrastructure/websocket/wsEventBus'
import { useMessageStore } from './messageStore'
import type { Message } from '@/domain/message/entities'

interface WsState {
  status: WsStatus
  /** Set of context UUIDs (channel or conversation) currently subscribed */
  subscriptions: Set<string>

  /** Open the WebSocket connection (call after user is authenticated) */
  connect: () => void
  /** Close the connection and clear subscriptions */
  disconnect: () => void
  /** Subscribe to real-time events for a channel or conversation */
  subscribe: (contextId: string) => void
  /** Unsubscribe from a context */
  unsubscribe: (contextId: string) => void
}

// ── NATS event payload shapes (must match nats_publisher.rs) ──────────────────

interface MessageCreatePayload {
  message_id: string
  channel_id: string | null
  conversation_id: string | null
  user_id: string
  content: string
  created_at: string
}

interface MessageUpdatePayload {
  message_id: string
  channel_id: string | null
  conversation_id: string | null
  content: string
  edited_at: string
}

interface MessageDeletePayload {
  message_id: string
  channel_id: string | null
  conversation_id: string | null
  user_id: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveKey(
  channelId: string | null,
  conversationId: string | null,
): `channel:${string}` | `conversation:${string}` | null {
  if (channelId) return `channel:${channelId}`
  if (conversationId) return `conversation:${conversationId}`
  return null
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useWsStore = create<WsState>()((set, get) => ({
  status: 'closed',
  subscriptions: new Set(),

  connect() {
    wsClient.connect()
  },

  disconnect() {
    get().subscriptions.forEach((id) => wsClient.unsubscribe(id))
    wsClient.disconnect()
    set({ subscriptions: new Set() })
  },

  subscribe(contextId: string) {
    set((state) => {
      if (state.subscriptions.has(contextId)) return state
      wsClient.subscribe(contextId)
      const next = new Set(state.subscriptions)
      next.add(contextId)
      return { subscriptions: next }
    })
  },

  unsubscribe(contextId: string) {
    set((state) => {
      if (!state.subscriptions.has(contextId)) return state
      wsClient.unsubscribe(contextId)
      const next = new Set(state.subscriptions)
      next.delete(contextId)
      return { subscriptions: next }
    })
  },
}))

// ── Side-effect wiring (after store is defined) ───────────────────────────────

// Forward WsClient status changes into the store
wsClient.onStatusChange((status) => {
  useWsStore.setState({ status })
})

// Route NATS events from the WS stream into the message store
wsEventBus.on<MessageCreatePayload>('MESSAGE_CREATE', ({ data }) => {
  if (!data) return
  const key = resolveKey(data.channel_id, data.conversation_id)
  if (!key) return
  const msg: Message = {
    id: data.message_id,
    channelId: data.channel_id,
    conversationId: data.conversation_id,
    userId: data.user_id,
    content: data.content,
    messageType: 'text',
    replyToId: null,
    editedAt: null,
    isDeleted: false,
    createdAt: data.created_at,
    updatedAt: data.created_at,
  }
  useMessageStore.getState().appendMessage(key, msg)
})

wsEventBus.on<MessageUpdatePayload>('MESSAGE_UPDATE', ({ data }) => {
  if (!data) return
  const key = resolveKey(data.channel_id, data.conversation_id)
  if (!key) return
  const store = useMessageStore.getState()
  const page = store.getPage(key)
  const existing = page?.messages.find((m) => m.id === data.message_id)
  if (!existing) return
  store.updateMessage(key, {
    ...existing,
    content: data.content,
    editedAt: data.edited_at,
    updatedAt: data.edited_at,
  })
})

wsEventBus.on<MessageDeletePayload>('MESSAGE_DELETE', ({ data }) => {
  if (!data) return
  const key = resolveKey(data.channel_id, data.conversation_id)
  if (!key) return
  useMessageStore.getState().removeMessage(key, data.message_id)
})
