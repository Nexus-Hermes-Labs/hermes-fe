// Far-left guild icon bar — mirrors Discord's server list

import { Plus, MessageSquare } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { GuildIcon } from './GuildIcon'
import { useGuildStore } from '@/state/guildStore'
import { useUIStore } from '@/state/uiStore'
import { cn } from '@/lib/cn'

export function GuildSidebar() {
  const { getOrderedGuilds } = useGuildStore()
  const { activeGuildId, setActiveGuild } = useUIStore()
  const navigate = useNavigate()
  const guilds = getOrderedGuilds()

  const handleGuildClick = (guildId: string) => {
    setActiveGuild(guildId)
    void navigate({ to: `/channels/${guildId}/@me` })
  }

  return (
    <div
      className="flex w-[72px] flex-shrink-0 flex-col items-center gap-2 overflow-y-auto py-3"
      style={{ background: 'var(--color-guild-sidebar)' }}
    >
      {/* DM button */}
      <Link
        to="/channels/@me"
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:rounded-2xl',
        )}
        style={{ background: 'var(--color-channel-sidebar)', color: 'var(--color-accent)' }}
        title="Direct Messages"
        aria-label="Direct Messages"
        activeProps={{ style: { borderRadius: '1rem', background: 'var(--color-accent)', color: '#fff' } }}
      >
        <MessageSquare size={24} />
      </Link>

      {/* Separator */}
      <div
        className="h-px w-8 rounded-full"
        style={{ background: 'var(--color-border)' }}
      />

      {/* Guild list */}
      {guilds.map((guild) => (
        <GuildIcon
          key={guild.guildId}
          guild={guild}
          isActive={activeGuildId === guild.guildId}
          onClick={() => handleGuildClick(guild.guildId)}
        />
      ))}

      {/* Separator before add button */}
      {guilds.length > 0 && (
        <div
          className="h-px w-8 rounded-full"
          style={{ background: 'var(--color-border)' }}
        />
      )}

      {/* Add guild button */}
      <button
        onClick={() => useUIStore.getState().openModal('createGuild')}
        className="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:rounded-2xl"
        style={{
          background: 'var(--color-channel-sidebar)',
          color: 'var(--color-success)',
        }}
        title="Add a Server"
        aria-label="Add a Server"
      >
        <Plus size={24} />
      </button>
    </div>
  )
}
