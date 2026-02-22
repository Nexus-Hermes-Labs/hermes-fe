import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'
import { PRIVACY_QUERY_KEY } from './useGetPrivacy'
import type { UpdatePrivacyData } from '@/presentation/dto/user.dto'

export function useUpdatePrivacy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdatePrivacyData) => userRepository.updatePrivacy(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRIVACY_QUERY_KEY })
    },
  })
}
