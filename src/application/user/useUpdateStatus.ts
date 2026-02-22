import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { ME_QUERY_KEY } from '@/application/auth/useGetMe'
import type { UpdateStatusData } from '@/presentation/dto/user.dto'

export function useUpdateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateStatusData) => userRepository.updateStatus(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
    },
  })
}
