// Mirrors: infrastructure/persistence/postgres/channel/repository.rs
// Backend returns `id` (not `channel_id`), `description` (not `topic`)
// List response is wrapped: { channels: [...], total }

import { httpClient } from '../http/client'
import type { Channel } from '@/domain/channel/entities'

// ── Raw shapes ────────────────────────────────────────────────────────────────
interface RawChannel {
  id: string
  guild_id: string
  parent_id: string | null
  name: string
  channel_type: string
  description: string | null
  position: number
  created_at: string
  updated_at: string
}

interface RawChannelListResponse {
  channels: RawChannel[]
  total: number
}

// ── DTOs ──────────────────────────────────────────────────────────────────────
export interface CreateChannelDto {
  name: string
  channel_type?: string
  description?: string
  parent_id?: string
  position?: number
}

export interface UpdateChannelDto {
  name?: string
  description?: string
  parent_id?: string
  position?: number
}

// ── Mapper ────────────────────────────────────────────────────────────────────
function mapChannel(raw: RawChannel): Channel {
  return {
    channelId: raw.id,
    guildId: raw.guild_id,
    parentId: raw.parent_id,
    name: raw.name,
    channelType: raw.channel_type as Channel['channelType'],
    description: raw.description,
    position: raw.position,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

// ── Repository ────────────────────────────────────────────────────────────────
export const channelRepository = {
  async listByGuild(guildId: string): Promise<Channel[]> {
    const { data } = await httpClient.get<RawChannelListResponse>(`/guilds/${guildId}/channels`)
    return data.channels.map(mapChannel)
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
