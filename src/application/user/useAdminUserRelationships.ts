// Admin: read and manage relationships for any user by ID
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'

export function useAdminGetUserFriends(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'relationships', 'friends'],
    queryFn: () => userRepository.adminGetUserFriends(userId),
    enabled: !!userId,
  })
}

export function useAdminGetUserIncomingRequests(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'relationships', 'incoming'],
    queryFn: () => userRepository.adminGetUserIncomingRequests(userId),
    enabled: !!userId,
  })
}

export function useAdminGetUserOutgoingRequests(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'relationships', 'outgoing'],
    queryFn: () => userRepository.adminGetUserOutgoingRequests(userId),
    enabled: !!userId,
  })
}

export function useAdminGetUserBlockedUsers(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'relationships', 'blocked'],
    queryFn: () => userRepository.adminGetUserBlockedUsers(userId),
    enabled: !!userId,
  })
}

export function useAdminGetUserRelationship(userId: string, targetUserId: string) {
  return useQuery({
    queryKey: ['users', userId, 'relationships', targetUserId],
    queryFn: () => userRepository.adminGetUserRelationship(userId, targetUserId),
    enabled: !!userId && !!targetUserId,
  })
}

export function useAdminManageUserRelationship(userId: string) {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['users', userId, 'relationships'] })

  const sendRequest = useMutation({
    mutationFn: (targetUserId: string) =>
      userRepository.adminSendFriendRequest(userId, targetUserId),
    onSuccess: invalidate,
  })

  const acceptRequest = useMutation({
    mutationFn: (targetUserId: string) =>
      userRepository.adminAcceptFriendRequest(userId, targetUserId),
    onSuccess: invalidate,
  })

  const declineRequest = useMutation({
    mutationFn: (targetUserId: string) =>
      userRepository.adminDeclineFriendRequest(userId, targetUserId),
    onSuccess: invalidate,
  })

  const removeFriend = useMutation({
    mutationFn: (targetUserId: string) => userRepository.adminRemoveFriend(userId, targetUserId),
    onSuccess: invalidate,
  })

  const blockUser = useMutation({
    mutationFn: (targetUserId: string) => userRepository.adminBlockUser(userId, targetUserId),
    onSuccess: invalidate,
  })

  const unblockUser = useMutation({
    mutationFn: (targetUserId: string) => userRepository.adminUnblockUser(userId, targetUserId),
    onSuccess: invalidate,
  })

  return { sendRequest, acceptRequest, declineRequest, removeFriend, blockUser, unblockUser }
}
