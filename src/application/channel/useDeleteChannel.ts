import { useMutation, useQueryClient } from '@tanstack/react-query'
import { channelRepository } from '@/infrastructure/repositories/channelRepository'

export function useDeleteChannel(guildId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (channelId: string) => channelRepository.delete(channelId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['guilds', guildId, 'channels'] })
    },
  })
}
