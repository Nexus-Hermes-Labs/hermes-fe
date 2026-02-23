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
  bio: BioSchema.optional(),
  avatar_url: z.string().url('Avatar must be a valid URL').optional(),
  banner_url: z.string().url('Banner must be a valid URL').optional(),
})

export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>

// Backend: PUT /users/@me/status  body: { status }
export const UpdateStatusSchema = z.object({
  status: UserStatusSchema,
})

export type UpdateStatusData = z.infer<typeof UpdateStatusSchema>

// Backend: PUT /users/@me/custom-status  body: { text?, emoji?, expires_at? }
export const UpdateCustomStatusSchema = z.object({
  text: CustomStatusTextSchema.nullable().optional(),
  emoji: z.string().max(64).nullable().optional(),
  expires_at: z.string().datetime().nullable().optional(),
})

export type UpdateCustomStatusData = z.infer<typeof UpdateCustomStatusSchema>

// Backend: PUT /users/@me/username  body: { new_username }
// Form uses `username` as field key; repository maps → new_username internally
export const UpdateUsernameSchema = z.object({
  username: UsernameSchema,
  current_password: z.string().min(1, 'Current password is required to change username'),
})

export type UpdateUsernameData = z.infer<typeof UpdateUsernameSchema>

// Privacy — granular per backend endpoints
export const UpdateDmPrivacySchema = z.object({
  allow_dms_from: z.enum(['Everyone', 'Friends', 'ServerMembers', 'None']),
})
export type UpdateDmPrivacyData = z.infer<typeof UpdateDmPrivacySchema>

export const UpdateFriendRequestPrivacySchema = z.object({
  allow_friend_requests_from: z.enum(['Everyone', 'FriendsOfFriends', 'None']),
})
export type UpdateFriendRequestPrivacyData = z.infer<typeof UpdateFriendRequestPrivacySchema>

export const UpdateVisibilityPrivacySchema = z.object({
  show_online_status: z.boolean().optional(),
  show_current_activity: z.boolean().optional(),
  show_profile_to_non_friends: z.boolean().optional(),
})
export type UpdateVisibilityPrivacyData = z.infer<typeof UpdateVisibilityPrivacySchema>

export const UpdateContentPrivacySchema = z.object({
  allow_nsfw_content: z.boolean().optional(),
  content_filter_level: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
})
export type UpdateContentPrivacyData = z.infer<typeof UpdateContentPrivacySchema>

// Legacy export for backward compatibility with existing useUpdatePrivacy hook
export const UpdatePrivacySchema = z.object({
  allow_dms_from: z.enum(['Everyone', 'Friends', 'ServerMembers', 'None']).optional(),
  allow_friend_requests_from: z.enum(['Everyone', 'FriendsOfFriends', 'None']).optional(),
  show_online_status: z.boolean().optional(),
  show_current_activity: z.boolean().optional(),
  show_profile_to_non_friends: z.boolean().optional(),
  allow_nsfw_content: z.boolean().optional(),
  content_filter_level: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
})
export type UpdatePrivacyData = z.infer<typeof UpdatePrivacySchema>
