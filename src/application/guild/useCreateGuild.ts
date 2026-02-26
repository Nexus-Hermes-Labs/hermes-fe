import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import { useGuildStore } from '@/state/guildStore'
import { useUIStore } from '@/state/uiStore'
import type { CreateGuildData } from '@/presentation/dto/guild.dto'

export function useCreateGuild() {
  const queryClient = useQueryClient()
  const { addGuild } = useGuildStore()
  const { closeModal } = useUIStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateGuildData) =>
      guildRepository.create({
        name: data.name,
        description: data.description,
        icon_url: data.icon_url,
      }),
    onSuccess: ({ guild, firstChannelId }) => {
      addGuild(guild)
      closeModal('createGuild')
      void queryClient.invalidateQueries({ queryKey: ['guilds'] })
      void queryClient.invalidateQueries({ queryKey: ['channels', guild.guildId] })
      void navigate({ to: `/channels/${guild.guildId}/${firstChannelId}` })
    },
  })
}
