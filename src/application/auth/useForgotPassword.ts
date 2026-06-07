import { useMutation } from '@tanstack/react-query'
import { authRepository } from '@/infrastructure/repositories/authRepository'
import type { ForgotPasswordFormData } from '@/presentation/dto/auth.dto'

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) => authRepository.forgotPassword(data),
  })
}
