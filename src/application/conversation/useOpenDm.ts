import { useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationRepository } from '@/infrastructure/repositories/conversationRepository'
import { useConversationStore } from '@/state/conversationStore'

export function useOpenDm() {
  const queryClient = useQueryClient()
  const { addConversation } = useConversationStore()

  return useMutation({
    mutationFn: (targetUserId: string) =>
      conversationRepository.openDm({ target_user_id: targetUserId }),
    onSuccess: (conversation) => {
      addConversation(conversation)
      void queryClient.invalidateQueries({ queryKey: ['conversations', 'me'] })
    },
  })
}
