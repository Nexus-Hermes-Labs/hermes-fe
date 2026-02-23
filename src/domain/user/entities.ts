// Mirrors: user-service/src/domain/user_profile/entity.rs
//          user-service/src/domain/user_privacy/entity.rs
//          user-service/src/domain/user_relationship/entity.rs

import type { UserStatus, RelationshipType } from './valueObjects'

// Matches ProfileResponse from user-service
export interface CustomStatus {
  text: string | null
  emoji: string | null
  expiresAt: string | null
}

export interface UserProfile {
  userId: string
  username: string
  displayName: string
  avatarUrl: string | null
  bannerUrl: string | null
  bio: string | null
  customStatus: CustomStatus | null
  status: UserStatus
  createdAt: string
}

// Matches PrivacySettingsResponse from user-service
export type DmPrivacy = 'Everyone' | 'Friends' | 'ServerMembers' | 'None'
export type FriendRequestPrivacy = 'Everyone' | 'FriendsOfFriends' | 'None'

export interface UserPrivacy {
  allowDmsFrom: DmPrivacy
  allowFriendRequestsFrom: FriendRequestPrivacy
  showOnlineStatus: boolean
  showCurrentActivity: boolean
  showProfileToNonFriends: boolean
  allowNsfwContent: boolean
  contentFilterLevel: 0 | 1 | 2
}

export interface UserRelationship {
  relationshipId: string
  userId: string
  targetUserId: string
  targetUser: {
    userId: string
    username: string
    displayName: string
    avatarUrl: string | null
    status: UserStatus
  }
  relationshipType: RelationshipType
  createdAt: string
}
