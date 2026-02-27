import { useEffect, useRef } from 'react'
import { Hash, MessageSquare } from 'lucide-react'
import { MessageItem } from './MessageItem'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import type { Message } from '@/domain/message/entities'

interface MessageListProps {
  // Passed in display order: oldest first (index 0) → newest last
  messages: Message[]
  isLoading: boolean
  onEdit: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
  onReply: (message: Message) => void
  // Welcome banner shown at the top (before any messages)
  welcomeTitle: string
  welcomeSubtitle: string
  welcomeIcon?: 'hash' | 'dm'
}

export function MessageList({
  messages,
  isLoading,
  onEdit,
  onDelete,
  onReply,
  welcomeTitle,
  welcomeSubtitle,
  welcomeIcon = 'hash',
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Welcome banner — always at top */}
      <div className="flex flex-col items-start px-4 pt-6 pb-4">
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'var(--color-input-bg)' }}
        >
          {welcomeIcon === 'hash' ? (
            <Hash size={36} style={{ color: 'var(--color-text-muted)' }} />
          ) : (
            <MessageSquare size={36} style={{ color: 'var(--color-text-muted)' }} />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          {welcomeTitle}
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {welcomeSubtitle}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-4" style={{ borderTop: '1px solid var(--color-border)' }} />

      {/* Message items */}
      <div className="flex flex-col gap-0.5 pb-2">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
          />
        ))}
      </div>

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  )
}
