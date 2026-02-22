import { useMutation, useQueryClient } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'

export function useDeleteRole(guildId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roleId: string) => guildRepository.deleteRole(guildId, roleId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['guilds', guildId, 'roles'] })
    },
  })
}
