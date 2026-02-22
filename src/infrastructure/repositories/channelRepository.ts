// Mirrors: infrastructure/persistence/postgres/channel/repository.rs

import { httpClient } from '../http/client'
import type { Channel } from '@/domain/channel/entities'

// ── Raw shapes ────────────────────────────────────────────────────────────────
interface RawChannel {
  channel_id: string
  guild_id: string
  parent_id: string | null
  name: string
  channel_type: string
  topic: string | null
  position: number
  is_nsfw: boolean
  slow_mode_seconds: number
  created_at: string
  updated_at: string
}

// ── DTOs ──────────────────────────────────────────────────────────────────────
export interface CreateChannelDto {
  name: string
  channel_type?: string
  topic?: string
  parent_id?: string
  position?: number
}

export interface UpdateChannelDto {
  name?: string
  topic?: string
  parent_id?: string
  position?: number
  is_nsfw?: boolean
  slow_mode_seconds?: number
}

// ── Mapper ────────────────────────────────────────────────────────────────────
function mapChannel(raw: RawChannel): Channel {
  return {
    channelId: raw.channel_id,
    guildId: raw.guild_id,
    parentId: raw.parent_id,
    name: raw.name,
    channelType: raw.channel_type as Channel['channelType'],
    topic: raw.topic,
    position: raw.position,
    isNsfw: raw.is_nsfw,
    slowModeSeconds: raw.slow_mode_seconds,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

// ── Repository ────────────────────────────────────────────────────────────────
export const channelRepository = {
  async listByGuild(guildId: string): Promise<Channel[]> {
    const { data } = await httpClient.get<RawChannel[]>(`/guilds/${guildId}/channels`)
    return data.map(mapChannel)
  },

  async getById(channelId: string): Promise<Channel> {
    const { data } = await httpClient.get<RawChannel>(`/channels/${channelId}`)
    return mapChannel(data)
  },

  async create(guildId: string, dto: CreateChannelDto): Promise<Channel> {
    const { data } = await httpClient.post<RawChannel>(`/guilds/${guildId}/channels`, dto)
    return mapChannel(data)
  },

  async update(channelId: string, dto: UpdateChannelDto): Promise<Channel> {
    const { data } = await httpClient.patch<RawChannel>(`/channels/${channelId}`, dto)
    return mapChannel(data)
  },

  async delete(channelId: string): Promise<void> {
    await httpClient.delete(`/channels/${channelId}`)
  },
}
