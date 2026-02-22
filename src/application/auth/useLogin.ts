import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authRepository } from '@/infrastructure/repositories/authRepository'
import type { LoginFormData } from '@/presentation/dto/auth.dto'

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      authRepository.login({
        email: data.email,
        password: data.password,
        device_name: data.device_name,
      }),
    onSuccess: () => {
      void router.navigate({ to: '/channels/@me' })
    },
  })
}
