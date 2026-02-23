import { useQuery } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { useAuthStore } from '@/state/authStore'
import { tokenStorage } from '@/infrastructure/storage/tokenStorage'

export const ME_QUERY_KEY = ['users', 'me'] as const

export function useGetMe() {
  const { setUser } = useAuthStore()

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      const user = await userRepository.getMe()
      setUser(user)
      return user
    },
    enabled: tokenStorage.hasTokens(),
    staleTime: 1000 * 60 * 10,
  })
}
