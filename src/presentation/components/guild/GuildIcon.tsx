// Guild icon with tooltip — used in the far-left sidebar

import { cn } from '@/lib/cn'
import { getInitials } from '@/lib/formatters'
import type { Guild } from '@/domain/guild/entities'

interface GuildIconProps {
  guild: Guild
  isActive?: boolean
  onClick?: () => void
}

export function GuildIcon({ guild, isActive, onClick }: GuildIconProps) {
  return (
    <div className="group relative flex justify-center">
      {/* Active indicator pill */}
      <div
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all',
          isActive ? 'h-10 bg-white' : 'h-5 bg-transparent group-hover:h-5 group-hover:bg-white',
        )}
      />

      <button
        onClick={onClick}
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 overflow-hidden font-bold text-white',
          isActive ? 'rounded-2xl' : 'hover:rounded-2xl',
        )}
        style={{
          background: isActive ? 'var(--color-accent)' : 'var(--color-channel-sidebar)',
        }}
        title={guild.name}
        aria-label={guild.name}
      >
        {guild.iconUrl ? (
          <img
            src={guild.iconUrl}
            alt={guild.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm select-none">{getInitials(guild.name)}</span>
        )}
      </button>

      {/* Tooltip */}
      <div
        className="pointer-events-none absolute left-16 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded px-2 py-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        style={{
          background: 'var(--color-guild-sidebar)',
          color: 'var(--color-text-primary)',
        }}
      >
        {guild.name}
      </div>
    </div>
  )
}
