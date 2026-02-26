// Mirrors: messaging-service state — messages per channel/conversation
// Uses composite key "channel:{id}" or "conversation:{id}" for O(1) lookups
// Newest-first order, cursor-based pagination (before_id)

import { create } from 'zustand'
import type { Message } from '@/domain/message/entities'

type TargetKey = `channel:${string}` | `conversation:${string}`

interface MessagePage {
  messages: Message[]
  hasMore: boolean
}

interface MessageState {
  pages: Map<TargetKey, MessagePage>

  setMessages: (key: TargetKey, page: MessagePage) => void
  prependMessages: (key: TargetKey, page: MessagePage) => void
  appendMessage: (key: TargetKey, message: Message) => void
  updateMessage: (key: TargetKey, updated: Message) => void
  removeMessage: (key: TargetKey, messageId: string) => void
  getPage: (key: TargetKey) => MessagePage | undefined
  clear: (key: TargetKey) => void
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  pages: new Map(),

  setMessages: (key, page) =>
    set((state) => {
      const next = new Map(state.pages)
      next.set(key, page)
      return { pages: next }
    }),

  // Prepend older messages (loaded via "load more / before_id")
  prependMessages: (key, page) =>
    set((state) => {
      const next = new Map(state.pages)
      const existing = next.get(key)
      if (existing) {
        next.set(key, {
          messages: [...existing.messages, ...page.messages],
          hasMore: page.hasMore,
        })
      } else {
        next.set(key, page)
      }
      return { pages: next }
    }),

  // Append a new incoming message at the top (newest-first list)
  appendMessage: (key, message) =>
    set((state) => {
      const next = new Map(state.pages)
      const existing = next.get(key)
      if (existing) {
        next.set(key, {
          ...existing,
          messages: [message, ...existing.messages],
        })
      }
      return { pages: next }
    }),

  updateMessage: (key, updated) =>
    set((state) => {
      const next = new Map(state.pages)
      const existing = next.get(key)
      if (existing) {
        next.set(key, {
          ...existing,
          messages: existing.messages.map((m) => (m.id === updated.id ? updated : m)),
        })
      }
      return { pages: next }
    }),

  removeMessage: (key, messageId) =>
    set((state) => {
      const next = new Map(state.pages)
      const existing = next.get(key)
      if (existing) {
        next.set(key, {
          ...existing,
          messages: existing.messages.filter((m) => m.id !== messageId),
        })
      }
      return { pages: next }
    }),

  getPage: (key) => get().pages.get(key),

  clear: (key) =>
    set((state) => {
      const next = new Map(state.pages)
      next.delete(key)
      return { pages: next }
    }),
}))

// Helper to build target keys
export const messageKey = {
  channel: (channelId: string): TargetKey => `channel:${channelId}`,
  conversation: (conversationId: string): TargetKey => `conversation:${conversationId}`,
}
