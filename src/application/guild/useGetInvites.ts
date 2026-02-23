import { useQuery } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'

export function useGetInvites(guildId: string) {
  return useQuery({
    queryKey: ['guilds', guildId, 'invites'],
    queryFn: () => guildRepository.getInvites(guildId),
    enabled: !!guildId,
  })
}
