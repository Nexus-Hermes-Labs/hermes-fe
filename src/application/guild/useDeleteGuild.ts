import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import { useGuildStore } from '@/state/guildStore'

export function useDeleteGuild(guildId: string) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { removeGuild } = useGuildStore()

  return useMutation({
    mutationFn: () => guildRepository.delete(guildId),
    onSuccess: () => {
      removeGuild(guildId)
      void queryClient.invalidateQueries({ queryKey: ['guilds'] })
      void router.navigate({ to: '/channels/@me' })
    },
  })
}
