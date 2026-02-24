// Admin: update/delete/username/status/custom-status for any user by ID
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository, type UpdateProfileDto, type UpdateStatusDto, type UpdateCustomStatusDto } from '@/infrastructure/repositories/userRepository'

export function useAdminUpdateUser(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => userRepository.adminUpdateUser(userId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
    },
  })
}

export function useAdminDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => userRepository.adminDeleteUser(userId),
    onSuccess: (_data, userId) => {
      queryClient.removeQueries({ queryKey: ['users', userId] })
    },
  })
}

export function useAdminChangeUsername(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newUsername: string) => userRepository.adminChangeUsername(userId, newUsername),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
    },
  })
}

export function useAdminUpdateUserStatus(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateStatusDto) => userRepository.adminUpdateUserStatus(userId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
    },
  })
}

export function useAdminUserCustomStatus(userId: string) {
  const queryClient = useQueryClient()

  const update = useMutation({
    mutationFn: (dto: UpdateCustomStatusDto) =>
      userRepository.adminUpdateUserCustomStatus(userId, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', userId] }),
  })

  const clear = useMutation({
    mutationFn: () => userRepository.adminClearUserCustomStatus(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', userId] }),
  })

  return { update, clear }
}
