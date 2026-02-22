import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import type { CreateInviteDto } from '@/infrastructure/repositories/guildRepository'

export function useCreateInvite(guildId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateInviteDto) => guildRepository.createInvite(guildId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['guilds', guildId, 'invites'] })
    },
  })
}
