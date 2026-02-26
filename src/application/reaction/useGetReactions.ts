import { useQuery } from '@tanstack/react-query'
import { messageRepository } from '@/infrastructure/repositories/messageRepository'

export function useGetReactions(messageId: string | null) {
  return useQuery({
    queryKey: ['messages', messageId, 'reactions'],
    queryFn: () => messageRepository.getReactions(messageId!),
    enabled: !!messageId,
  })
}
