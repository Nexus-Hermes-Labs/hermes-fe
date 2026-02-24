import { useQuery } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'

export function useGetRole(guildId: string, roleId: string) {
  return useQuery({
    queryKey: ['guilds', guildId, 'roles', roleId],
    queryFn: () => guildRepository.getRole(guildId, roleId),
    enabled: !!guildId && !!roleId,
    staleTime: 1000 * 60 * 5,
  })
}
