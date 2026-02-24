// Set or clear custom status

import { useState } from 'react'
import { X } from 'lucide-react'
import { useUIStore } from '@/state/uiStore'
import { useAuthStore } from '@/state/authStore'
import { useUpdateCustomStatus, useClearCustomStatus } from '@/application/user/useUpdateCustomStatus'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

type ExpiresOption = 'never' | '30min' | '1hour' | '4hours' | 'today' | 'thisweek'

function computeExpiresAt(option: ExpiresOption): string | null {
  if (option === 'never') return null
  const now = new Date()
  switch (option) {
    case '30min': now.setMinutes(now.getMinutes() + 30); break
    case '1hour': now.setHours(now.getHours() + 1); break
    case '4hours': now.setHours(now.getHours() + 4); break
    case 'today': now.setHours(23, 59, 59, 0); break
    case 'thisweek': {
      const day = now.getDay()
      const daysUntilSunday = day === 0 ? 0 : 7 - day
      now.setDate(now.getDate() + daysUntilSunday)
      now.setHours(23, 59, 59, 0)
      break
    }
  }
  return now.toISOString()
}

export function CustomStatusModal() {
  const { isModalOpen, closeModal } = useUIStore()
  const { user } = useAuthStore()
  const updateCustomStatus = useUpdateCustomStatus()
  const clearCustomStatus = useClearCustomStatus()

  const isOpen = isModalOpen('customStatus')

  const [text, setText] = useState(user?.customStatus?.text ?? '')
  const [emoji, setEmoji] = useState(user?.customStatus?.emoji ?? '')
  const [expires, setExpires] = useState<ExpiresOption>('never')
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    closeModal('customStatus')
    setError(null)
  }

  const handleSave = () => {
    if (text.length > 128) {
      setError('Status text must be at most 128 characters.')
      return
    }
    updateCustomStatus.mutate(
      {
        text: text || null,
        emoji: emoji || null,
        expires_at: computeExpiresAt(expires),
      },
      {
        onSuccess: handleClose,
        onError: () => setError('Failed to update custom status. Please try again.'),
      },
    )
  }

  const handleClear = () => {
    clearCustomStatus.mutate(undefined, {
      onSuccess: handleClose,
      onError: () => setError('Failed to clear custom status. Please try again.'),
    })
  }

  if (!isOpen) return null

  const hasExistingStatus = !!(user?.customStatus?.text || user?.customStatus?.emoji)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="relative w-full max-w-md rounded-lg p-6 shadow-2xl"
        style={{ background: 'var(--color-channel-sidebar)' }}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded p-1 transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2
          className="mb-4 text-xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Set a Custom Status
        </h2>

        <div className="space-y-4">
          {/* Emoji + text row */}
          <div className="flex gap-2">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Emoji
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value.slice(0, 4))}
                placeholder="😊"
                className="w-16 rounded px-3 py-2 text-center text-sm outline-none"
                style={{
                  background: 'var(--color-input-bg)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid transparent',
                }}
                maxLength={4}
              />
            </div>
            <div className="flex-1">
              <label
                className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Status Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={128}
                className="w-full rounded px-3 py-2 text-sm outline-none"
                style={{
                  background: 'var(--color-input-bg)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid transparent',
                }}
              />
              <p
                className="mt-1 text-right text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {text.length}/128
              </p>
            </div>
          </div>

          {/* Expires select */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Clear After
            </label>
            <select
              value={expires}
              onChange={(e) => setExpires(e.target.value as ExpiresOption)}
              className="w-full rounded px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border: '1px solid transparent',
              }}
            >
              <option value="never">Never</option>
              <option value="30min">30 minutes</option>
              <option value="1hour">1 hour</option>
              <option value="4hours">4 hours</option>
              <option value="today">Today</option>
              <option value="thisweek">This week</option>
            </select>
          </div>

          {error && (
            <p className="text-xs" style={{ color: 'var(--color-danger)' }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={updateCustomStatus.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded py-2 text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: 'var(--color-accent)' }}
            >
              {updateCustomStatus.isPending ? <LoadingSpinner size="sm" /> : 'Save Status'}
            </button>

            {hasExistingStatus && (
              <button
                onClick={handleClear}
                disabled={clearCustomStatus.isPending}
                className="rounded px-3 py-2 text-sm font-semibold disabled:opacity-60"
                style={{
                  background: 'var(--color-hover)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {clearCustomStatus.isPending ? <LoadingSpinner size="sm" /> : 'Clear'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
