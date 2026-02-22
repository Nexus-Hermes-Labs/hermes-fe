import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { ME_QUERY_KEY } from '@/application/auth/useGetMe'

export function useUpdateUsername() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (username: string) => userRepository.updateUsername({ username }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
    },
  })
}
