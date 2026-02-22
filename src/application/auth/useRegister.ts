import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authRepository } from '@/infrastructure/repositories/authRepository'
import { useAuthStore } from '@/state/authStore'
import type { RegisterFormData } from '@/presentation/dto/auth.dto'

export function useRegister() {
  const router = useRouter()
  const { setTokensAndUser } = useAuthStore()

  return useMutation({
    mutationFn: (data: RegisterFormData) =>
      authRepository.register({
        email: data.email,
        username: data.username,
        display_name: data.display_name,
        password: data.password,
      }),
    onSuccess: ({ tokens, user }) => {
      setTokensAndUser(tokens.accessToken, tokens.refreshToken, tokens.expiresIn, user)
      void router.navigate({ to: '/channels/@me' })
    },
  })
}
