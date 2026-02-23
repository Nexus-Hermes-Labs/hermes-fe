import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { RELATIONSHIPS_QUERY_KEY } from './useGetRelationships'

export function useUnblockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (targetUserId: string) => userRepository.unblockUser(targetUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RELATIONSHIPS_QUERY_KEY })
    },
  })
}
