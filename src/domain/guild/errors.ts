// Mirrors: guild-service/src/domain/guild/error.rs

export type GuildDomainError =
  | { kind: 'InvalidNameLength' }
  | { kind: 'InvalidNameFormat' }
  | { kind: 'InvalidDescription' }
  | { kind: 'GuildNotFound'; guildId: string }
  | { kind: 'NotMember'; guildId: string; userId: string }
  | { kind: 'AlreadyMember'; guildId: string; userId: string }
  | { kind: 'InsufficientPermissions'; required: number }
  | { kind: 'RoleNotFound'; roleId: string }
  | { kind: 'InviteNotFound'; code: string }
  | { kind: 'InviteExpired'; code: string }
  | { kind: 'InviteRevoked'; code: string }
  | { kind: 'InviteMaxUsesReached'; code: string }
  | { kind: 'InvalidColor' }
  | { kind: 'Unknown'; message: string }
