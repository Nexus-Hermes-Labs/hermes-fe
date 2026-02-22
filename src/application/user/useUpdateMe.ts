import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { ME_QUERY_KEY } from '@/application/auth/useGetMe'
import type { UpdateProfileData } from '@/presentation/dto/user.dto'

export function useUpdateMe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userRepository.updateMe(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
    },
  })
}
