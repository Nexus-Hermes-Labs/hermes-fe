import { useMutation } from '@tanstack/react-query'
import { authRepository } from '@/infrastructure/repositories/authRepository'
import type { ChangePasswordFormData } from '@/presentation/dto/auth.dto'

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      authRepository.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      }),
  })
}
