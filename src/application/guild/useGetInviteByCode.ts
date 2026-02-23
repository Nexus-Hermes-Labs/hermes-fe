import { useQuery } from '@tanstack/react-query'
import { guildRepository } from '@/infrastructure/repositories/guildRepository'

export function useGetInviteByCode(code: string) {
  return useQuery({
    queryKey: ['invites', code],
    queryFn: () => guildRepository.getInviteByCode(code),
    enabled: code.length === 8,
  })
}
