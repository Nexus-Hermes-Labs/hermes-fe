import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { tokenStorage } from '@/infrastructure/storage/tokenStorage'

export const BLOCKED_USERS_QUERY_KEY = ['relationships', 'blocked'] as const

export function useGetBlockedUsers() {
  return useQuery({
    queryKey: BLOCKED_USERS_QUERY_KEY,
    queryFn: () => userRepository.getBlockedUsers(),
    enabled: tokenStorage.hasTokens(),
  })
}
