// Mirrors: messaging-service/src/domain/conversation/entity.rs

import type { ConversationType } from './valueObjects'

export interface ConversationMember {
  userId: string
  joinedAt: string
}

export interface Conversation {
  id: string
  conversationType: ConversationType
  name: string | null
  createdAt: string
  updatedAt: string
  members: ConversationMember[]
}

export interface ConversationList {
  conversations: Conversation[]
  total: number
}
