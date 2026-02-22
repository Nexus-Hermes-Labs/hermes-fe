import { useQuery } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'

export function useGetMembers(guildId: string | null) {
  return useQuery({
    queryKey: ['guilds', guildId, 'members'],
    queryFn: () => guildRepository.getMembers(guildId!),
    enabled: !!guildId,
  })
}
