import { useMutation, useQueryClient } from '@tanstack/react-query'
import { channelRepository } from '@/infrastructure/repositories/channelRepository'
import { useUIStore } from '@/state/uiStore'
import type { CreateChannelData } from '@/presentation/dto/channel.dto'

export function useCreateChannel(guildId: string) {
  const queryClient = useQueryClient()
  const { closeModal } = useUIStore()

  return useMutation({
    mutationFn: (data: CreateChannelData) =>
      channelRepository.create(guildId, {
        name: data.name,
        channel_type: data.channel_type,
        topic: data.topic,
        parent_id: data.parent_id,
        position: data.position,
      }),
    onSuccess: () => {
      closeModal('createChannel')
      void queryClient.invalidateQueries({ queryKey: ['guilds', guildId, 'channels'] })
    },
  })
}
