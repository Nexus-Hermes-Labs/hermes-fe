import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { tokenStorage } from '@/infrastructure/storage/tokenStorage'

export const INCOMING_REQUESTS_QUERY_KEY = ['relationships', 'incoming'] as const

export function useGetIncomingRequests() {
  return useQuery({
    queryKey: INCOMING_REQUESTS_QUERY_KEY,
    queryFn: () => userRepository.getIncomingRequests(),
    enabled: tokenStorage.hasTokens(),
  })
}
