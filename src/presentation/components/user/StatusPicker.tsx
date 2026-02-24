// Status picker dropdown — anchored to the status dot in UserPanel

import { useEffect, useRef } from 'react'
import { useUIStore } from '@/state/uiStore'
import { useUpdateStatus } from '@/application/user/useUpdateStatus'
import { statusToColor, statusToLabel } from '@/lib/formatters'
import type { UserStatus } from '@/domain/user/valueObjects'

const STATUS_OPTIONS: UserStatus[] = ['online', 'idle', 'dnd', 'offline']

interface StatusPickerProps {
  onClose: () => void
}

export function StatusPicker({ onClose }: StatusPickerProps) {
  const { openModal } = useUIStore()
  const updateStatus = useUpdateStatus()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const handleSelectStatus = (status: UserStatus) => {
    updateStatus.mutate({ status })
    onClose()
  }

  const handleCustomStatus = () => {
    openModal('customStatus')
    onClose()
  }

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-2 w-48 rounded-lg shadow-xl overflow-hidden z-10"
      style={{ background: 'var(--color-channel-sidebar)', border: '1px solid var(--color-border)' }}
    >
      {STATUS_OPTIONS.map((status) => (
        <button
          key={status}
          onClick={() => handleSelectStatus(status)}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors hover:opacity-80"
          style={{ color: 'var(--color-text-primary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = ''
          }}
        >
          <span
            className="h-3 w-3 rounded-full flex-shrink-0"
            style={{ background: statusToColor(status) }}
          />
          {statusToLabel(status)}
        </button>
      ))}

      <div
        style={{ borderTop: '1px solid var(--color-border)' }}
      />

      <button
        onClick={handleCustomStatus}
        className="flex w-full items-center px-3 py-2 text-sm transition-colors"
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
        Set Custom Status...
      </button>
    </div>
  )
}
