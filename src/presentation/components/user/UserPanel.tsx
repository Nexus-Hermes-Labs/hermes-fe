// Bottom-left panel: current user info + settings icon
// Mirrors Discord's bottom bar

import { useState } from 'react'
import { Settings, Mic, Headphones } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { UserAvatar } from './UserAvatar'
import { StatusPicker } from './StatusPicker'
import { useAuthStore } from '@/state/authStore'
import type { UserStatus } from '@/domain/user/valueObjects'

export function UserPanel() {
  const { user } = useAuthStore()
  const [pickerOpen, setPickerOpen] = useState(false)

  if (!user) return null

  const status = (user.status ?? 'offline') as UserStatus

  return (
    <div
      className="relative flex items-center gap-2 px-2 py-3 flex-shrink-0"
      style={{ background: 'var(--color-guild-sidebar)', borderTop: '1px solid var(--color-border)' }}
    >
      <button
        onClick={() => setPickerOpen((v) => !v)}
        className="rounded-full focus:outline-none"
        aria-label="Change status"
        title="Change status"
      >
        <UserAvatar
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          status={status}
          showStatus
          size="md"
        />
      </button>

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

      {pickerOpen && <StatusPicker onClose={() => setPickerOpen(false)} />}
    </div>
  )
}
