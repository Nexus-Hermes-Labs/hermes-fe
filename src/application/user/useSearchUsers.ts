import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => userRepository.searchUsers(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 30,
  })
}
