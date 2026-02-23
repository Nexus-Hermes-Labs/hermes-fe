import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import { useGuildStore } from '@/state/guildStore'

export function useJoinByCode() {
  const queryClient = useQueryClient()
  const { addGuild } = useGuildStore()

  return useMutation({
    mutationFn: (code: string) => guildRepository.joinByCode(code),
    onSuccess: (guild) => {
      addGuild(guild)
      void queryClient.invalidateQueries({ queryKey: ['guilds'] })
    },
  })
}
