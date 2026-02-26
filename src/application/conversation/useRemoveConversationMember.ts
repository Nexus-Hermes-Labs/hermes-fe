import { useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationRepository } from '@/infrastructure/repositories/conversationRepository'

interface RemoveMemberVars {
  conversationId: string
  userId: string
}

export function useRemoveConversationMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, userId }: RemoveMemberVars) =>
      conversationRepository.removeMember(conversationId, userId),
    onSuccess: (_data, { conversationId }) => {
      void queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] })
      void queryClient.invalidateQueries({ queryKey: ['conversations', 'me'] })
    },
  })
}
