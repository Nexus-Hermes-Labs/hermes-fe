import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { RELATIONSHIPS_QUERY_KEY } from './useGetRelationships'
import { BLOCKED_USERS_QUERY_KEY } from './useGetBlockedUsers'

export function useBlockUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (targetUserId: string) => userRepository.blockUser(targetUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RELATIONSHIPS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: BLOCKED_USERS_QUERY_KEY })
    },
  })
}
