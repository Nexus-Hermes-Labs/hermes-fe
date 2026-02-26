// Mirrors: messaging-service state — conversation list
// DMs and group DMs keyed by conversation id

import { create } from 'zustand'
import type { Conversation } from '@/domain/conversation/entities'

interface ConversationState {
  conversations: Map<string, Conversation>
  conversationOrder: string[]

  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void
  updateConversation: (conversation: Conversation) => void
  removeConversation: (conversationId: string) => void
  getConversation: (conversationId: string) => Conversation | undefined
  getOrderedConversations: () => Conversation[]
}

export const useConversationStore = create<ConversationState>()((set, get) => ({
  conversations: new Map(),
  conversationOrder: [],

  setConversations: (conversations) => {
    const map = new Map(conversations.map((c) => [c.id, c]))
    set({ conversations: map, conversationOrder: conversations.map((c) => c.id) })
  },

  addConversation: (conversation) =>
    set((state) => {
      const newMap = new Map(state.conversations)
      newMap.set(conversation.id, conversation)
      return {
        conversations: newMap,
        conversationOrder: state.conversationOrder.includes(conversation.id)
          ? state.conversationOrder
          : [conversation.id, ...state.conversationOrder],
      }
    }),

  updateConversation: (conversation) =>
    set((state) => {
      const newMap = new Map(state.conversations)
      newMap.set(conversation.id, conversation)
      return { conversations: newMap }
    }),

  removeConversation: (conversationId) =>
    set((state) => {
      const newMap = new Map(state.conversations)
      newMap.delete(conversationId)
      return {
        conversations: newMap,
        conversationOrder: state.conversationOrder.filter((id) => id !== conversationId),
      }
    }),

  getConversation: (conversationId) => get().conversations.get(conversationId),

  getOrderedConversations: () => {
    const { conversations, conversationOrder } = get()
    return conversationOrder.flatMap((id) => {
      const c = conversations.get(id)
      return c ? [c] : []
    })
  },
}))
