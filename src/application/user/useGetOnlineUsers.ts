import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'

export function useGetOnlineUsers() {
  return useQuery({
    queryKey: ['users', 'online'],
    queryFn: () => userRepository.getOnlineUsers(),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  })
}
