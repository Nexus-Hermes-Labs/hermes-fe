// Bottom-left panel: current user info + settings icon
// Mirrors Discord's bottom bar

import { Settings, Mic, Headphones } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { UserAvatar } from './UserAvatar'
import { useAuthStore } from '@/state/authStore'
import type { UserStatus } from '@/domain/user/valueObjects'

export function UserPanel() {
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <div
      className="flex items-center gap-2 px-2 py-3 flex-shrink-0"
      style={{ background: 'var(--color-guild-sidebar)', borderTop: '1px solid var(--color-border)' }}
    >
      <UserAvatar
        displayName={user.displayName}
        avatar={user.avatar}
        status={'online' as UserStatus}
        showStatus
        size="md"
      />

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {user.displayName}
        </p>
        <p
          className="text-xs truncate"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          @{user.username}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="rounded p-1.5 transition-colors hover:opacity-80"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Mute"
        >
          <Mic size={16} />
        </button>
        <button
          className="rounded p-1.5 transition-colors hover:opacity-80"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Deafen"
        >
          <Headphones size={16} />
        </button>
        <Link
          to="/settings/account"
          className="rounded p-1.5 transition-colors hover:opacity-80"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Settings"
        >
          <Settings size={16} />
        </Link>
      </div>
    </div>
  )
}
