// Mirrors: infrastructure/persistence/postgres/guild/repository.rs
// Full CRUD for guild + members, roles, invites
// Maps backend snake_case → camelCase

import { httpClient } from '../http/client'
import type { Guild, GuildMember, GuildRole, GuildInvite } from '@/domain/guild/entities'

// ── Raw API shapes (snake_case) ───────────────────────────────────────────────
interface RawGuild {
  guild_id: string
  owner_id: string
  name: string
  description: string | null
  icon_url: string | null
  banner_url: string | null
  visibility: string
  member_count: number
  max_members: number
  created_at: string
  updated_at: string
}

interface RawGuildListResponse {
  guilds: RawGuild[]
  total: number
  limit: number
  offset: number
}

// POST /guilds returns the guild + ID of the default #general channel
interface RawCreateGuildResponse extends RawGuild {
  first_channel_id: string
}

interface RawMember {
  guild_id: string
  user_id: string
  nickname: string | null
  role_ids: string[]
  joined_at: string
  left_at: string | null
  user?: {
    user_id: string
    username: string
    display_name: string
    avatar_url: string | null
    status: string
  }
}

interface RawMemberListResponse {
  members: RawMember[]
  total: number
}

interface RawRole {
  role_id: string
  guild_id: string
  name: string
  color: number
  permissions: number
  position: number
  hoist: boolean
  mentionable: boolean
  is_default: boolean
  created_at: string
  updated_at: string
}

interface RawInvite {
  invite_id: string
  guild_id: string
  creator_id: string
  code: string
  max_uses: number | null
  uses: number
  expires_at: string | null
  revoked: boolean
  created_at: string
}

// ── DTOs ──────────────────────────────────────────────────────────────────────
export interface CreateGuildDto {
  name: string
  description?: string
  icon_url?: string
}

export interface UpdateGuildDto {
  name?: string
  description?: string | null
  icon_url?: string | null
  banner_url?: string | null
  visibility?: string
}

export interface SearchGuildsDto {
  query: string
  limit?: number
  offset?: number
}

export interface CreateRoleDto {
  name: string
  color?: number
  permissions?: number
  hoist?: boolean
  mentionable?: boolean
}

export interface UpdateRoleDto {
  name?: string
  color?: number
  permissions?: number
  hoist?: boolean
  mentionable?: boolean
}

export interface CreateInviteDto {
  max_uses?: number
  expires_at?: string
}

// ── Mappers ───────────────────────────────────────────────────────────────────
function mapGuild(raw: RawGuild): Guild {
  return {
    guildId: raw.guild_id,
    ownerId: raw.owner_id,
    name: raw.name,
    description: raw.description,
    iconUrl: raw.icon_url,
    bannerUrl: raw.banner_url,
    visibility: raw.visibility as Guild['visibility'],
    memberCount: raw.member_count,
    maxMembers: raw.max_members,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapMember(raw: RawMember): GuildMember {
  return {
    guildId: raw.guild_id,
    userId: raw.user_id,
    nickname: raw.nickname,
    roleIds: raw.role_ids,
    joinedAt: raw.joined_at,
    leftAt: raw.left_at,
    user: raw.user
      ? {
          userId: raw.user.user_id,
          username: raw.user.username,
          displayName: raw.user.display_name,
          avatarUrl: raw.user.avatar_url,
          status: raw.user.status,
        }
      : undefined,
  }
}

function mapRole(raw: RawRole): GuildRole {
  return {
    roleId: raw.role_id,
    guildId: raw.guild_id,
    name: raw.name,
    color: raw.color,
    permissions: raw.permissions,
    position: raw.position,
    hoist: raw.hoist,
    mentionable: raw.mentionable,
    isDefault: raw.is_default,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapInvite(raw: RawInvite): GuildInvite {
  return {
    inviteId: raw.invite_id,
    guildId: raw.guild_id,
    creatorId: raw.creator_id,
    code: raw.code,
    maxUses: raw.max_uses,
    uses: raw.uses,
    expiresAt: raw.expires_at,
    revoked: raw.revoked,
    createdAt: raw.created_at,
  }
}

// ── Repository ────────────────────────────────────────────────────────────────
export const guildRepository = {
  // Backend: GET /guilds/@me — guilds the current user is a member of
  async getMyGuilds(): Promise<Guild[]> {
    const { data } = await httpClient.get<RawGuildListResponse>('/guilds/@me')
    return data.guilds.map(mapGuild)
  },

  async create(dto: CreateGuildDto): Promise<{ guild: Guild; firstChannelId: string }> {
    const { data } = await httpClient.post<RawCreateGuildResponse>('/guilds', dto)
    return { guild: mapGuild(data), firstChannelId: data.first_channel_id }
  },

  async getById(guildId: string): Promise<Guild> {
    const { data } = await httpClient.get<RawGuild>(`/guilds/${guildId}`)
    return mapGuild(data)
  },

  async update(guildId: string, dto: UpdateGuildDto): Promise<Guild> {
    const { data } = await httpClient.patch<RawGuild>(`/guilds/${guildId}`, dto)
    return mapGuild(data)
  },

  async delete(guildId: string): Promise<void> {
    await httpClient.delete(`/guilds/${guildId}`)
  },

  async search(dto: SearchGuildsDto): Promise<{ guilds: Guild[]; total: number }> {
    const { data } = await httpClient.get<RawGuildListResponse>('/guilds/search', {
      params: { query: dto.query, limit: dto.limit ?? 20, offset: dto.offset ?? 0 },
    })
    return {
      guilds: data.guilds.map(mapGuild),
      total: data.total,
    }
  },

  // Backend: GET /guilds/:guild_id/members  → { members: [...], total }
  async getMembers(guildId: string): Promise<GuildMember[]> {
    const { data } = await httpClient.get<RawMemberListResponse>(`/guilds/${guildId}/members`)
    return data.members.map(mapMember)
  },

  // Backend: GET /guilds/:guild_id/members/:user_id
  async getMember(guildId: string, userId: string): Promise<GuildMember> {
    const { data } = await httpClient.get<RawMember>(`/guilds/${guildId}/members/${userId}`)
    return mapMember(data)
  },

  // Backend: DELETE /guilds/:guild_id/members/:user_id  body: { reason? }
  async kickMember(guildId: string, userId: string, reason?: string): Promise<void> {
    await httpClient.delete(`/guilds/${guildId}/members/${userId}`, {
      data: reason ? { reason } : undefined,
    })
  },

  // Backend: PUT /guilds/:guild_id/members/:user_id/roles  body: { role_id }
  async addMemberRole(guildId: string, userId: string, roleId: string): Promise<void> {
    await httpClient.put(`/guilds/${guildId}/members/${userId}/roles`, { role_id: roleId })
  },

  // Backend: DELETE /guilds/:guild_id/members/:user_id/roles/:role_id
  async removeMemberRole(guildId: string, userId: string, roleId: string): Promise<void> {
    await httpClient.delete(`/guilds/${guildId}/members/${userId}/roles/${roleId}`)
  },

  async getRoles(guildId: string): Promise<GuildRole[]> {
    const { data } = await httpClient.get<RawRole[]>(`/guilds/${guildId}/roles`)
    return data.map(mapRole)
  },

  async getRole(guildId: string, roleId: string): Promise<GuildRole> {
    const { data } = await httpClient.get<RawRole>(`/guilds/${guildId}/roles/${roleId}`)
    return mapRole(data)
  },

  async createRole(guildId: string, dto: CreateRoleDto): Promise<GuildRole> {
    const { data } = await httpClient.post<RawRole>(`/guilds/${guildId}/roles`, dto)
    return mapRole(data)
  },

  async updateRole(guildId: string, roleId: string, dto: UpdateRoleDto): Promise<GuildRole> {
    const { data } = await httpClient.patch<RawRole>(`/guilds/${guildId}/roles/${roleId}`, dto)
    return mapRole(data)
  },

  async deleteRole(guildId: string, roleId: string): Promise<void> {
    await httpClient.delete(`/guilds/${guildId}/roles/${roleId}`)
  },

  async createInvite(guildId: string, dto: CreateInviteDto): Promise<GuildInvite> {
    const { data } = await httpClient.post<RawInvite>(`/guilds/${guildId}/invites`, dto)
    return mapInvite(data)
  },

  async getInvites(guildId: string): Promise<GuildInvite[]> {
    const { data } = await httpClient.get<RawInvite[]>(`/guilds/${guildId}/invites`)
    return data.map(mapInvite)
  },

  // Backend: DELETE /guilds/:guild_id/invites/:code  (code is 8-char string, not UUID)
  async deleteInvite(guildId: string, code: string): Promise<void> {
    await httpClient.delete(`/guilds/${guildId}/invites/${code}`)
  },

  // Backend: GET /invites/:code (public invite preview)
  async getInviteByCode(code: string): Promise<GuildInvite> {
    const { data } = await httpClient.get<RawInvite>(`/invites/${code}`)
    return mapInvite(data)
  },

  // Backend: POST /invites/:code/use
  async joinByCode(code: string): Promise<Guild> {
    const { data } = await httpClient.post<RawGuild>(`/invites/${code}/use`)
    return mapGuild(data)
  },

  // Backend: DELETE /guilds/:guild_id/members/@me
  async leave(guildId: string): Promise<void> {
    await httpClient.delete(`/guilds/${guildId}/members/@me`)
  },
}
