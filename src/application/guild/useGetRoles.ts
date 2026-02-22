import { useQuery } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'

export function useGetRoles(guildId: string | null) {
  return useQuery({
    queryKey: ['guilds', guildId, 'roles'],
    queryFn: () => guildRepository.getRoles(guildId!),
    enabled: !!guildId,
  })
}
