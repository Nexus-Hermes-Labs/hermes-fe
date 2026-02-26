import { useQuery } from '@tanstack/react-query'
import { messageRepository } from '@/infrastructure/repositories/messageRepository'

export function useGetChannelMessages(channelId: string | null, limit = 50, before?: string) {
  return useQuery({
    queryKey: ['channels', channelId, 'messages', { limit, before }],
    queryFn: () =>
      messageRepository.getChannelMessages(channelId!, {
        limit,
        before,
      }),
    enabled: !!channelId,
    staleTime: 0,
  })
}
