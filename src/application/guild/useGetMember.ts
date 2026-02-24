import { useQuery } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'

export function useGetMember(guildId: string, userId: string) {
  return useQuery({
    queryKey: ['guilds', guildId, 'members', userId],
    queryFn: () => guildRepository.getMember(guildId, userId),
    enabled: !!guildId && !!userId,
    staleTime: 1000 * 60 * 5,
  })
}
