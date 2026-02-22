import { useQuery } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'

export function useGetGuild(guildId: string | null) {
  return useQuery({
    queryKey: ['guilds', guildId],
    queryFn: () => guildRepository.getById(guildId!),
    enabled: !!guildId,
  })
}
