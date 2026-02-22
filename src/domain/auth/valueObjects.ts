// Mirrors: auth-service/src/domain/auth_credential/valueobject.rs
// Email: contains @, max 255 chars, regex validated, auto-lowercased
// Password: min 8 chars (register), min 1 char (login)

import { z } from 'zod'

export const EmailSchema = z
  .string()
  .max(255, 'Email must be at most 255 characters')
  .email('Invalid email address')
  .transform((v) => v.toLowerCase())

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')

export const LoginPasswordSchema = z
  .string()
  .min(1, 'Password is required')

export const AccountStatusSchema = z.enum(['active', 'suspended', 'deleted'])
export type AccountStatus = z.infer<typeof AccountStatusSchema>
