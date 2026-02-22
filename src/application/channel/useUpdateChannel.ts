import { useMutation, useQueryClient } from '@tanstack/react-query'
import { channelRepository } from '@/infrastructure/repositories/channelRepository'
import type { UpdateChannelData } from '@/presentation/dto/channel.dto'

export function useUpdateChannel(channelId: string, guildId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateChannelData) => channelRepository.update(channelId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['guilds', guildId, 'channels'] })
    },
  })
}
