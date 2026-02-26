import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messageRepository } from '@/infrastructure/repositories/messageRepository'
import type { SendMessageData } from '@/presentation/dto/message.dto'

export function useSendConversationMessage(conversationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SendMessageData) =>
      messageRepository.sendConversationMessage(conversationId, {
        content: data.content,
        reply_to_id: data.replyToId,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['conversations', conversationId, 'messages'],
      })
    },
  })
}
