import { useMutation } from '@tanstack/react-query'
import { authRepository } from '@/infrastructure/repositories/authRepository'

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authRepository.verifyEmail(token),
  })
}
