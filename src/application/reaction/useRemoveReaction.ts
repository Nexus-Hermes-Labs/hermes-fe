import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messageRepository } from '@/infrastructure/repositories/messageRepository'

interface RemoveReactionVars {
  messageId: string
  emoji: string
}

export function useRemoveReaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ messageId, emoji }: RemoveReactionVars) =>
      messageRepository.removeReaction(messageId, emoji),
    onSuccess: (_data, { messageId }) => {
      void queryClient.invalidateQueries({ queryKey: ['messages', messageId, 'reactions'] })
    },
  })
}
