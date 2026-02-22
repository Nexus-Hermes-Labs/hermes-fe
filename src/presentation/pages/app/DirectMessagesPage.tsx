// DMs + Friends page — /channels/@me

import { Users } from 'lucide-react'
import { FriendsList } from '@/presentation/components/user/FriendsList'

export default function DirectMessagesPage() {
  return (
    <div className="flex h-full">
      {/* Friends sidebar */}
      <div
        className="w-60 flex-shrink-0 overflow-y-auto py-4"
        style={{ background: 'var(--color-channel-sidebar)', borderRight: '1px solid var(--color-border)' }}
      >
        <div className="px-4 pb-2">
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Direct Messages
          </p>
        </div>
        <FriendsList />
      </div>

      {/* Main area */}
      <div
        className="flex flex-1 flex-col items-center justify-center"
        style={{ background: 'var(--color-content-area)' }}
      >
        <Users
          size={80}
          className="mb-4"
          style={{ color: 'var(--color-text-muted)' }}
        />
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          No open conversations
        </h2>
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Select a friend to start a conversation.
        </p>
      </div>
    </div>
  )
}
