// Mirrors: messaging-service/src/domain/message/entity.rs

import type { MessageType } from './valueObjects'
import type { LanguageCode, Translation } from '@/domain/translation/entities'

export interface Message {
  id: string
  channelId: string | null
  conversationId: string | null
  userId: string
  content: string
  originalLanguage?: LanguageCode
  languageAutoDetected?: boolean
  translations?: Partial<Record<LanguageCode, Translation>>
  messageType: MessageType
  replyToId: string | null
  isDeleted: boolean
  editedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface MessageList {
  messages: Message[]
  hasMore: boolean
}

export interface Reaction {
  id: string
  messageId: string
  userId: string
  emoji: string
  createdAt: string
}

export interface ReactionCount {
  emoji: string
  count: number
}
