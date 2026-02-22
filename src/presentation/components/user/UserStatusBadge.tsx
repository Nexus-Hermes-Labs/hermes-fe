import { cn } from '@/lib/cn'
import { statusToColor, statusToLabel } from '@/lib/formatters'
import type { UserStatus } from '@/domain/user/valueObjects'

interface UserStatusBadgeProps {
  status: UserStatus
  showLabel?: boolean
  className?: string
}

export function UserStatusBadge({ status, showLabel, className }: UserStatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span
        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
        style={{ background: statusToColor(status) }}
        aria-hidden="true"
      />
      {showLabel && (
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {statusToLabel(status)}
        </span>
      )}
    </span>
  )
}
