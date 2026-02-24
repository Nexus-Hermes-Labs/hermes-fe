// /join/$code — auto-join a guild from a link

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useJoinByCode } from '@/application/guild/useJoinByCode'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

interface JoinByCodePageProps {
  code: string
}

export default function JoinByCodePage({ code }: JoinByCodePageProps) {
  const navigate = useNavigate()
  const joinByCode = useJoinByCode()
  const [joinError, setJoinError] = useState<string | null>(null)
  const [altCode, setAltCode] = useState('')
  const hasAttempted = useRef(false)

  useEffect(() => {
    if (!code || hasAttempted.current) return
    hasAttempted.current = true
    joinByCode.mutate(code, {
      onSuccess: (guild) => {
        void navigate({ to: `/channels/${guild.guildId}/@me` })
      },
      onError: () => {
        setJoinError('This invite link is invalid or has expired.')
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const handleAltJoin = () => {
    if (altCode.length !== 8) return
    setJoinError(null)
    joinByCode.mutate(altCode, {
      onSuccess: (guild) => {
        void navigate({ to: `/channels/${guild.guildId}/@me` })
      },
      onError: () => {
        setJoinError('This invite link is invalid or has expired.')
      },
    })
  }

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-6 p-8"
      style={{ color: 'var(--color-text-primary)' }}
    >
      {joinByCode.isPending && !joinError ? (
        <>
          <LoadingSpinner size="lg" />
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
            Joining server...
          </p>
        </>
      ) : joinError ? (
        <>
          <p className="text-lg font-semibold" style={{ color: 'var(--color-danger)' }}>
            {joinError}
          </p>
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Enter a different invite code:
            </p>
            <input
              type="text"
              value={altCode}
              onChange={(e) => setAltCode(e.target.value.toUpperCase().slice(0, 8))}
              placeholder="ABCD1234"
              maxLength={8}
              className="w-full rounded px-3 py-2 text-sm outline-none font-mono tracking-widest uppercase text-center"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border: '1px solid transparent',
              }}
            />
            <button
              onClick={handleAltJoin}
              disabled={altCode.length !== 8 || joinByCode.isPending}
              className="w-full rounded py-2 text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--color-accent)' }}
            >
              {joinByCode.isPending ? 'Joining...' : 'Join Server'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}
