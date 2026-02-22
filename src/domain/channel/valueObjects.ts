// Mirrors: channel-service/src/domain/channel/valueobject.rs
// ChannelName: 1-100 chars, trimmed, no control chars
// ChannelType: text | voice | category | announcement (default: text)

import { z } from 'zod'

export const ChannelNameSchema = z
  .string()
  .min(1, 'Channel name is required')
  .max(100, 'Channel name must be at most 100 characters')
  .transform((v) => v.trim())
  .refine((v) => v.length >= 1, 'Channel name cannot be empty after trimming')
  .refine((v) => !/[\x00-\x1F\x7F]/.test(v), 'Channel name contains invalid control characters')

export const ChannelTypeSchema = z.enum(['text', 'voice', 'category', 'announcement'])
export type ChannelType = z.infer<typeof ChannelTypeSchema>

export const ChannelTopicSchema = z
  .string()
  .max(1024, 'Topic must be at most 1024 characters')
  .optional()
