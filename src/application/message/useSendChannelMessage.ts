import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messageRepository } from '@/infrastructure/repositories/messageRepository'
import type { SendMessageData } from '@/presentation/dto/message.dto'

export function useSendChannelMessage(channelId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SendMessageData) =>
      messageRepository.sendChannelMessage(channelId, {
        content: data.content,
        reply_to_id: data.replyToId,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['channels', channelId, 'messages'] })
    },
  })
}
