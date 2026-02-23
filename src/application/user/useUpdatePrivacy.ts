import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { PRIVACY_QUERY_KEY } from './useGetPrivacy'
import type { UpdatePrivacyData } from '@/presentation/dto/user.dto'

// Dispatches to granular backend privacy endpoints based on which fields are provided
export function useUpdatePrivacy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdatePrivacyData) => {
      const calls: Promise<void>[] = []

      if (data.allow_dms_from !== undefined) {
        calls.push(userRepository.updateDmPrivacy(data.allow_dms_from))
      }
      if (data.allow_friend_requests_from !== undefined) {
        calls.push(userRepository.updateFriendRequestPrivacy(data.allow_friend_requests_from))
      }

      const visibilityKeys = ['show_online_status', 'show_current_activity', 'show_profile_to_non_friends'] as const
      const visibilityDto: Record<string, boolean> = {}
      visibilityKeys.forEach((key) => {
        if (data[key] !== undefined) visibilityDto[key] = data[key]!
      })
      if (Object.keys(visibilityDto).length > 0) {
        calls.push(userRepository.updateVisibilityPrivacy(visibilityDto))
      }

      const contentKeys = ['allow_nsfw_content', 'content_filter_level'] as const
      const contentDto: Record<string, boolean | number> = {}
      contentKeys.forEach((key) => {
        if (data[key] !== undefined) contentDto[key] = data[key]!
      })
      if (Object.keys(contentDto).length > 0) {
        calls.push(userRepository.updateContentPrivacy(contentDto as { allow_nsfw_content?: boolean; content_filter_level?: number }))
      }

      await Promise.all(calls)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRIVACY_QUERY_KEY })
    },
  })
}
