// Mirrors: messaging-service conversation DTOs

import { z } from 'zod'
import { GroupDmNameSchema } from '@/domain/conversation/valueObjects'

export const OpenDmSchema = z.object({
  targetUserId: z.string().uuid('Target user ID must be a valid UUID'),
})

export type OpenDmData = z.infer<typeof OpenDmSchema>

export const CreateGroupDmSchema = z.object({
  name: GroupDmNameSchema,
  memberIds: z
    .array(z.string().uuid('Member ID must be a valid UUID'))
    .min(2, 'Group DM requires at least 2 other members')
    .max(9, 'Group DM can have at most 9 other members'),
})

export type CreateGroupDmData = z.infer<typeof CreateGroupDmSchema>

export const AddConversationMemberSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
})

export type AddConversationMemberData = z.infer<typeof AddConversationMemberSchema>
