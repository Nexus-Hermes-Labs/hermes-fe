import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import { useGuildStore } from '@/state/guildStore'
import { useUIStore } from '@/state/uiStore'
import type { CreateGuildData } from '@/presentation/dto/guild.dto'

export function useCreateGuild() {
  const queryClient = useQueryClient()
  const { addGuild } = useGuildStore()
  const { closeModal } = useUIStore()

  return useMutation({
    mutationFn: (data: CreateGuildData) =>
      guildRepository.create({
        name: data.name,
        description: data.description,
        icon_url: data.icon_url,
      }),
    onSuccess: (guild) => {
      addGuild(guild)
      closeModal('createGuild')
      void queryClient.invalidateQueries({ queryKey: ['guilds'] })
    },
  })
}
