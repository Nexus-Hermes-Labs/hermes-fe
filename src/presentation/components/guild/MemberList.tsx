// Right panel: guild members with role colors + status

import { useGetMembers } from '@/application/guild/useGetMembers'
import { useGetRoles } from '@/application/guild/useGetRoles'
import { UserAvatar } from '@/presentation/components/user/UserAvatar'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { rgbIntToHex } from '@/lib/permissions'
import type { UserStatus } from '@/domain/user/valueObjects'
import type { GuildMember, GuildRole } from '@/domain/guild/entities'

interface MemberListProps {
  guildId: string
}

function getRoleColor(member: GuildMember, roles: GuildRole[]): string | undefined {
  if (member.roleIds.length === 0) return undefined
  // Find highest-position role with a color
  const memberRoles = roles
    .filter((r) => member.roleIds.includes(r.roleId) && r.color !== 0)
    .sort((a, b) => b.position - a.position)
  if (memberRoles.length === 0) return undefined
  return rgbIntToHex(memberRoles[0].color)
}

export function MemberList({ guildId }: MemberListProps) {
  const { data: members, isLoading: loadingMembers } = useGetMembers(guildId)
  const { data: roles } = useGetRoles(guildId)

  if (loadingMembers) {
    return (
      <div className="flex justify-center p-4">
        <LoadingSpinner size="sm" />
      </div>
    )
  }

  const onlineMembers = members?.filter(
    (m) => m.user && m.user.status !== 'offline' && !m.leftAt,
  ) ?? []
  const offlineMembers = members?.filter(
    (m) => !m.user || m.user.status === 'offline',
  ) ?? []

  const renderMember = (member: GuildMember) => {
    if (!member.user) return null
    const roleColor = roles ? getRoleColor(member, roles) : undefined

    return (
      <div
        key={member.userId}
        className="flex items-center gap-2 rounded px-2 py-1.5 mx-1 cursor-pointer transition-colors"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = ''
        }}
      >
        <UserAvatar
          displayName={member.user.displayName}
          avatarUrl={member.user.avatarUrl}
          status={member.user.status as UserStatus}
          showStatus
          size="sm"
        />
        <span
          className="text-sm font-medium truncate"
          style={{ color: roleColor ?? 'var(--color-text-secondary)' }}
        >
          {member.nickname ?? member.user.displayName}
        </span>
      </div>
    )
  }

  return (
    <div className="py-4">
      {onlineMembers.length > 0 && (
        <div>
          <p
            className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Online — {onlineMembers.length}
          </p>
          {onlineMembers.map(renderMember)}
        </div>
      )}
      {offlineMembers.length > 0 && (
        <div className="mt-4">
          <p
            className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Offline — {offlineMembers.length}
          </p>
          {offlineMembers.map(renderMember)}
        </div>
      )}
    </div>
  )
}
