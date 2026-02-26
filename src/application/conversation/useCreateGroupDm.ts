import { useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationRepository } from '@/infrastructure/repositories/conversationRepository'
import { useConversationStore } from '@/state/conversationStore'
import type { CreateGroupDmData } from '@/presentation/dto/conversation.dto'

export function useCreateGroupDm() {
  const queryClient = useQueryClient()
  const { addConversation } = useConversationStore()

  return useMutation({
    mutationFn: (data: CreateGroupDmData) =>
      conversationRepository.createGroupDm({
        name: data.name,
        member_ids: data.memberIds,
      }),
    onSuccess: (conversation) => {
      addConversation(conversation)
      void queryClient.invalidateQueries({ queryKey: ['conversations', 'me'] })
    },
  })
}
