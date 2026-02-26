import { useQuery } from '@tanstack/react-query'
import { conversationRepository } from '@/infrastructure/repositories/conversationRepository'
import { useConversationStore } from '@/state/conversationStore'

export function useGetMyConversations() {
  const { setConversations } = useConversationStore()

  return useQuery({
    queryKey: ['conversations', 'me'],
    queryFn: async () => {
      const result = await conversationRepository.getMyConversations()
      setConversations(result.conversations)
      return result
    },
  })
}
