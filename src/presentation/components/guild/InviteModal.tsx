// Invite code modal — generates and displays an invite link

import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import { useCreateInvite } from '@/application/guild/useCreateInvite'
import { useUIStore } from '@/state/uiStore'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

interface InviteModalProps {
  guildId: string
}

export function InviteModal({ guildId }: InviteModalProps) {
  const { isModalOpen, closeModal } = useUIStore()
  const isOpen = isModalOpen('invite')
  const createInvite = useCreateInvite(guildId)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const inviteUrl = createInvite.data
    ? `${window.location.origin}/join/${createInvite.data.code}`
    : null

  const handleGenerate = () => {
    createInvite.mutate({})
  }

  const handleCopy = async () => {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && closeModal('invite')}
    >
      <div
        className="relative w-full max-w-md rounded-lg p-6 shadow-2xl"
        style={{ background: 'var(--color-channel-sidebar)' }}
      >
        <button
          onClick={() => closeModal('invite')}
          className="absolute right-4 top-4 rounded p-1"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2
          className="mb-4 text-xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Invite People
        </h2>

        {!inviteUrl ? (
          <button
            onClick={handleGenerate}
            disabled={createInvite.isPending}
            className="flex w-full items-center justify-center gap-2 rounded py-2.5 text-sm font-semibold text-white"
            style={{ background: 'var(--color-accent)' }}
          >
            {createInvite.isPending ? <LoadingSpinner size="sm" /> : 'Generate Invite Link'}
          </button>
        ) : (
          <div
            className="flex items-center gap-2 rounded px-3 py-2"
            style={{ background: 'var(--color-input-bg)' }}
          >
            <span
              className="flex-1 text-sm truncate"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {inviteUrl}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-white flex-shrink-0"
              style={{ background: copied ? 'var(--color-success)' : 'var(--color-accent)' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}

        <p
          className="mt-3 text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Your invite link expires in 7 days.
        </p>
      </div>
    </div>
  )
}
