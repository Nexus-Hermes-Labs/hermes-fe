import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messageRepository } from '@/infrastructure/repositories/messageRepository'

interface AddReactionVars {
  messageId: string
  emoji: string
}

export function useAddReaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ messageId, emoji }: AddReactionVars) =>
      messageRepository.addReaction(messageId, emoji),
    onSuccess: (_data, { messageId }) => {
      void queryClient.invalidateQueries({ queryKey: ['messages', messageId, 'reactions'] })
    },
  })
}
