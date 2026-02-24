// Mirrors: channel-service presentation DTOs

import { z } from 'zod'
import { ChannelNameSchema, ChannelTypeSchema, ChannelDescriptionSchema } from '@/domain/channel/valueObjects'

export const CreateChannelSchema = z.object({
  name: ChannelNameSchema,
  channel_type: ChannelTypeSchema.optional(),
  description: ChannelDescriptionSchema,
  parent_id: z.string().uuid('Parent ID must be a valid UUID').optional(),
  position: z.number().int().min(0).optional(),
})

export type CreateChannelData = z.infer<typeof CreateChannelSchema>

export const UpdateChannelSchema = z.object({
  name: ChannelNameSchema.optional(),
  description: ChannelDescriptionSchema,
  parent_id: z.string().uuid().optional().nullable(),
  position: z.number().int().min(0).optional(),
})

export type UpdateChannelData = z.infer<typeof UpdateChannelSchema>
