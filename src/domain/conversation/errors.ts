// Mirrors: messaging-service/src/domain/conversation/error.rs

export type ConversationErrorCode =
  | 'CONVERSATION_NOT_FOUND'
  | 'NOT_A_MEMBER'
  | 'ALREADY_A_MEMBER'
  | 'GROUP_FULL'
  | 'CANNOT_REMOVE_SELF'
  | 'INVALID_TYPE'

export interface ConversationError {
  code: ConversationErrorCode
  message: string
}
