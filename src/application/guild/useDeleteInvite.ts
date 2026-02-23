import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'

export function useDeleteInvite(guildId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    // code is the 8-char invite code, not a UUID
    mutationFn: (code: string) => guildRepository.deleteInvite(guildId, code),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['guilds', guildId, 'invites'] })
    },
  })
}
