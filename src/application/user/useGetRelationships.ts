import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { tokenStorage } from '@/infrastructure/storage/tokenStorage'

export const RELATIONSHIPS_QUERY_KEY = ['users', 'me', 'relationships'] as const

export function useGetRelationships() {
  return useQuery({
    queryKey: RELATIONSHIPS_QUERY_KEY,
    queryFn: () => userRepository.getRelationships(),
    enabled: tokenStorage.hasTokens(),
  })
}
