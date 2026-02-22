import { useQuery } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import type { SearchGuildsData } from '@/presentation/dto/guild.dto'

export function useSearchGuilds(params: SearchGuildsData | null) {
  return useQuery({
    queryKey: ['guilds', 'search', params],
    queryFn: () => guildRepository.search(params!),
    enabled: !!params && params.query.length > 0,
  })
}
