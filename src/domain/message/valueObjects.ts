// Mirrors: messaging-service/src/domain/message/valueobject.rs
// MessageContent: 1-2000 chars
// MessageType: text | system
// Emoji: 1-32 chars, non-empty

import { z } from 'zod'

export const MessageContentSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(2000, 'Message must be at most 2000 characters')

export const MessageTypeSchema = z.enum(['text', 'system'])
export type MessageType = z.infer<typeof MessageTypeSchema>

export const EmojiSchema = z
  .string()
  .min(1, 'Emoji cannot be empty')
  .max(32, 'Emoji must be at most 32 characters')

export const MessageLimitSchema = z
  .number()
  .int()
  .min(1)
  .max(100)
  .default(50)
