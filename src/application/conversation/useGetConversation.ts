import { useQuery } from '@tanstack/react-query'
import { conversationRepository } from '@/infrastructure/repositories/conversationRepository'

export function useGetConversation(conversationId: string | null) {
  return useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: () => conversationRepository.getById(conversationId!),
    enabled: !!conversationId,
  })
}
