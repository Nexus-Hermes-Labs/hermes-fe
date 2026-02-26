import { useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationRepository } from '@/infrastructure/repositories/conversationRepository'

interface AddMemberVars {
  conversationId: string
  userId: string
}

export function useAddConversationMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, userId }: AddMemberVars) =>
      conversationRepository.addMember(conversationId, { user_id: userId }),
    onSuccess: (_data, { conversationId }) => {
      void queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] })
      void queryClient.invalidateQueries({ queryKey: ['conversations', 'me'] })
    },
  })
}
