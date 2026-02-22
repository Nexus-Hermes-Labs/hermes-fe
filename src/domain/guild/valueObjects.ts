// Mirrors: guild-service/src/domain/guild/valueobject.rs
//          guild-service/src/domain/guild_role/valueobject.rs
//          guild-service/src/domain/guild_invite/valueobject.rs
//
// GuildName: 2-100 chars, trimmed, at least one alphanumeric, no control chars
// GuildVisibility: public | private (default: private)
// Permissions: 64-bit bitfield mirroring Rust Permissions struct
// RoleColor: RGB int (0 = no color), hex string conversion
// InviteCode: 8-char alphanumeric

import { z } from 'zod'

export const GuildNameSchema = z
  .string()
  .min(2, 'Guild name must be at least 2 characters')
  .max(100, 'Guild name must be at most 100 characters')
  .transform((v) => v.trim())
  .refine((v) => v.length >= 2, 'Guild name too short after trimming')
  .refine((v) => /[a-zA-Z0-9]/.test(v), 'Guild name must contain at least one alphanumeric character')
  .refine((v) => !/[\x00-\x1F\x7F]/.test(v), 'Guild name contains invalid control characters')

export const GuildDescriptionSchema = z
  .string()
  .max(1000, 'Description must be at most 1000 characters')
  .optional()

export const GuildVisibilitySchema = z.enum(['public', 'private'])
export type GuildVisibility = z.infer<typeof GuildVisibilitySchema>

export const InviteCodeSchema = z
  .string()
  .length(8, 'Invite code must be exactly 8 characters')
  .regex(/^[a-zA-Z0-9]+$/, 'Invite code must be alphanumeric')

export const RoleNameSchema = z
  .string()
  .min(1, 'Role name is required')
  .max(100, 'Role name must be at most 100 characters')

// Mirrors: guild-service/src/domain/guild_role/valueobject.rs Permissions struct
// Exact bit positions from backend source
export const PERMISSIONS = {
  // Message Permissions (Bits 0-9)
  SEND_MESSAGES: 1 << 0,          // 1
  READ_MESSAGE_HISTORY: 1 << 1,   // 2
  EMBED_LINKS: 1 << 2,            // 4
  ATTACH_FILES: 1 << 3,           // 8
  MENTION_EVERYONE: 1 << 4,       // 16
  // Voice Permissions (Bits 10-19)
  CONNECT: 1 << 10,               // 1024
  SPEAK: 1 << 11,                 // 2048
  MUTE_MEMBERS: 1 << 12,          // 4096
  DEAFEN_MEMBERS: 1 << 13,        // 8192
  // Moderation & Management (Bits 20-30)
  KICK_MEMBERS: 1 << 20,          // 1048576
  BAN_MEMBERS: 1 << 21,           // 2097152
  MANAGE_MESSAGES: 1 << 22,       // 4194304
  MANAGE_ROLES: 1 << 23,          // 8388608
  MANAGE_CHANNELS: 1 << 24,       // 16777216
  MANAGE_GUILD: 1 << 25,          // 33554432
  // Special Permissions
  ADMINISTRATOR: 1 << 31,         // 2147483648
} as const

export type PermissionKey = keyof typeof PERMISSIONS

// RoleColor helpers — mirrors guild-service/src/domain/guild_role/valueobject.rs RoleColor
export function rgbIntToHex(rgb: number): string {
  return `#${rgb.toString(16).padStart(6, '0').toUpperCase()}`
}

export function hexToRgbInt(hex: string): number {
  const clean = hex.replace('#', '')
  return parseInt(clean, 16)
}
