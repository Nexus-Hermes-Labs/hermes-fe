// Mirrors: auth-service/src/presentation/http/dto/login.rs + register.rs
// Compose domain schemas into form-level schemas

import { z } from 'zod'
import { EmailSchema, PasswordSchema, LoginPasswordSchema } from '@/domain/auth/valueObjects'
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
