import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { RELATIONSHIPS_QUERY_KEY } from './useGetRelationships'
import { OUTGOING_REQUESTS_QUERY_KEY } from './useGetOutgoingRequests'

export function useSendFriendRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (username: string) => {
      const user = await userRepository.getByUsername(username)
      return userRepository.sendFriendRequest(user.userId)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RELATIONSHIPS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: OUTGOING_REQUESTS_QUERY_KEY })
    },
  })
}
