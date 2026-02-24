// Second panel: channels within a guild, organized by category

import { ChevronDown, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Hash, Volume2, Megaphone } from 'lucide-react'
import { useListChannels } from '@/application/channel/useListChannels'
import { useUIStore } from '@/state/uiStore'
import { useGuildStore } from '@/state/guildStore'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { cn } from '@/lib/cn'
import type { Channel } from '@/domain/channel/entities'

const CHANNEL_ICONS = {
  text: <Hash size={16} />,
  voice: <Volume2 size={16} />,
  announcement: <Megaphone size={16} />,
  category: null,
}

interface ChannelItemProps {
  channel: Channel
  isActive: boolean
}

function ChannelItem({ channel, isActive }: ChannelItemProps) {
  const { setActiveChannel } = useUIStore()
  const { activeGuildId } = useUIStore()

  if (!activeGuildId) return null

  return (
    <Link
      to="/channels/$guildId/$channelId"
      params={{ guildId: activeGuildId, channelId: channel.channelId }}
      onClick={() => setActiveChannel(channel.channelId)}
      className={cn(
        'flex items-center gap-2 rounded px-2 py-1 text-sm transition-colors mx-1',
        isActive && 'font-medium',
      )}
      style={{
        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        background: isActive ? 'var(--color-hover)' : '',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--color-hover)'
          e.currentTarget.style.color = 'var(--color-text-primary)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = ''
          e.currentTarget.style.color = 'var(--color-text-secondary)'
        }
      }}
    >
      <span className="flex-shrink-0">
        {CHANNEL_ICONS[channel.channelType] ?? <Hash size={16} />}
      </span>
      <span className="truncate">{channel.name}</span>
    </Link>
  )
}

export function GuildChannelList() {
  const { activeGuildId, activeChannelId } = useUIStore()
  const { getGuild } = useGuildStore()
  const { data: channels, isLoading } = useListChannels(activeGuildId)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  const guild = activeGuildId ? getGuild(activeGuildId) : null

  if (!activeGuildId) {
    return (
      <div className="px-3 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide"
           style={{ color: 'var(--color-text-secondary)' }}>
          Direct Messages
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <LoadingSpinner size="sm" />
      </div>
    )
  }

  const categories = channels?.filter((c) => c.channelType === 'category') ?? []
  const uncategorized = channels?.filter((c) => c.channelType !== 'category' && !c.parentId) ?? []
  const childrenOf = (parentId: string) =>
    channels?.filter((c) => c.parentId === parentId && c.channelType !== 'category') ?? []

  const toggleCategory = (id: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      {/* Guild name header */}
      <div
        className="flex h-12 items-center px-4 cursor-pointer shadow-sm"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <h2
          className="flex-1 font-semibold truncate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {guild?.name ?? 'Unknown Guild'}
        </h2>
        <ChevronDown size={16} style={{ color: 'var(--color-text-secondary)' }} />
      </div>

      {/* Channels */}
      <div className="py-2 space-y-0.5">
        {/* Uncategorized channels */}
        {uncategorized.map((ch) => (
          <ChannelItem key={ch.channelId} channel={ch} isActive={activeChannelId === ch.channelId} />
        ))}

        {/* Categories + their children */}
        {categories.map((cat) => {
          const isCollapsed = collapsedCategories.has(cat.channelId)
          const children = childrenOf(cat.channelId)

          return (
            <div key={cat.channelId}>
              <button
                onClick={() => toggleCategory(cat.channelId)}
                className="flex w-full items-center gap-1 px-1 py-1 mt-2 group"
              >
                <ChevronDown
                  size={12}
                  className={cn('transition-transform', isCollapsed && '-rotate-90')}
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <span
                  className="flex-1 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {cat.name}
                </span>
                <Plus
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--color-text-muted)' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    useUIStore.getState().openModal('createChannel', { parentId: cat.channelId })
                  }}
                />
              </button>

              {!isCollapsed &&
                children.map((ch) => (
                  <ChannelItem
                    key={ch.channelId}
                    channel={ch}
                    isActive={activeChannelId === ch.channelId}
                  />
                ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
