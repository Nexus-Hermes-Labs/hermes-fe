import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messageRepository } from '@/infrastructure/repositories/messageRepository'
import type { Message } from '@/domain/message/entities'

interface EditMessageVars {
  messageId: string
  content: string
  // Pass through so we can invalidate the right key
  channelId?: string
  conversationId?: string
}

export function useEditMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ messageId, content }: EditMessageVars) =>
      messageRepository.editMessage(messageId, { content }),
    onSuccess: (_updated: Message, { channelId, conversationId }) => {
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
