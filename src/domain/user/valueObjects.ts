// Mirrors: user-service/src/domain/user_profile/valueobject.rs
// Username: 3-32 chars, lowercase letters/numbers/underscore, auto-lowercased
// UserStatus: online | idle | dnd | offline

import { z } from 'zod'

export const UsernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(32, 'Username must be at most 32 characters')
  .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')
  .transform((v) => v.toLowerCase())

export const DisplayNameSchema = z
  .string()
  .min(1, 'Display name is required')
  .max(100, 'Display name must be at most 100 characters')

export const BioSchema = z
  .string()
  .max(500, 'Bio must be at most 500 characters')
  .optional()

export const CustomStatusTextSchema = z
  .string()
  .max(128, 'Custom status must be at most 128 characters')
  .optional()

export const UserStatusSchema = z.enum(['online', 'idle', 'dnd', 'offline'])
export type UserStatus = z.infer<typeof UserStatusSchema>

export const RelationshipTypeSchema = z.enum(['friend', 'blocked', 'pending_outgoing', 'pending_incoming'])
export type RelationshipType = z.infer<typeof RelationshipTypeSchema>
