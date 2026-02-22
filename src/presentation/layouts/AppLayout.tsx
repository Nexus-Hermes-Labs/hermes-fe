// Three-panel Discord-like layout
// [GuildSidebar][ChannelList][Content][MemberList]

import { Outlet } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'
import { GuildSidebar } from '@/presentation/components/guild/GuildSidebar'
import { GuildChannelList } from '@/presentation/components/guild/GuildChannelList'
import { UserPanel } from '@/presentation/components/user/UserPanel'
import { MemberList } from '@/presentation/components/guild/MemberList'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { useGetMe } from '@/application/auth/useGetMe'
import { useUIStore } from '@/state/uiStore'

export function AppLayout() {
  useGetMe() // Bootstrap: hydrate auth store from API
  const { activeGuildId } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-content-area)' }}>
      {/* Far-left guild icon bar */}
      <GuildSidebar />

      {/* Second panel: channel list + user panel */}
      <div
        className="flex w-60 flex-shrink-0 flex-col"
        style={{ background: 'var(--color-channel-sidebar)' }}
      >
        <div className="flex-1 overflow-y-auto">
          <GuildChannelList />
        </div>
        <UserPanel />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-hidden">
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            <Outlet />
          </Suspense>
        </main>

        {/* Right panel: member list (only when in a guild) */}
        {activeGuildId && (
          <div
            className="w-60 flex-shrink-0 overflow-y-auto"
            style={{ background: 'var(--color-channel-sidebar)' }}
          >
            <MemberList guildId={activeGuildId} />
          </div>
        )}
      </div>
    </div>
  )
}
