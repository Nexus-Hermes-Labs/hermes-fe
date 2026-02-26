// Mirrors: messaging-service/src/domain/conversation/valueobject.rs
// ConversationType: dm | group_dm
// GroupDm name: 1-100 chars
// GroupDm member count: 3-10

import { z } from 'zod'

export const ConversationTypeSchema = z.enum(['dm', 'group_dm'])
export type ConversationType = z.infer<typeof ConversationTypeSchema>

export const GroupDmNameSchema = z
  .string()
  .min(1, 'Group name is required')
  .max(100, 'Group name must be at most 100 characters')
  .transform((v) => v.trim())
  .refine((v) => v.length >= 1, 'Group name cannot be empty after trimming')
