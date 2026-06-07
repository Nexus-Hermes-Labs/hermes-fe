import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authRepository } from '@/infrastructure/repositories/authRepository'
import type { ResetPasswordFormData } from '@/presentation/dto/auth.dto'

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      authRepository.resetPassword({
        token: data.token,
        new_password: data.new_password,
      }),
    onSuccess: () => {
      void router.navigate({ to: '/login' })
    },
  })
}
