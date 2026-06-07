// Mirrors: messaging-service presentation layer
// Routes:
//   GET  /channels/{channel_id}/messages?limit=&before=
//   POST /channels/{channel_id}/messages
//   GET  /conversations/{conversation_id}/messages?limit=&before=
//   POST /conversations/{conversation_id}/messages
//   PATCH /messages/{message_id}
//   DELETE /messages/{message_id}
//   GET  /messages/{message_id}/reactions
//   GET  /messages/{message_id}/reactions/{emoji}/count
//   PUT  /messages/{message_id}/reactions/{emoji}
//   DELETE /messages/{message_id}/reactions/{emoji}

import { httpClient } from '../http/client'
import type { Message, MessageList, Reaction, ReactionCount } from '@/domain/message/entities'
import type { LanguageCode, Translation } from '@/domain/translation/entities'

// ── Raw shapes ────────────────────────────────────────────────────────────────

interface RawMessage {
  id: string
  channel_id: string | null
  conversation_id: string | null
  user_id: string
  content: string
  original_language?: LanguageCode | null
  language_auto_detected?: boolean | null
  translations?: Partial<Record<LanguageCode, Translation>> | null
  message_type: string
  reply_to_id: string | null
  is_deleted: boolean
  edited_at: string | null
  created_at: string
  updated_at: string
}

interface RawMessageListResponse {
  messages: RawMessage[]
  has_more: boolean
}

interface RawReaction {
  id: string
  message_id: string
  user_id: string
  emoji: string
  created_at: string
}

interface RawReactionCount {
  emoji: string
  count: number
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface SendMessageDto {
  content: string
  reply_to_id?: string
}

export interface EditMessageDto {
  content: string
}

export interface GetMessagesParams {
  limit?: number
  before?: string
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapMessage(raw: RawMessage): Message {
  return {
    id: raw.id,
    channelId: raw.channel_id,
    conversationId: raw.conversation_id,
    userId: raw.user_id,
    content: raw.content,
    originalLanguage: raw.original_language ?? undefined,
    languageAutoDetected: raw.language_auto_detected ?? undefined,
    translations: raw.translations ?? undefined,
    messageType: raw.message_type as Message['messageType'],
    replyToId: raw.reply_to_id,
    isDeleted: raw.is_deleted,
    editedAt: raw.edited_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapMessageList(raw: RawMessageListResponse): MessageList {
  return {
    messages: raw.messages.map(mapMessage),
    hasMore: raw.has_more,
  }
}

function mapReaction(raw: RawReaction): Reaction {
  return {
    id: raw.id,
    messageId: raw.message_id,
    userId: raw.user_id,
    emoji: raw.emoji,
    createdAt: raw.created_at,
  }
}

// ── Repository ────────────────────────────────────────────────────────────────

export const messageRepository = {
  // ── Channel messages ────────────────────────────────────────────────────────

  async getChannelMessages(
    channelId: string,
    params: GetMessagesParams = {},
  ): Promise<MessageList> {
    const { data } = await httpClient.get<RawMessageListResponse>(
      `/channels/${channelId}/messages`,
      { params },
    )
    return mapMessageList(data)
  },

  async sendChannelMessage(channelId: string, dto: SendMessageDto): Promise<Message> {
    const { data } = await httpClient.post<RawMessage>(`/channels/${channelId}/messages`, dto)
    return mapMessage(data)
  },

  // ── Conversation messages ───────────────────────────────────────────────────

  async getConversationMessages(
    conversationId: string,
    params: GetMessagesParams = {},
  ): Promise<MessageList> {
    const { data } = await httpClient.get<RawMessageListResponse>(
      `/conversations/${conversationId}/messages`,
      { params },
    )
    return mapMessageList(data)
  },

  async sendConversationMessage(conversationId: string, dto: SendMessageDto): Promise<Message> {
    const { data } = await httpClient.post<RawMessage>(
      `/conversations/${conversationId}/messages`,
      dto,
    )
    return mapMessage(data)
  },

  // ── Message operations ──────────────────────────────────────────────────────

  async editMessage(messageId: string, dto: EditMessageDto): Promise<Message> {
    const { data } = await httpClient.patch<RawMessage>(`/messages/${messageId}`, dto)
    return mapMessage(data)
  },

  async deleteMessage(messageId: string): Promise<void> {
    await httpClient.delete(`/messages/${messageId}`)
  },

  // ── Reactions ───────────────────────────────────────────────────────────────

  async getReactions(messageId: string): Promise<Reaction[]> {
    const { data } = await httpClient.get<RawReaction[]>(`/messages/${messageId}/reactions`)
    return data.map(mapReaction)
  },

  async countReactions(messageId: string, emoji: string): Promise<ReactionCount> {
    const { data } = await httpClient.get<RawReactionCount>(
      `/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/count`,
    )
    return data
  },

  async addReaction(messageId: string, emoji: string): Promise<Reaction> {
    const { data } = await httpClient.put<RawReaction>(
      `/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
    )
    return mapReaction(data)
  },

  async removeReaction(messageId: string, emoji: string): Promise<void> {
    await httpClient.delete(`/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`)
  },
}
