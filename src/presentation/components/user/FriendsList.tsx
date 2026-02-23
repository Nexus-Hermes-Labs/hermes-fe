// Friends list shown on the DMs page

import { UserAvatar } from './UserAvatar'
import { UserStatusBadge } from './UserStatusBadge'
import { useGetRelationships } from '@/application/user/useGetRelationships'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { EmptyState } from '@/presentation/components/shared/EmptyState'
import type { UserStatus } from '@/domain/user/valueObjects'

export function FriendsList() {
  const { data: relationships, isLoading } = useGetRelationships()

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    )
  }

  const friends = relationships?.filter((r) => r.relationshipType === 'friend') ?? []

  if (friends.length === 0) {
    return (
      <EmptyState
        title="No friends yet"
        description="Add friends by their username to start chatting."
      />
    )
  }

  return (
    <ul className="space-y-0.5">
      {friends.map((r) => (
        <li
          key={r.relationshipId}
          className="flex items-center gap-3 rounded px-3 py-2 transition-colors cursor-pointer"
          style={{ color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-hover)'
            e.currentTarget.style.color = 'var(--color-text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = ''
            e.currentTarget.style.color = 'var(--color-text-secondary)'
          }}
        >
          <UserAvatar
            displayName={r.targetUser.displayName}
            avatarUrl={r.targetUser.avatarUrl}
            status={r.targetUser.status as UserStatus}
            showStatus
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
              {r.targetUser.displayName}
            </p>
            <UserStatusBadge
              status={r.targetUser.status as UserStatus}
              showLabel
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
