// Mirrors: channel-service/src/domain/channel/error.rs

export type ChannelDomainError =
  | { kind: 'InvalidNameLength' }
  | { kind: 'InvalidNameFormat' }
  | { kind: 'InvalidChannelType'; channelType: string }
  | { kind: 'ChannelNotFound'; channelId: string }
  | { kind: 'CategoryNotFound'; parentId: string }
  | { kind: 'CannotNestCategories' }
  | { kind: 'Unknown'; message: string }
