import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { tokenStorage } from '@/infrastructure/storage/tokenStorage'

export const PRIVACY_QUERY_KEY = ['users', 'me', 'privacy'] as const

export function useGetPrivacy() {
  return useQuery({
    queryKey: PRIVACY_QUERY_KEY,
    queryFn: () => userRepository.getPrivacy(),
    enabled: tokenStorage.hasTokens(),
  })
}
