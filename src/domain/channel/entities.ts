// Mirrors: channel-service/src/domain/channel/entity.rs

import type { ChannelType } from './valueObjects'

// Backend returns `id` (not `channel_id`), `description` (not `topic`)
// No is_nsfw or slow_mode_seconds in the response
export interface Channel {
  channelId: string
  guildId: string
  parentId: string | null
  name: string
  channelType: ChannelType
  description: string | null
  position: number
  createdAt: string
  updatedAt: string
}
