import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'

export function useCheckUsername(username: string) {
  return useQuery({
    queryKey: ['users', 'check-username', username],
    queryFn: () => userRepository.checkUsername(username),
    enabled: username.length >= 3,
    staleTime: 1000 * 30,
  })
}
