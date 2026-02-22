import { useQuery } from '@tanstack/react-query'
import { channelRepository } from '@/infrastructure/repositories/channelRepository'

export function useListChannels(guildId: string | null) {
  return useQuery({
    queryKey: ['guilds', guildId, 'channels'],
    queryFn: () => channelRepository.listByGuild(guildId!),
    enabled: !!guildId,
  })
}
