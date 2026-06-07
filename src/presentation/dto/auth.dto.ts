// Mirrors: auth-service/src/presentation/http/dto/login.rs + register.rs
// Compose domain schemas into form-level schemas

import { z } from 'zod'
import {
  EmailSchema,
  LoginPasswordSchema,
  NewPasswordSchema,
  PasswordSchema,
} from '@/domain/auth/valueObjects'
import { UsernameSchema, DisplayNameSchema } from '@/domain/user/valueObjects'

export const LoginFormSchema = z.object({
  email: EmailSchema,
  password: LoginPasswordSchema,
  device_name: z.string().max(256).optional(),
})

export type LoginFormData = z.infer<typeof LoginFormSchema>

export const RegisterFormSchema = z
  .object({
    email: EmailSchema,
    username: UsernameSchema,
    display_name: DisplayNameSchema,
    password: PasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof RegisterFormSchema>

export const ForgotPasswordFormSchema = z.object({
  email: EmailSchema,
})

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>

export const ResetPasswordFormSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    new_password: NewPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>

export const ChangePasswordFormSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: NewPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof ChangePasswordFormSchema>
