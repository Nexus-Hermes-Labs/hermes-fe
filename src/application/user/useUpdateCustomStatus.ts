import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { ME_QUERY_KEY } from '@/application/auth/useGetMe'
import type { UpdateCustomStatusData } from '@/presentation/dto/user.dto'

export function useUpdateCustomStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCustomStatusData) => userRepository.updateCustomStatus(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
    },
  })
}

export function useClearCustomStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => userRepository.clearCustomStatus(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
    },
  })
}
