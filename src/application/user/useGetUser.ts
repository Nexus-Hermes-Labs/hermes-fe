import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'

export function useGetUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => userRepository.getById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}
