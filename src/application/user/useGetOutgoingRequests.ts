import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { tokenStorage } from '@/infrastructure/storage/tokenStorage'

export const OUTGOING_REQUESTS_QUERY_KEY = ['relationships', 'outgoing'] as const

export function useGetOutgoingRequests() {
  return useQuery({
    queryKey: OUTGOING_REQUESTS_QUERY_KEY,
    queryFn: () => userRepository.getOutgoingRequests(),
    enabled: tokenStorage.hasTokens(),
  })
}
