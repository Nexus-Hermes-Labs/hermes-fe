import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { RELATIONSHIPS_QUERY_KEY } from './useGetRelationships'

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (targetUserId: string) => userRepository.acceptFriendRequest(targetUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RELATIONSHIPS_QUERY_KEY })
    },
  })
}
