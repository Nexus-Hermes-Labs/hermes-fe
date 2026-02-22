import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'

export function useDeleteInvite(guildId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) => guildRepository.deleteInvite(guildId, inviteId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['guilds', guildId, 'invites'] })
    },
  })
}
