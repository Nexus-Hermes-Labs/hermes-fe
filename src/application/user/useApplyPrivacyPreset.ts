import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userRepository } from '@/infrastructure/repositories/userRepository'

export function useApplyPrivacyPreset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (preset: 'Public' | 'Private') => userRepository.applyPrivacyPreset(preset),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users', '@me', 'privacy'] })
    },
  })
}
