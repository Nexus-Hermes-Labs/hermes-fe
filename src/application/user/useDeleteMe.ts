import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { useAuthStore } from '@/state/authStore'

export function useDeleteMe() {
  const router = useRouter()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: () => userRepository.deleteMe(),
    onSuccess: () => {
      clearAuth()
      void router.navigate({ to: '/login' })
    },
  })
}
