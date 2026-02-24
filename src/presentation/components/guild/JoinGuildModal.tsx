// Join a guild by entering an 8-character invite code
// Shows a live preview of the guild when code is exactly 8 chars

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useUIStore } from '@/state/uiStore'
import { useGetInviteByCode } from '@/application/guild/useGetInviteByCode'
import { useJoinByCode } from '@/application/guild/useJoinByCode'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

export function JoinGuildModal() {
  const { isModalOpen, closeModal, getModalData } = useUIStore()
  const navigate = useNavigate()

  const isOpen = isModalOpen('joinGuild')
  const prefillCode = getModalData<string>('joinGuild')

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setCode(prefillCode ?? '')
      setError(null)
    }
  }, [isOpen, prefillCode])

  const { data: invite, isLoading: inviteLoading, isError: inviteError } = useGetInviteByCode(code)
  const joinByCode = useJoinByCode()

  const handleClose = () => closeModal('joinGuild')

  const handleJoin = () => {
    setError(null)
    joinByCode.mutate(code, {
      onSuccess: (guild) => {
        void navigate({ to: `/channels/${guild.guildId}/@me` })
        handleClose()
      },
      onError: () => setError('Invalid or expired invite link. Please try again.'),
    })
  }

  if (!isOpen) return null

  const showPreview = code.length === 8 && !inviteLoading && !inviteError && !!invite
  const showInvalidHint = code.length === 8 && !inviteLoading && (inviteError || !invite)

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
          className="mb-1 text-xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Join a Server
        </h2>
        <p
          className="mb-5 text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Enter an invite code to join an existing server.
        </p>

        <div className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Invite Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().slice(0, 8))
                setError(null)
              }}
              placeholder="Enter 8-character code"
              className="w-full rounded px-3 py-2 text-sm outline-none font-mono tracking-widest uppercase"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border:
                  showInvalidHint || error
                    ? '1px solid var(--color-danger)'
                    : '1px solid transparent',
              }}
              maxLength={8}
            />
          </div>

          {/* Preview */}
          {code.length === 8 && inviteLoading && (
            <div className="flex items-center gap-2 py-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Looking up invite...
              </span>
            </div>
          )}

          {showPreview && (
            <div
              className="rounded p-3"
              style={{ background: 'var(--color-input-bg)' }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                You are joining
              </p>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {invite.code}
              </p>
              {invite.expiresAt && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  Expires {new Date(invite.expiresAt).toLocaleDateString()}
                </p>
              )}
              {invite.maxUses !== null && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {invite.uses} / {invite.maxUses} uses
                </p>
              )}
            </div>
          )}

          {(showInvalidHint || error) && (
            <p className="text-xs" style={{ color: 'var(--color-danger)' }}>
              {error ?? 'Invalid or expired invite link.'}
            </p>
          )}

          <button
            onClick={handleJoin}
            disabled={code.length !== 8 || joinByCode.isPending}
            className="flex w-full items-center justify-center gap-2 rounded py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ background: 'var(--color-accent)' }}
          >
            {joinByCode.isPending ? (
              <>
                <LoadingSpinner size="sm" />
                Joining...
              </>
            ) : (
              'Join Server'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
