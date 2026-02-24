import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'

export function useGetUserByUsername(username: string) {
  return useQuery({
    queryKey: ['users', 'username', username],
    queryFn: () => userRepository.getByUsername(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  })
}
