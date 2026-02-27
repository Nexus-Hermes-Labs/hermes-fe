// Routes typed server events (identified by `op` field) to registered handlers.
// Mirrors the ServerMsg enum from realtime-service/src/presentation/ws/messages.rs

import { wsClient } from './wsClient'

/** All server-originated `op` codes */
export type WsOp =
  | 'HELLO'
  | 'HEARTBEAT_ACK'
  | 'SUBSCRIBED'
  | 'UNSUBSCRIBED'
  | 'MESSAGE_CREATE'
  | 'MESSAGE_UPDATE'
  | 'MESSAGE_DELETE'
  | 'REACTION_ADD'
  | 'REACTION_REMOVE'
  | 'ERROR'

export interface WsServerMsg<T = unknown> {
  op: WsOp
  data?: T
  context_id?: string
  heartbeat_interval?: number
  message?: string
}

type MsgHandler<T = unknown> = (msg: WsServerMsg<T>) => void

export const wsEventBus = {
  /** Subscribe to a specific server `op` code */
  on<T>(op: WsOp, handler: MsgHandler<T>): () => void {
    return wsClient.on(op, (raw) => {
      try {
        const parsed = JSON.parse(raw.data as string) as WsServerMsg<T>
        handler(parsed)
      } catch {
        // ignore malformed frames
      }
    })
  },
}
