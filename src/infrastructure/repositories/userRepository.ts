// Mirrors: infrastructure/persistence/postgres/user_profile/repository.rs
// Routes: GET /users/@me, PATCH /users/@me, PUT /users/@me/username, etc.

import { httpClient } from '../http/client'
import type { UserProfile, UserPrivacy, UserRelationship, DmPrivacy, FriendRequestPrivacy } from '@/domain/user/entities'

// ── Raw shapes ────────────────────────────────────────────────────────────────
interface RawCustomStatus {
  text: string | null
  emoji: string | null
  expires_at: string | null
}

interface RawUserProfile {
  user_id: string
  username: string
  display_name: string
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  custom_status: RawCustomStatus | null
  status: string
  created_at: string
}

interface RawPrivacy {
  allow_dms_from: string
  allow_friend_requests_from: string
  show_online_status: boolean
  show_current_activity: boolean
  show_profile_to_non_friends: boolean
  allow_nsfw_content: boolean
  content_filter_level: number
}

interface RawRelationship {
  relationship_id: string
  user_id: string
  target_user_id: string
  target_user: {
    user_id: string
    username: string
    display_name: string
    avatar_url: string | null
    status: string
  }
  relationship_type: string
  created_at: string
}

// ── DTOs ──────────────────────────────────────────────────────────────────────
export interface UpdateProfileDto {
  display_name?: string
  bio?: string
  avatar_url?: string
  banner_url?: string
}

export interface UpdateStatusDto {
  status: string
}

export interface UpdateCustomStatusDto {
  text?: string | null
  emoji?: string | null
  expires_at?: string | null
}

export interface UpdateUsernameDto {
  username: string  // internal name; sent to backend as new_username
}

export interface UpdatePrivacyDto {
  allow_dms_from?: string
  allow_friend_requests_from?: string
  show_online_status?: boolean
  show_current_activity?: boolean
  show_profile_to_non_friends?: boolean
  allow_nsfw_content?: boolean
  content_filter_level?: number
}

// ── Mappers ───────────────────────────────────────────────────────────────────
function mapProfile(raw: RawUserProfile): UserProfile {
  return {
    userId: raw.user_id,
    username: raw.username,
    displayName: raw.display_name,
    avatarUrl: raw.avatar_url,
    bannerUrl: raw.banner_url,
    bio: raw.bio,
    customStatus: raw.custom_status
      ? {
          text: raw.custom_status.text,
          emoji: raw.custom_status.emoji,
          expiresAt: raw.custom_status.expires_at,
        }
      : null,
    status: raw.status as UserProfile['status'],
    createdAt: raw.created_at,
  }
}

function mapPrivacy(raw: RawPrivacy): UserPrivacy {
  return {
    allowDmsFrom: raw.allow_dms_from as DmPrivacy,
    allowFriendRequestsFrom: raw.allow_friend_requests_from as FriendRequestPrivacy,
    showOnlineStatus: raw.show_online_status,
    showCurrentActivity: raw.show_current_activity,
    showProfileToNonFriends: raw.show_profile_to_non_friends,
    allowNsfwContent: raw.allow_nsfw_content,
    contentFilterLevel: raw.content_filter_level as UserPrivacy['contentFilterLevel'],
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
      avatarUrl: raw.target_user.avatar_url,
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

  // Backend: PUT /users/@me/username  body: { new_username }
  async updateUsername(dto: UpdateUsernameDto): Promise<UserProfile> {
    const { data } = await httpClient.put<RawUserProfile>('/users/@me/username', {
      new_username: dto.username,
    })
    return mapProfile(data)
  },

  // Backend: PUT /users/@me/status  body: { status }
  async updateStatus(dto: UpdateStatusDto): Promise<UserProfile> {
    const { data } = await httpClient.put<RawUserProfile>('/users/@me/status', dto)
    return mapProfile(data)
  },

  // Backend: PUT /users/@me/custom-status  body: { text?, emoji?, expires_at? }
  async updateCustomStatus(dto: UpdateCustomStatusDto): Promise<void> {
    await httpClient.put('/users/@me/custom-status', dto)
  },

  // Backend: DELETE /users/@me/custom-status
  async clearCustomStatus(): Promise<void> {
    await httpClient.delete('/users/@me/custom-status')
  },

  async getPrivacy(): Promise<UserPrivacy> {
    const { data } = await httpClient.get<RawPrivacy>('/users/@me/privacy')
    return mapPrivacy(data)
  },

  // Backend: PUT /users/@me/privacy/dm  body: { allow_dms_from }
  async updateDmPrivacy(allowDmsFrom: string): Promise<void> {
    await httpClient.put('/users/@me/privacy/dm', { allow_dms_from: allowDmsFrom })
  },

  // Backend: PUT /users/@me/privacy/friend-requests  body: { allow_friend_requests_from }
  async updateFriendRequestPrivacy(allowFriendRequestsFrom: string): Promise<void> {
    await httpClient.put('/users/@me/privacy/friend-requests', {
      allow_friend_requests_from: allowFriendRequestsFrom,
    })
  },

  // Backend: PATCH /users/@me/privacy/visibility  body: { show_online_status?, show_current_activity?, show_profile_to_non_friends? }
  async updateVisibilityPrivacy(dto: {
    show_online_status?: boolean
    show_current_activity?: boolean
    show_profile_to_non_friends?: boolean
  }): Promise<void> {
    await httpClient.patch('/users/@me/privacy/visibility', dto)
  },

  // Backend: PATCH /users/@me/privacy/content  body: { allow_nsfw_content?, content_filter_level? }
  async updateContentPrivacy(dto: {
    allow_nsfw_content?: boolean
    content_filter_level?: number
  }): Promise<void> {
    await httpClient.patch('/users/@me/privacy/content', dto)
  },

  async getRelationships(): Promise<UserRelationship[]> {
    const { data } = await httpClient.get<RawRelationship[]>('/users/@me/relationships/friends')
    return data.map(mapRelationship)
  },

  async getFriends(): Promise<UserRelationship[]> {
    const { data } = await httpClient.get<RawRelationship[]>('/users/@me/relationships/friends')
    return data.map(mapRelationship)
  },

  async getIncomingRequests(): Promise<UserRelationship[]> {
    const { data } = await httpClient.get<RawRelationship[]>('/users/@me/relationships/incoming')
    return data.map(mapRelationship)
  },

  async getOutgoingRequests(): Promise<UserRelationship[]> {
    const { data } = await httpClient.get<RawRelationship[]>('/users/@me/relationships/outgoing')
    return data.map(mapRelationship)
  },

  async getBlockedUsers(): Promise<UserRelationship[]> {
    const { data } = await httpClient.get<RawRelationship[]>('/users/@me/relationships/blocked')
    return data.map(mapRelationship)
  },

  // Backend: POST /api/v1/users/@me/relationships/request  body: { target_user_id, message? }
  async sendFriendRequest(targetUserId: string, message?: string): Promise<UserRelationship> {
    const { data } = await httpClient.post<RawRelationship>('/users/@me/relationships/request', {
      target_user_id: targetUserId,
      ...(message ? { message } : {}),
    })
    return mapRelationship(data)
  },

  // Backend: PUT /api/v1/users/@me/relationships/request/accept  body: { target_user_id }
  async acceptFriendRequest(targetUserId: string): Promise<UserRelationship> {
    const { data } = await httpClient.put<RawRelationship>(
      '/users/@me/relationships/request/accept',
      { target_user_id: targetUserId },
    )
    return mapRelationship(data)
  },

  // Backend: PUT /api/v1/users/@me/relationships/request/decline  body: { target_user_id }
  async declineFriendRequest(targetUserId: string): Promise<void> {
    await httpClient.put('/users/@me/relationships/request/decline', {
      target_user_id: targetUserId,
    })
  },

  // Backend: POST /api/v1/users/@me/relationships/block  body: { target_user_id }
  async blockUser(targetUserId: string): Promise<UserRelationship> {
    const { data } = await httpClient.post<RawRelationship>('/users/@me/relationships/block', {
      target_user_id: targetUserId,
    })
    return mapRelationship(data)
  },

  // Backend: DELETE /api/v1/users/@me/relationships/friend/:target_user_id
  async removeFriend(targetUserId: string): Promise<void> {
    await httpClient.delete(`/users/@me/relationships/friend/${targetUserId}`)
  },

  // Backend: DELETE /api/v1/users/@me/relationships/block/:target_user_id
  async unblockUser(targetUserId: string): Promise<void> {
    await httpClient.delete(`/users/@me/relationships/block/${targetUserId}`)
  },

  // Backend: GET /users/search?query=...
  async searchUsers(query: string): Promise<UserProfile[]> {
    const { data } = await httpClient.get<RawUserProfile[]>('/users/search', {
      params: { query },
    })
    return data.map(mapProfile)
  },

  // Backend: GET /users/:user_id
  async getById(userId: string): Promise<UserProfile> {
    const { data } = await httpClient.get<RawUserProfile>(`/users/${userId}`)
    return mapProfile(data)
  },

  // Backend: GET /users/username/:username
  async getByUsername(username: string): Promise<UserProfile> {
    const { data } = await httpClient.get<RawUserProfile>(`/users/username/${username}`)
    return mapProfile(data)
  },

  // Backend: GET /users/check-username/:username → { available: bool }
  async checkUsername(username: string): Promise<boolean> {
    const { data } = await httpClient.get<{ available: boolean }>(`/users/check-username/${username}`)
    return data.available
  },

  // Backend: GET /users/online → UserProfile[]
  async getOnlineUsers(): Promise<UserProfile[]> {
    const { data } = await httpClient.get<RawUserProfile[]>('/users/online')
    return data.map(mapProfile)
  },

  // Backend: DELETE /users/@me
  async deleteMe(): Promise<void> {
    await httpClient.delete('/users/@me')
  },

  // Backend: POST /users/@me/privacy/preset  body: { preset }
  // preset values: "Public" | "Private"
  async applyPrivacyPreset(preset: 'Public' | 'Private'): Promise<void> {
    await httpClient.post('/users/@me/privacy/preset', { preset })
  },

  // Backend: GET /users/@me/relationships/:target_user_id
  async getRelationship(targetUserId: string): Promise<UserRelationship | null> {
    const { data } = await httpClient.get<RawRelationship | null>(
      `/users/@me/relationships/${targetUserId}`,
    )
    return data ? mapRelationship(data) : null
  },

  // ── Admin: Profile management (requires Admin JWT role) ─────────────────────

  // Backend: PATCH /users/:user_id
  async adminUpdateUser(userId: string, dto: UpdateProfileDto): Promise<UserProfile> {
    const { data } = await httpClient.patch<RawUserProfile>(`/users/${userId}`, dto)
    return mapProfile(data)
  },

  // Backend: DELETE /users/:user_id
  async adminDeleteUser(userId: string): Promise<void> {
    await httpClient.delete(`/users/${userId}`)
  },

  // Backend: PUT /users/:user_id/username  body: { new_username }
  async adminChangeUsername(userId: string, newUsername: string): Promise<UserProfile> {
    const { data } = await httpClient.put<RawUserProfile>(`/users/${userId}/username`, {
      new_username: newUsername,
    })
    return mapProfile(data)
  },

  // Backend: PUT /users/:user_id/status  body: { status }
  async adminUpdateUserStatus(userId: string, dto: UpdateStatusDto): Promise<UserProfile> {
    const { data } = await httpClient.put<RawUserProfile>(`/users/${userId}/status`, dto)
    return mapProfile(data)
  },

  // Backend: PUT /users/:user_id/custom-status
  async adminUpdateUserCustomStatus(userId: string, dto: UpdateCustomStatusDto): Promise<void> {
    await httpClient.put(`/users/${userId}/custom-status`, dto)
  },

  // Backend: DELETE /users/:user_id/custom-status
  async adminClearUserCustomStatus(userId: string): Promise<void> {
    await httpClient.delete(`/users/${userId}/custom-status`)
  },

  // ── Admin: Privacy management ───────────────────────────────────────────────

  // Backend: GET /users/:user_id/privacy
  async adminGetUserPrivacy(userId: string): Promise<UserPrivacy> {
    const { data } = await httpClient.get<RawPrivacy>(`/users/${userId}/privacy`)
    return mapPrivacy(data)
  },

  // Backend: PUT /users/:user_id/privacy/dm  body: { allow_dms_from }
  async adminUpdateUserDmPrivacy(userId: string, allowDmsFrom: string): Promise<void> {
    await httpClient.put(`/users/${userId}/privacy/dm`, { allow_dms_from: allowDmsFrom })
  },

  // Backend: PUT /users/:user_id/privacy/friend-requests  body: { allow_friend_requests_from }
  async adminUpdateUserFriendRequestPrivacy(
    userId: string,
    allowFriendRequestsFrom: string,
  ): Promise<void> {
    await httpClient.put(`/users/${userId}/privacy/friend-requests`, {
      allow_friend_requests_from: allowFriendRequestsFrom,
    })
  },

  // Backend: PATCH /users/:user_id/privacy/visibility
  async adminUpdateUserVisibilityPrivacy(
    userId: string,
    dto: {
      show_online_status?: boolean
      show_current_activity?: boolean
      show_profile_to_non_friends?: boolean
    },
  ): Promise<void> {
    await httpClient.patch(`/users/${userId}/privacy/visibility`, dto)
  },

  // Backend: PATCH /users/:user_id/privacy/content
  async adminUpdateUserContentPrivacy(
    userId: string,
    dto: { allow_nsfw_content?: boolean; content_filter_level?: number },
  ): Promise<void> {
    await httpClient.patch(`/users/${userId}/privacy/content`, dto)
  },

  // Backend: POST /users/:user_id/privacy/preset  body: { preset }
  async adminApplyUserPrivacyPreset(userId: string, preset: 'Public' | 'Private'): Promise<void> {
    await httpClient.post(`/users/${userId}/privacy/preset`, { preset })
  },

  // ── Admin: Relationship management ─────────────────────────────────────────

  // Backend: GET /users/:user_id/relationships/friends
  async adminGetUserFriends(userId: string): Promise<UserRelationship[]> {
    const { data } = await httpClient.get<RawRelationship[]>(`/users/${userId}/relationships/friends`)
    return data.map(mapRelationship)
  },

  // Backend: GET /users/:user_id/relationships/incoming
  async adminGetUserIncomingRequests(userId: string): Promise<UserRelationship[]> {
    const { data } = await httpClient.get<RawRelationship[]>(
      `/users/${userId}/relationships/incoming`,
    )
    return data.map(mapRelationship)
  },

  // Backend: GET /users/:user_id/relationships/outgoing
  async adminGetUserOutgoingRequests(userId: string): Promise<UserRelationship[]> {
    const { data } = await httpClient.get<RawRelationship[]>(
      `/users/${userId}/relationships/outgoing`,
    )
    return data.map(mapRelationship)
  },

  // Backend: GET /users/:user_id/relationships/blocked
  async adminGetUserBlockedUsers(userId: string): Promise<UserRelationship[]> {
    const { data } = await httpClient.get<RawRelationship[]>(
      `/users/${userId}/relationships/blocked`,
    )
    return data.map(mapRelationship)
  },

  // Backend: GET /users/:user_id/relationships/:target_user_id
  async adminGetUserRelationship(
    userId: string,
    targetUserId: string,
  ): Promise<UserRelationship | null> {
    const { data } = await httpClient.get<RawRelationship | null>(
      `/users/${userId}/relationships/${targetUserId}`,
    )
    return data ? mapRelationship(data) : null
  },

  // Backend: POST /users/:user_id/relationships/request  body: { target_user_id }
  async adminSendFriendRequest(userId: string, targetUserId: string): Promise<UserRelationship> {
    const { data } = await httpClient.post<RawRelationship>(
      `/users/${userId}/relationships/request`,
      { target_user_id: targetUserId },
    )
    return mapRelationship(data)
  },

  // Backend: PUT /users/:user_id/relationships/request/accept  body: { target_user_id }
  async adminAcceptFriendRequest(userId: string, targetUserId: string): Promise<UserRelationship> {
    const { data } = await httpClient.put<RawRelationship>(
      `/users/${userId}/relationships/request/accept`,
      { target_user_id: targetUserId },
    )
    return mapRelationship(data)
  },

  // Backend: PUT /users/:user_id/relationships/request/decline  body: { target_user_id }
  async adminDeclineFriendRequest(userId: string, targetUserId: string): Promise<void> {
    await httpClient.put(`/users/${userId}/relationships/request/decline`, {
      target_user_id: targetUserId,
    })
  },

  // Backend: DELETE /users/:user_id/relationships/friend/:target_user_id
  async adminRemoveFriend(userId: string, targetUserId: string): Promise<void> {
    await httpClient.delete(`/users/${userId}/relationships/friend/${targetUserId}`)
  },

  // Backend: POST /users/:user_id/relationships/block  body: { target_user_id }
  async adminBlockUser(userId: string, targetUserId: string): Promise<UserRelationship> {
    const { data } = await httpClient.post<RawRelationship>(
      `/users/${userId}/relationships/block`,
      { target_user_id: targetUserId },
    )
    return mapRelationship(data)
  },

  // Backend: DELETE /users/:user_id/relationships/block/:target_user_id
  async adminUnblockUser(userId: string, targetUserId: string): Promise<void> {
    await httpClient.delete(`/users/${userId}/relationships/block/${targetUserId}`)
  },
}
