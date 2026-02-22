// Mirrors: infrastructure/persistence/postgres/user_profile/repository.rs
// Routes: GET /users/@me, PATCH /users/@me, GET /users/:id, etc.

import { httpClient } from '../http/client'
import type { UserProfile, UserPrivacy, UserRelationship } from '@/domain/user/entities'

// ── Raw shapes ────────────────────────────────────────────────────────────────
interface RawUserProfile {
  user_id: string
  email: string
  username: string
  display_name: string
  avatar: string | null
  bio: string | null
  custom_status: string | null
  status: string
  created_at: string
  updated_at: string
}

interface RawPrivacy {
  user_id: string
  allow_friend_requests: boolean
  show_online_status: boolean
  allow_direct_messages: boolean
}

interface RawRelationship {
  relationship_id: string
  user_id: string
  target_user_id: string
  target_user: {
    user_id: string
    username: string
    display_name: string
    avatar: string | null
    status: string
  }
  relationship_type: string
  created_at: string
}

// ── DTOs ──────────────────────────────────────────────────────────────────────
export interface UpdateProfileDto {
  display_name?: string
  bio?: string
  avatar?: string
}

export interface UpdateStatusDto {
  status: string
  custom_status?: string
}

export interface UpdateUsernameDto {
  username: string
}

export interface UpdatePrivacyDto {
  allow_friend_requests?: boolean
  show_online_status?: boolean
  allow_direct_messages?: boolean
}

// ── Mappers ───────────────────────────────────────────────────────────────────
function mapProfile(raw: RawUserProfile): UserProfile {
  return {
    userId: raw.user_id,
    email: raw.email,
    username: raw.username,
    displayName: raw.display_name,
    avatar: raw.avatar,
    bio: raw.bio,
    customStatus: raw.custom_status,
    status: raw.status as UserProfile['status'],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapPrivacy(raw: RawPrivacy): UserPrivacy {
  return {
    userId: raw.user_id,
    allowFriendRequests: raw.allow_friend_requests,
    showOnlineStatus: raw.show_online_status,
    allowDirectMessages: raw.allow_direct_messages,
  }
}

function mapRelationship(raw: RawRelationship): UserRelationship {
  return {
    relationshipId: raw.relationship_id,
    userId: raw.user_id,
    targetUserId: raw.target_user_id,
    targetUser: {
      userId: raw.target_user.user_id,
      username: raw.target_user.username,
      displayName: raw.target_user.display_name,
      avatar: raw.target_user.avatar,
      status: raw.target_user.status as UserProfile['status'],
    },
    relationshipType: raw.relationship_type as UserRelationship['relationshipType'],
    createdAt: raw.created_at,
  }
}

// ── Repository ────────────────────────────────────────────────────────────────
export const userRepository = {
  async getMe(): Promise<UserProfile> {
    const { data } = await httpClient.get<RawUserProfile>('/users/@me')
    return mapProfile(data)
  },

  async updateMe(dto: UpdateProfileDto): Promise<UserProfile> {
    const { data } = await httpClient.patch<RawUserProfile>('/users/@me', dto)
    return mapProfile(data)
  },

  async updateUsername(dto: UpdateUsernameDto): Promise<UserProfile> {
    const { data } = await httpClient.patch<RawUserProfile>('/users/@me/username', dto)
    return mapProfile(data)
  },

  async updateStatus(dto: UpdateStatusDto): Promise<UserProfile> {
    const { data } = await httpClient.patch<RawUserProfile>('/users/@me/status', dto)
    return mapProfile(data)
  },

  async getPrivacy(): Promise<UserPrivacy> {
    const { data } = await httpClient.get<RawPrivacy>('/users/@me/privacy')
    return mapPrivacy(data)
  },

  async updatePrivacy(dto: UpdatePrivacyDto): Promise<UserPrivacy> {
    const { data } = await httpClient.patch<RawPrivacy>('/users/@me/privacy', dto)
    return mapPrivacy(data)
  },

  async getRelationships(): Promise<UserRelationship[]> {
    const { data } = await httpClient.get<RawRelationship[]>('/users/@me/relationships')
    return data.map(mapRelationship)
  },

  async sendFriendRequest(targetUserId: string): Promise<UserRelationship> {
    const { data } = await httpClient.post<RawRelationship>('/users/@me/relationships', {
      target_user_id: targetUserId,
    })
    return mapRelationship(data)
  },

  async acceptFriendRequest(relationshipId: string): Promise<UserRelationship> {
    const { data } = await httpClient.patch<RawRelationship>(
      `/users/@me/relationships/${relationshipId}`,
      { action: 'accept' },
    )
    return mapRelationship(data)
  },

  async blockUser(targetUserId: string): Promise<UserRelationship> {
    const { data } = await httpClient.post<RawRelationship>('/users/@me/relationships', {
      target_user_id: targetUserId,
      relationship_type: 'blocked',
    })
    return mapRelationship(data)
  },

  async removeRelationship(relationshipId: string): Promise<void> {
    await httpClient.delete(`/users/@me/relationships/${relationshipId}`)
  },
}
