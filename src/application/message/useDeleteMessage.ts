import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messageRepository } from '@/infrastructure/repositories/messageRepository'

interface DeleteMessageVars {
  messageId: string
  channelId?: string
  conversationId?: string
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ messageId }: DeleteMessageVars) => messageRepository.deleteMessage(messageId),
    onSuccess: (_data, { channelId, conversationId }) => {
      if (channelId) {
        void queryClient.invalidateQueries({ queryKey: ['channels', channelId, 'messages'] })
      }
      if (conversationId) {
        void queryClient.invalidateQueries({
          queryKey: ['conversations', conversationId, 'messages'],
        })
      }
    },
  })
}
