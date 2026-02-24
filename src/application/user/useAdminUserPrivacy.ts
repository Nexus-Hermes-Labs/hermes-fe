// Admin: read and update privacy settings for any user by ID
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'

export function useAdminGetUserPrivacy(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'privacy'],
    queryFn: () => userRepository.adminGetUserPrivacy(userId),
    enabled: !!userId,
  })
}

export function useAdminUpdateUserPrivacy(userId: string) {
  const queryClient = useQueryClient()

  const updateDm = useMutation({
    mutationFn: (allowDmsFrom: string) =>
      userRepository.adminUpdateUserDmPrivacy(userId, allowDmsFrom),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', userId, 'privacy'] }),
  })

  const updateFriendRequest = useMutation({
    mutationFn: (allowFriendRequestsFrom: string) =>
      userRepository.adminUpdateUserFriendRequestPrivacy(userId, allowFriendRequestsFrom),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', userId, 'privacy'] }),
  })

  const updateVisibility = useMutation({
    mutationFn: (dto: {
      show_online_status?: boolean
      show_current_activity?: boolean
      show_profile_to_non_friends?: boolean
    }) => userRepository.adminUpdateUserVisibilityPrivacy(userId, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', userId, 'privacy'] }),
  })

  const updateContent = useMutation({
    mutationFn: (dto: { allow_nsfw_content?: boolean; content_filter_level?: number }) =>
      userRepository.adminUpdateUserContentPrivacy(userId, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', userId, 'privacy'] }),
  })

  const applyPreset = useMutation({
    mutationFn: (preset: 'Public' | 'Private') =>
      userRepository.adminApplyUserPrivacyPreset(userId, preset),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', userId, 'privacy'] }),
  })

  return { updateDm, updateFriendRequest, updateVisibility, updateContent, applyPreset }
}
