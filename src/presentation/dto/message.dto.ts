// Mirrors: messaging-service presentation DTOs

import { z } from 'zod'
import { MessageContentSchema } from '@/domain/message/valueObjects'

export const SendMessageSchema = z.object({
  content: MessageContentSchema,
  replyToId: z.string().uuid('Reply-to ID must be a valid UUID').optional(),
})

export type SendMessageData = z.infer<typeof SendMessageSchema>

export const EditMessageSchema = z.object({
  content: MessageContentSchema,
})

export type EditMessageData = z.infer<typeof EditMessageSchema>

export const GetMessagesSchema = z.object({
  limit: z.number().int().min(1).max(100).default(50),
  before: z.string().uuid().optional(),
})

export type GetMessagesData = z.infer<typeof GetMessagesSchema>
