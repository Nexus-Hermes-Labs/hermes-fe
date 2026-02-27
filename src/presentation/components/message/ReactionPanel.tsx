import { useState } from 'react'
import { useGetReactions } from '@/application/reaction/useGetReactions'
import { useAddReaction } from '@/application/reaction/useAddReaction'
import { useRemoveReaction } from '@/application/reaction/useRemoveReaction'
import { useAuthStore } from '@/state/authStore'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

interface ReactionPanelProps {
  messageId: string
}

// Common emoji shortcuts for quick pick
const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '✅', '🎉']

export function ReactionPanel({ messageId }: ReactionPanelProps) {
  const { data: reactions, isLoading } = useGetReactions(messageId)
  const addReaction = useAddReaction()
  const removeReaction = useRemoveReaction()
  const { user } = useAuthStore()
  const [customEmoji, setCustomEmoji] = useState('')

  // Group by emoji
  const groups = (reactions ?? []).reduce<Record<string, { count: number; hasOwn: boolean }>>(
    (acc, r) => {
      if (!acc[r.emoji]) acc[r.emoji] = { count: 0, hasOwn: false }
      acc[r.emoji].count++
      if (r.userId === user?.userId) acc[r.emoji].hasOwn = true
      return acc
    },
    {},
  )

  const toggle = (emoji: string, hasOwn: boolean) => {
    if (hasOwn) {
      removeReaction.mutate({ messageId, emoji })
    } else {
      addReaction.mutate({ messageId, emoji })
    }
  }

  const handleCustomAdd = () => {
    const emoji = customEmoji.trim()
    if (!emoji) return
    addReaction.mutate({ messageId, emoji })
    setCustomEmoji('')
  }

  if (isLoading) {
    return (
      <div className="mt-1">
        <LoadingSpinner size="sm" />
      </div>
    )
  }

  return (
    <div
      className="mt-2 rounded-lg p-3"
      style={{ background: 'var(--color-channel-sidebar)', border: '1px solid var(--color-border)' }}
    >
      {/* Existing reactions */}
      {Object.keys(groups).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {Object.entries(groups).map(([emoji, { count, hasOwn }]) => (
            <button
              key={emoji}
              onClick={() => toggle(emoji, hasOwn)}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors"
              style={{
                background: hasOwn ? 'rgba(88,101,242,0.2)' : 'var(--color-input-bg)',
                border: `1px solid ${hasOwn ? 'var(--color-accent)' : 'var(--color-border)'}`,
                color: 'var(--color-text-primary)',
              }}
            >
              <span>{emoji}</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick emoji */}
      <div className="flex flex-wrap gap-1 mb-2">
        {QUICK_EMOJIS.map((emoji) => {
          const g = groups[emoji]
          return (
            <button
              key={emoji}
              onClick={() => toggle(emoji, g?.hasOwn ?? false)}
              className="h-7 w-7 flex items-center justify-center rounded text-base transition-colors hover:scale-110"
              style={{ background: 'var(--color-input-bg)' }}
              title={`React ${emoji}`}
            >
              {emoji}
            </button>
          )
        })}
      </div>

      {/* Custom emoji input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customEmoji}
          onChange={(e) => setCustomEmoji(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleCustomAdd()
            }
          }}
          placeholder="Custom emoji…"
          maxLength={32}
          className="flex-1 rounded px-2 py-1 text-xs outline-none"
          style={{
            background: 'var(--color-input-bg)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
          }}
        />
        <button
          onClick={handleCustomAdd}
          disabled={!customEmoji.trim()}
          className="rounded px-2 py-1 text-xs font-medium disabled:opacity-40"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          Add
        </button>
      </div>
    </div>
  )
}
