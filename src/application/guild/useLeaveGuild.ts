import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import { useGuildStore } from '@/state/guildStore'

export function useLeaveGuild() {
  const queryClient = useQueryClient()
  const { removeGuild } = useGuildStore()

  return useMutation({
    mutationFn: (guildId: string) => guildRepository.leave(guildId),
    onSuccess: (_, guildId) => {
      removeGuild(guildId)
      void queryClient.invalidateQueries({ queryKey: ['guilds'] })
    },
  })
}
