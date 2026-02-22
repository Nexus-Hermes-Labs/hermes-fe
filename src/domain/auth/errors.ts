// Mirrors: auth-service/src/domain/auth_credential/error.rs

export type AuthDomainError =
  | { kind: 'InvalidEmail' }
  | { kind: 'InvalidPassword'; reason: string }
  | { kind: 'InvalidAccountStatus'; status: string }
  | { kind: 'AccountSuspended' }
  | { kind: 'AccountDeleted' }
  | { kind: 'CredentialsNotFound' }
  | { kind: 'TokenExpired' }
  | { kind: 'TokenInvalid' }
  | { kind: 'Unauthorized' }
  | { kind: 'Unknown'; message: string }
