// Mirrors: channel-service/src/domain/channel/entity.rs

import type { ChannelType } from './valueObjects'

export interface Channel {
  channelId: string
  guildId: string
  parentId: string | null
  name: string
  channelType: ChannelType
  topic: string | null
  position: number
  isNsfw: boolean
  slowModeSeconds: number
  createdAt: string
  updatedAt: string
}
