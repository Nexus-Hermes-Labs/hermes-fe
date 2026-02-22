import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import type { CreateRoleData } from '@/presentation/dto/role.dto'

export function useCreateRole(guildId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoleData) =>
      guildRepository.createRole(guildId, {
        name: data.name,
        color: data.color,
        permissions: data.permissions,
        hoist: data.hoist,
        mentionable: data.mentionable,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['guilds', guildId, 'roles'] })
    },
  })
}
