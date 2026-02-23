// /channels/:guildId/:channelId — main channel view

import { Hash } from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import { useListChannels } from '@/application/channel/useListChannels'
import { useUIStore } from '@/state/uiStore'
import { useEffect } from 'react'

export default function ChannelPage() {
  const params = useParams({ strict: false }) as { guildId: string; channelId: string }
  const { data: channels } = useListChannels(params.guildId)
  const { setActiveGuild, setActiveChannel } = useUIStore()

  useEffect(() => {
    setActiveGuild(params.guildId)
    setActiveChannel(params.channelId)
  }, [params.guildId, params.channelId, setActiveGuild, setActiveChannel])

  const channel = channels?.find((c) => c.channelId === params.channelId)

  return (
    <div
      className="flex h-full flex-col"
      style={{ background: 'var(--color-content-area)' }}
    >
      {/* Channel header */}
      <div
        className="flex h-12 items-center gap-2 px-4 shadow-sm flex-shrink-0"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <Hash size={20} style={{ color: 'var(--color-text-muted)' }} />
        <h1
          className="font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {channel?.name ?? 'Loading...'}
        </h1>
        {channel?.description && (
          <>
            <div
              className="mx-2 h-4 w-px"
              style={{ background: 'var(--color-border)' }}
            />
            <span
              className="text-sm truncate"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {channel.description}
            </span>
          </>
        )}
      </div>

      {/* Message area placeholder */}
      <div className="flex flex-1 flex-col-reverse overflow-y-auto p-4">
        <div
          className="flex flex-col items-start"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <Hash size={64} className="mb-4" style={{ color: 'var(--color-text-muted)' }} />
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Welcome to #{channel?.name ?? '...'}!
          </h2>
          <p className="text-sm">
            This is the start of the #{channel?.name ?? '...'} channel.
          </p>
        </div>
      </div>

      {/* Message input */}
      <div className="flex-shrink-0 p-4">
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-3"
          style={{ background: 'var(--color-input-bg)' }}
        >
          <input
            type="text"
            placeholder={`Message #${channel?.name ?? '...'}`}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--color-text-primary)' }}
            disabled
          />
        </div>
        <p
          className="mt-1 text-xs text-center"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Real-time messaging coming soon
        </p>
      </div>
    </div>
  )
}
