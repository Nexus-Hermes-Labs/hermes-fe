// Event routing stub for when realtime-service is ready
// Provides type-safe event subscriptions

import { wsClient } from './wsClient'

export type WsEventType =
  | 'message_create'
  | 'message_update'
  | 'message_delete'
  | 'presence_update'
  | 'member_join'
  | 'member_leave'
  | 'channel_create'
  | 'channel_update'
  | 'channel_delete'
  | 'guild_update'
  | 'typing_start'
  | 'heartbeat_ack'

export interface WsEvent<T = unknown> {
  type: WsEventType
  data: T
  guildId?: string
  channelId?: string
}

type EventHandler<T = unknown> = (event: WsEvent<T>) => void

export const wsEventBus = {
  subscribe<T>(eventType: WsEventType, handler: EventHandler<T>): () => void {
    return wsClient.on(eventType, (raw) => {
      try {
        const parsed = JSON.parse(raw.data as string) as WsEvent<T>
        handler(parsed)
      } catch {
        // ignore malformed events
      }
    })
  },
}
