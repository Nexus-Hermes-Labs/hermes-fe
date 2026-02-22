// Mirrors: user-service presentation DTOs

import { z } from 'zod'
import {
  DisplayNameSchema,
  BioSchema,
  CustomStatusTextSchema,
  UserStatusSchema,
  UsernameSchema,
} from '@/domain/user/valueObjects'

export const UpdateProfileSchema = z.object({
  display_name: DisplayNameSchema.optional(),
  bio: BioSchema,
  avatar: z.string().url('Avatar must be a valid URL').optional(),
})

export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>

export const UpdateStatusSchema = z.object({
  status: UserStatusSchema,
  custom_status: CustomStatusTextSchema,
})

export type UpdateStatusData = z.infer<typeof UpdateStatusSchema>

export const UpdateUsernameSchema = z.object({
  username: UsernameSchema,
  current_password: z.string().min(1, 'Current password is required to change username'),
})

export type UpdateUsernameData = z.infer<typeof UpdateUsernameSchema>

export const UpdatePrivacySchema = z.object({
  allow_friend_requests: z.boolean().optional(),
  show_online_status: z.boolean().optional(),
  allow_direct_messages: z.boolean().optional(),
})

export type UpdatePrivacyData = z.infer<typeof UpdatePrivacySchema>
