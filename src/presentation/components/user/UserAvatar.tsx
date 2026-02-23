// Avatar with status dot indicator

import { cn } from '@/lib/cn'
import { getInitials, statusToColor } from '@/lib/formatters'
import type { UserStatus } from '@/domain/user/valueObjects'

interface UserAvatarProps {
  displayName: string
  avatarUrl: string | null
  status?: UserStatus
  size?: 'sm' | 'md' | 'lg'
  showStatus?: boolean
  className?: string
}

const SIZE = {
  sm: { avatar: 'h-6 w-6 text-xs', dot: 'h-2.5 w-2.5 border' },
  md: { avatar: 'h-8 w-8 text-sm', dot: 'h-3 w-3 border' },
  lg: { avatar: 'h-10 w-10 text-base', dot: 'h-3.5 w-3.5 border-2' },
}

export function UserAvatar({
  displayName,
  avatarUrl,
  status,
  size = 'md',
  showStatus = true,
  className,
}: UserAvatarProps) {
  const s = SIZE[size]

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className={cn('rounded-full object-cover', s.avatar)}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-full font-semibold',
            s.avatar,
          )}
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          {getInitials(displayName)}
        </div>
      )}

      {showStatus && status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-solid',
            s.dot,
          )}
          style={{
            background: statusToColor(status),
            borderColor: 'var(--color-channel-sidebar)',
          }}
          aria-label={status}
        />
      )}
    </div>
  )
}
