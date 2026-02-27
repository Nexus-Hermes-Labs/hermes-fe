// Three-panel Discord-like layout
// [GuildSidebar][ChannelList][Content][MemberList]

import { Outlet } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'
import { GuildSidebar } from '@/presentation/components/guild/GuildSidebar'
import { GuildChannelList } from '@/presentation/components/guild/GuildChannelList'
import { UserPanel } from '@/presentation/components/user/UserPanel'
import { MemberList } from '@/presentation/components/guild/MemberList'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { CreateGuildModal } from '@/presentation/components/guild/CreateGuildModal'
import { GuildSettingsModal } from '@/presentation/components/guild/GuildSettingsModal'
import { InviteModal } from '@/presentation/components/guild/InviteModal'
import { SearchModal } from '@/presentation/components/shared/SearchModal'
import { UserProfileModal } from '@/presentation/components/user/UserProfileModal'
import { JoinGuildModal } from '@/presentation/components/guild/JoinGuildModal'
import { CustomStatusModal } from '@/presentation/components/user/CustomStatusModal'
import { useGetMe } from '@/application/auth/useGetMe'
import { useGetMyGuilds } from '@/application/guild/useGetMyGuilds'
import { useUIStore } from '@/state/uiStore'
import { useWsStore } from '@/state/wsStore'

export function AppLayout() {
  useGetMe()       // Bootstrap: hydrate auth store from API
  useGetMyGuilds() // Bootstrap: populate guild sidebar
  const { activeGuildId, openModal } = useUIStore()
  const { connect, disconnect } = useWsStore()

  // Open WS connection when the authenticated layout mounts; close on unmount
  useEffect(() => {
    connect()
    return () => { disconnect() }
  }, [connect, disconnect])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        openModal('search')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openModal])

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

      {/* Global modals */}
      <CreateGuildModal />
      <GuildSettingsModal />
      {activeGuildId && <InviteModal guildId={activeGuildId} />}
      <SearchModal />
      <UserProfileModal />
      <JoinGuildModal />
      <CustomStatusModal />
    </div>
  )
}
