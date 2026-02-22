import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authRepository } from '@/infrastructure/repositories/authRepository'
import { useAuthStore } from '@/state/authStore'

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: () => authRepository.logout(),
    onSettled: () => {
      clearAuth()
      queryClient.clear()
      void router.navigate({ to: '/login' })
    },
  })
}
