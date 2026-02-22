// Mirrors: guild-service/src/presentation/dto/guild_role/request.rs

import { z } from 'zod'
import { RoleNameSchema } from '@/domain/guild/valueObjects'

export const CreateRoleSchema = z.object({
  name: RoleNameSchema,
  color: z.number().int().min(0).max(16777215).default(0),
  permissions: z.number().int().min(0).default(0),
  hoist: z.boolean().default(false),
  mentionable: z.boolean().default(false),
})

export type CreateRoleData = z.infer<typeof CreateRoleSchema>

export const UpdateRoleSchema = z.object({
  name: RoleNameSchema.optional(),
  color: z.number().int().min(0).max(16777215).optional(),
  permissions: z.number().int().min(0).optional(),
  hoist: z.boolean().optional(),
  mentionable: z.boolean().optional(),
})

export type UpdateRoleData = z.infer<typeof UpdateRoleSchema>
