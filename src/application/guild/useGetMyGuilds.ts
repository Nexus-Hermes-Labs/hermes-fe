import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import { useGuildStore } from '@/state/guildStore'
import { tokenStorage } from '@/infrastructure/storage/tokenStorage'

export const MY_GUILDS_QUERY_KEY = ['guilds', 'mine'] as const

export function useGetMyGuilds() {
  const { setGuilds } = useGuildStore()

  const query = useQuery({
    queryKey: MY_GUILDS_QUERY_KEY,
    queryFn: () => guildRepository.getMyGuilds(),
    enabled: tokenStorage.hasTokens(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (query.data) {
      setGuilds(query.data)
    }
  }, [query.data, setGuilds])

  return query
}
