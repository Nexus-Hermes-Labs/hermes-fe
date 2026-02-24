import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'

export function useGetRelationship(targetUserId: string) {
  return useQuery({
    queryKey: ['users', '@me', 'relationships', targetUserId],
    queryFn: () => userRepository.getRelationship(targetUserId),
    enabled: !!targetUserId,
    staleTime: 1000 * 60 * 2,
  })
}
