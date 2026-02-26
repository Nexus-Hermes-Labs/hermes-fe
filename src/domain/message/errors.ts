// Mirrors: messaging-service/src/domain/message/error.rs

export type MessageErrorCode =
  | 'MESSAGE_NOT_FOUND'
  | 'MESSAGE_NOT_OWNED'
  | 'MESSAGE_DELETED'
  | 'INVALID_CONTENT'
  | 'INVALID_TARGET'
  | 'REACTION_ALREADY_EXISTS'
  | 'REACTION_NOT_FOUND'
  | 'INVALID_EMOJI'

export interface MessageError {
  code: MessageErrorCode
  message: string
}
