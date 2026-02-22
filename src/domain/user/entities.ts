// Mirrors: user-service/src/domain/user_profile/entity.rs
//          user-service/src/domain/user_privacy/entity.rs
//          user-service/src/domain/user_relationship/entity.rs

import type { UserStatus, RelationshipType } from './valueObjects'

export interface UserProfile {
  userId: string
  email: string
  username: string
  displayName: string
  avatar: string | null
  bio: string | null
  customStatus: string | null
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface UserPrivacy {
  userId: string
  allowFriendRequests: boolean
  showOnlineStatus: boolean
  allowDirectMessages: boolean
}

export interface UserRelationship {
  relationshipId: string
  userId: string
  targetUserId: string
  targetUser: {
    userId: string
    username: string
    displayName: string
    avatar: string | null
    status: UserStatus
  }
  relationshipType: RelationshipType
  createdAt: string
}
