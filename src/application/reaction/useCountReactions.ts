import { useQuery } from '@tanstack/react-query'
import { messageRepository } from '@/infrastructure/repositories/messageRepository'

export function useCountReactions(messageId: string | null, emoji: string | null) {
  return useQuery({
    queryKey: ['messages', messageId, 'reactions', emoji, 'count'],
    queryFn: () => messageRepository.countReactions(messageId!, emoji!),
    enabled: !!messageId && !!emoji,
  })
}
