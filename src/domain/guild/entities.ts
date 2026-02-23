// Mirrors: guild-service/src/domain/guild/entity.rs
//          guild-service/src/domain/guild_member/entity.rs
//          guild-service/src/domain/guild_role/entity.rs
//          guild-service/src/domain/guild_invite/entity.rs

import type { GuildVisibility } from './valueObjects'

export interface Guild {
  guildId: string
  ownerId: string
  name: string
  description: string | null
  iconUrl: string | null
  bannerUrl: string | null
  visibility: GuildVisibility
  memberCount: number
  maxMembers: number
  createdAt: string
  updatedAt: string
}

export interface GuildMember {
  guildId: string
  userId: string
  nickname: string | null
  roleIds: string[]
  joinedAt: string
  leftAt: string | null
  user?: {
    userId: string
    username: string
    displayName: string
    avatarUrl: string | null
    status: string
  }
}

export interface GuildRole {
  roleId: string
  guildId: string
  name: string
  color: number
  permissions: number
  position: number
  hoist: boolean
  mentionable: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface GuildInvite {
  inviteId: string
  guildId: string
  creatorId: string
  code: string
  maxUses: number | null
  uses: number
  expiresAt: string | null
  revoked: boolean
  createdAt: string
}
