// Mirrors: messaging-service presentation layer
// Routes:
//   GET  /conversations/@me
//   POST /conversations/dm
//   POST /conversations/group
//   GET  /conversations/{conversation_id}
//   POST /conversations/{conversation_id}/members
//   DELETE /conversations/{conversation_id}/members/{user_id}

import { httpClient } from '../http/client'
import type { Conversation, ConversationList, ConversationMember } from '@/domain/conversation/entities'

// ── Raw shapes ────────────────────────────────────────────────────────────────

interface RawConversationMember {
  user_id: string
  joined_at: string
}

interface RawConversation {
  id: string
  conversation_type: string
  name: string | null
  created_at: string
  updated_at: string
  members: RawConversationMember[]
}

interface RawConversationListResponse {
  conversations: RawConversation[]
  total: number
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface OpenDmDto {
  target_user_id: string
}

export interface CreateGroupDmDto {
  name: string
  member_ids: string[]
}

export interface AddMemberDto {
  user_id: string
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapMember(raw: RawConversationMember): ConversationMember {
  return {
    userId: raw.user_id,
    joinedAt: raw.joined_at,
  }
}

function mapConversation(raw: RawConversation): Conversation {
  return {
    id: raw.id,
    conversationType: raw.conversation_type as Conversation['conversationType'],
    name: raw.name,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    members: raw.members.map(mapMember),
  }
}

// ── Repository ────────────────────────────────────────────────────────────────

export const conversationRepository = {
  async getMyConversations(): Promise<ConversationList> {
    const { data } = await httpClient.get<RawConversationListResponse>('/conversations/@me')
    return {
      conversations: data.conversations.map(mapConversation),
      total: data.total,
    }
  },

  async getById(conversationId: string): Promise<Conversation> {
    const { data } = await httpClient.get<RawConversation>(`/conversations/${conversationId}`)
    return mapConversation(data)
  },

  async openDm(dto: OpenDmDto): Promise<Conversation> {
    const { data } = await httpClient.post<RawConversation>('/conversations/dm', dto)
    return mapConversation(data)
  },

  async createGroupDm(dto: CreateGroupDmDto): Promise<Conversation> {
    const { data } = await httpClient.post<RawConversation>('/conversations/group', dto)
    return mapConversation(data)
  },

  async addMember(conversationId: string, dto: AddMemberDto): Promise<void> {
    await httpClient.post(`/conversations/${conversationId}/members`, dto)
  },

  async removeMember(conversationId: string, userId: string): Promise<void> {
    await httpClient.delete(`/conversations/${conversationId}/members/${userId}`)
  },
}
