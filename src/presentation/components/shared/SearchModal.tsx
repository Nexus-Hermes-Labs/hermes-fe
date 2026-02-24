// Global search modal — users + guilds
// Opens via Ctrl+K or search button in GuildSidebar

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Search, Users, Hash } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useUIStore } from '@/state/uiStore'
import { useSearchUsers } from '@/application/user/useSearchUsers'
import { useSearchGuilds } from '@/application/guild/useSearchGuilds'
import { useGuildStore } from '@/state/guildStore'
import { UserAvatar } from '@/presentation/components/user/UserAvatar'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { formatMemberCount } from '@/lib/formatters'
import type { UserStatus } from '@/domain/user/valueObjects'

export function SearchModal() {
  const { isModalOpen, closeModal, openModal } = useUIStore()
  const { getOrderedGuilds } = useGuildStore()
  const navigate = useNavigate()
  const isOpen = isModalOpen('search')

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setDebouncedQuery('')
      setHighlightedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const { data: userResults, isFetching: usersLoading } = useSearchUsers(debouncedQuery)
  const { data: guildResults, isFetching: guildsLoading } = useSearchGuilds(
    debouncedQuery.length >= 2 ? { query: debouncedQuery, limit: 20, offset: 0 } : null,
  )

  const memberGuildIds = new Set(getOrderedGuilds().map((g) => g.guildId))
  const isLoading = usersLoading || guildsLoading
  const hasResults = (userResults?.length ?? 0) > 0 || (guildResults?.guilds?.length ?? 0) > 0

  const handleClose = useCallback(() => {
    closeModal('search')
  }, [closeModal])

  const handleUserClick = (userId: string) => {
    openModal('userProfile', userId)
    handleClose()
  }

  const handleGuildClick = (guildId: string) => {
    if (memberGuildIds.has(guildId)) {
      void navigate({ to: `/channels/${guildId}/@me` })
      handleClose()
    } else {
      openModal('joinGuild', null)
      handleClose()
    }
  }

  const allItems: Array<{ type: 'user' | 'guild'; id: string }> = [
    ...(userResults ?? []).map((u) => ({ type: 'user' as const, id: u.userId })),
    ...(guildResults?.guilds ?? []).map((g) => ({ type: 'guild' as const, id: g.guildId })),
  ]

  useEffect(() => {
    setHighlightedIndex(0)
  }, [debouncedQuery])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((i) => Math.min(i + 1, allItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && allItems[highlightedIndex]) {
      const item = allItems[highlightedIndex]
      if (item.type === 'user') handleUserClick(item.id)
      else handleGuildClick(item.id)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="relative w-full max-w-lg rounded-lg shadow-2xl overflow-hidden"
        style={{ background: 'var(--color-channel-sidebar)' }}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <Search size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users or servers..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--color-text-primary)' }}
          />
          {isLoading && <LoadingSpinner size="sm" />}
          <button
            onClick={handleClose}
            className="rounded p-1 transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {debouncedQuery.length < 2 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Search size={32} style={{ color: 'var(--color-text-muted)', opacity: 0.5 }} />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Type at least 2 characters to search
              </p>
            </div>
          ) : !isLoading && !hasResults ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                No results for &ldquo;{debouncedQuery}&rdquo;
              </p>
            </div>
          ) : (
            <>
              {/* User results */}
              {(userResults?.length ?? 0) > 0 && (
                <div className="px-2 py-2">
                  <p
                    className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <Users size={12} className="inline mr-1" />
                    Users
                  </p>
                  {userResults!.map((user, idx) => {
                    const itemIdx = idx
                    return (
                      <button
                        key={user.userId}
                        onClick={() => handleUserClick(user.userId)}
                        className="flex w-full items-center gap-3 rounded px-2 py-2 text-left transition-colors"
                        style={{
                          background: highlightedIndex === itemIdx ? 'var(--color-hover)' : '',
                          color: 'var(--color-text-primary)',
                        }}
                        onMouseEnter={() => setHighlightedIndex(itemIdx)}
                      >
                        <UserAvatar
                          displayName={user.displayName}
                          avatarUrl={user.avatarUrl}
                          status={user.status as UserStatus}
                          showStatus
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.displayName}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                            @{user.username}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Guild results */}
              {(guildResults?.guilds?.length ?? 0) > 0 && (
                <div className="px-2 py-2">
                  <p
                    className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <Hash size={12} className="inline mr-1" />
                    Servers
                  </p>
                  {guildResults!.guilds.map((guild, idx) => {
                    const itemIdx = (userResults?.length ?? 0) + idx
                    const isMember = memberGuildIds.has(guild.guildId)
                    return (
                      <button
                        key={guild.guildId}
                        onClick={() => handleGuildClick(guild.guildId)}
                        className="flex w-full items-center gap-3 rounded px-2 py-2 text-left transition-colors"
                        style={{
                          background: highlightedIndex === itemIdx ? 'var(--color-hover)' : '',
                          color: 'var(--color-text-primary)',
                        }}
                        onMouseEnter={() => setHighlightedIndex(itemIdx)}
                      >
                        {guild.iconUrl ? (
                          <img
                            src={guild.iconUrl}
                            alt={guild.name}
                            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ background: 'var(--color-accent)' }}
                          >
                            {guild.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{guild.name}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                            {formatMemberCount(guild.memberCount)} members · {guild.visibility}
                          </p>
                        </div>
                        {isMember && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--color-accent)', color: '#fff', flexShrink: 0 }}
                          >
                            Joined
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
