// Mirrors: user-service/src/domain/user_profile/error.rs

export type UserDomainError =
  | { kind: 'InvalidUsernameLength' }
  | { kind: 'InvalidUsernameFormat' }
  | { kind: 'UsernameTaken'; username: string }
  | { kind: 'InvalidStatus'; status: string }
  | { kind: 'ProfileNotFound'; userId: string }
  | { kind: 'RelationshipNotFound' }
  | { kind: 'AlreadyFriends' }
  | { kind: 'CannotAddSelf' }
  | { kind: 'UserBlocked' }
  | { kind: 'Unknown'; message: string }
