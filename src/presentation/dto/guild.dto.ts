// Mirrors: guild-service/src/presentation/dto/guild/request.rs

import { z } from 'zod'
import {
  GuildNameSchema,
  GuildDescriptionSchema,
  GuildVisibilitySchema,
} from '@/domain/guild/valueObjects'

export const CreateGuildSchema = z.object({
  name: GuildNameSchema,
  description: GuildDescriptionSchema,
  icon_url: z.string().url('Icon URL must be a valid URL').optional(),
})

export type CreateGuildData = z.infer<typeof CreateGuildSchema>

export const UpdateGuildSchema = z.object({
  name: GuildNameSchema.optional(),
  description: GuildDescriptionSchema,
  icon_url: z.string().url('Icon URL must be a valid URL').optional().nullable(),
  banner_url: z.string().url('Banner URL must be a valid URL').optional().nullable(),
  visibility: GuildVisibilitySchema.optional(),
})

export type UpdateGuildData = z.infer<typeof UpdateGuildSchema>

export const SearchGuildsSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

export type SearchGuildsData = z.infer<typeof SearchGuildsSchema>
