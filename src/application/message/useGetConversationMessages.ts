import { useQuery } from '@tanstack/react-query'
import { messageRepository } from '@/infrastructure/repositories/messageRepository'

export function useGetConversationMessages(
  conversationId: string | null,
  limit = 50,
  before?: string,
) {
  return useQuery({
    queryKey: ['conversations', conversationId, 'messages', { limit, before }],
    queryFn: () =>
      messageRepository.getConversationMessages(conversationId!, {
        limit,
        before,
      }),
    enabled: !!conversationId,
    staleTime: 0,
  })
}
