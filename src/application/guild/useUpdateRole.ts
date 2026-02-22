import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'
import type { UpdateRoleData } from '@/presentation/dto/role.dto'

export function useUpdateRole(guildId: string, roleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateRoleData) => guildRepository.updateRole(guildId, roleId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['guilds', guildId, 'roles'] })
    },
  })
}
