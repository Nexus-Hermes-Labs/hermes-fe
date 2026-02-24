import { useQuery } from '@tanstack/react-query'
import { channelRepository } from '@/infrastructure/repositories/channelRepository'

export function useGetChannel(channelId: string) {
  return useQuery({
    queryKey: ['channels', channelId],
    queryFn: () => channelRepository.getById(channelId),
    enabled: !!channelId,
    staleTime: 1000 * 60 * 5,
  })
}
