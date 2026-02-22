import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import { useGuildStore } from '@/state/guildStore'
import type { UpdateGuildData } from '@/presentation/dto/guild.dto'

export function useUpdateGuild(guildId: string) {
  const queryClient = useQueryClient()
  const { updateGuild } = useGuildStore()

  return useMutation({
    mutationFn: (data: UpdateGuildData) => guildRepository.update(guildId, data),
    onSuccess: (guild) => {
      updateGuild(guild)
      void queryClient.invalidateQueries({ queryKey: ['guilds', guildId] })
    },
  })
}
