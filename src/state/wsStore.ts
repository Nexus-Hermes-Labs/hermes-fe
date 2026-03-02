// WebSocket gateway state — manages connection lifecycle and active subscriptions.
// Mirrors the ClientRegistry / SubscriptionRegistry concepts from realtime-service.

import { create } from 'zustand'
import { wsClient, type WsStatus } from '@/infrastructure/websocket/wsClient'
import { wsEventBus } from '@/infrastructure/websocket/wsEventBus'
import { queryClient } from '@/bootstrap/queryClient'
import type { Message, MessageList } from '@/domain/message/entities'

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

// ── TanStack Query cache helpers ──────────────────────────────────────────────

// Build the partial query key used for setQueriesData partial matching.
// Matches all paginated variants of the message list for a given context.
function messageQueryKey(
  channelId: string | null,
  conversationId: string | null,
): unknown[] | null {
  if (channelId) return ['channels', channelId, 'messages']
  if (conversationId) return ['conversations', conversationId, 'messages']
  return null
}

// ── Side-effect wiring (after store is defined) ───────────────────────────────

// Forward WsClient status changes into the store
wsClient.onStatusChange((status) => {
  useWsStore.setState({ status })
})

// Route NATS events from the WS stream into the TanStack Query cache so that
// all components reading from useGetChannelMessages / useGetConversationMessages
// receive live updates without a full refetch.
wsEventBus.on<MessageCreatePayload>('MESSAGE_CREATE', ({ data }) => {
  if (!data) return
  const qk = messageQueryKey(data.channel_id, data.conversation_id)
  if (!qk) return

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

  // Prepend to every cached page for this context (handles all limit/before variants).
  queryClient.setQueriesData<MessageList>(
    { queryKey: qk },
    (old) => {
      if (!old) return old
      // Deduplicate: skip if the message is already present (e.g. from the sender's own optimistic path)
      if (old.messages.some((m) => m.id === msg.id)) return old
      return { ...old, messages: [msg, ...old.messages] }
    },
  )
})

wsEventBus.on<MessageUpdatePayload>('MESSAGE_UPDATE', ({ data }) => {
  if (!data) return
  const qk = messageQueryKey(data.channel_id, data.conversation_id)
  if (!qk) return

  queryClient.setQueriesData<MessageList>(
    { queryKey: qk },
    (old) => {
      if (!old) return old
      return {
        ...old,
        messages: old.messages.map((m) =>
          m.id === data.message_id
            ? { ...m, content: data.content, editedAt: data.edited_at, updatedAt: data.edited_at }
            : m,
        ),
      }
    },
  )
})

wsEventBus.on<MessageDeletePayload>('MESSAGE_DELETE', ({ data }) => {
  if (!data) return
  const qk = messageQueryKey(data.channel_id, data.conversation_id)
  if (!qk) return

  queryClient.setQueriesData<MessageList>(
    { queryKey: qk },
    (old) => {
      if (!old) return old
      return { ...old, messages: old.messages.filter((m) => m.id !== data.message_id) }
    },
  )
})
