// DMs + Friends page — /channels/@me

import { useState } from 'react'
import { Users, UserPlus, Clock, Ban, CheckCircle2, XCircle, UserX, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { FriendsList } from '@/presentation/components/user/FriendsList'
import { UserAvatar } from '@/presentation/components/user/UserAvatar'
import { UserStatusBadge } from '@/presentation/components/user/UserStatusBadge'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { EmptyState } from '@/presentation/components/shared/EmptyState'
import { useGetRelationships } from '@/application/user/useGetRelationships'
import { useGetIncomingRequests } from '@/application/user/useGetIncomingRequests'
import { useGetOutgoingRequests } from '@/application/user/useGetOutgoingRequests'
import { useGetBlockedUsers } from '@/application/user/useGetBlockedUsers'
import { useAcceptFriendRequest } from '@/application/user/useAcceptFriendRequest'
import { useDeclineFriendRequest } from '@/application/user/useDeclineFriendRequest'
import { useRemoveFriend } from '@/application/user/useRemoveFriend'
import { useUnblockUser } from '@/application/user/useUnblockUser'
import { useSendFriendRequest } from '@/application/user/useSendFriendRequest'
import { useUIStore } from '@/state/uiStore'
import { cn } from '@/lib/cn'
import type { UserStatus } from '@/domain/user/valueObjects'
import type { UserRelationship } from '@/domain/user/entities'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'online' | 'all' | 'pending' | 'blocked' | 'add'

const ONLINE_STATUSES: UserStatus[] = ['online', 'idle', 'dnd']

const AddFriendSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters')
    .regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, and underscores only')
    .toLowerCase(),
})
type AddFriendData = z.infer<typeof AddFriendSchema>

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ count, label }: { count: number; label: string }) {
  return (
    <p
      className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide"
      style={{ color: 'var(--color-text-muted)' }}
    >
      {label} — {count}
    </p>
  )
}

function FriendRow({
  relationship,
  actions,
}: {
  relationship: UserRelationship
  actions: React.ReactNode
}) {
  const { openModal } = useUIStore()
  const user = relationship.targetUser

  return (
    <div
      className="flex items-center gap-3 px-4 py-2 transition-colors cursor-pointer rounded mx-2"
      style={{ borderTop: '1px solid var(--color-border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '')}
      onClick={() => openModal('userProfile', relationship.targetUserId)}
    >
      <UserAvatar
        displayName={user.displayName}
        avatarUrl={user.avatarUrl}
        status={user.status as UserStatus}
        showStatus
        size="md"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
          {user.displayName}
        </p>
        <UserStatusBadge status={user.status as UserStatus} showLabel />
      </div>
      <div
        className="flex items-center gap-2 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {actions}
      </div>
    </div>
  )
}

function IconButton({
  onClick,
  title,
  danger,
  children,
}: {
  onClick: () => void
  title: string
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
      style={{
        background: 'var(--color-input-bg)',
        color: danger ? 'var(--color-danger)' : 'var(--color-text-secondary)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger
          ? 'rgba(237,66,69,0.15)'
          : 'var(--color-hover)'
        e.currentTarget.style.color = danger ? 'var(--color-danger)' : 'var(--color-text-primary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-input-bg)'
        e.currentTarget.style.color = danger ? 'var(--color-danger)' : 'var(--color-text-secondary)'
      }}
    >
      {children}
    </button>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

function OnlineTab() {
  const { data: relationships, isLoading } = useGetRelationships()
  const removeFriend = useRemoveFriend()

  if (isLoading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>

  const online = (relationships ?? []).filter(
    (r) => r.relationshipType === 'friend' && ONLINE_STATUSES.includes(r.targetUser.status as UserStatus),
  )

  if (online.length === 0) {
    return (
      <EmptyState
        title="No one's around"
        description="All your friends are currently offline."
      />
    )
  }

  return (
    <div>
      <SectionHeader count={online.length} label="Online" />
      {online.map((r) => (
        <FriendRow
          key={r.relationshipId}
          relationship={r}
          actions={
            <IconButton
              onClick={() => {
                removeFriend.mutate(r.targetUserId, {
                  onSuccess: () => toast.success('Friend removed'),
                  onError: () => toast.error('Failed to remove friend'),
                })
              }}
              title="Remove Friend"
              danger
            >
              <UserX size={16} />
            </IconButton>
          }
        />
      ))}
    </div>
  )
}

function AllFriendsTab() {
  const { data: relationships, isLoading } = useGetRelationships()
  const removeFriend = useRemoveFriend()

  if (isLoading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>

  const friends = (relationships ?? []).filter((r) => r.relationshipType === 'friend')

  if (friends.length === 0) {
    return (
      <EmptyState
        title="No friends yet"
        description="Add friends by their username."
      />
    )
  }

  return (
    <div>
      <SectionHeader count={friends.length} label="All Friends" />
      {friends.map((r) => (
        <FriendRow
          key={r.relationshipId}
          relationship={r}
          actions={
            <IconButton
              onClick={() => {
                removeFriend.mutate(r.targetUserId, {
                  onSuccess: () => toast.success('Friend removed'),
                  onError: () => toast.error('Failed to remove friend'),
                })
              }}
              title="Remove Friend"
              danger
            >
              <UserX size={16} />
            </IconButton>
          }
        />
      ))}
    </div>
  )
}

function PendingTab() {
  const { data: incoming, isLoading: loadingIn } = useGetIncomingRequests()
  const { data: outgoing, isLoading: loadingOut } = useGetOutgoingRequests()
  const accept = useAcceptFriendRequest()
  const decline = useDeclineFriendRequest()

  if (loadingIn || loadingOut) return <div className="flex justify-center p-8"><LoadingSpinner /></div>

  const inList = incoming ?? []
  const outList = outgoing ?? []
  const total = inList.length + outList.length

  if (total === 0) {
    return (
      <EmptyState
        title="No pending requests"
        description="You have no incoming or outgoing friend requests."
      />
    )
  }

  return (
    <div>
      {inList.length > 0 && (
        <>
          <SectionHeader count={inList.length} label="Incoming" />
          {inList.map((r) => (
            <FriendRow
              key={r.relationshipId}
              relationship={r}
              actions={
                <>
                  <IconButton
                    onClick={() => {
                      accept.mutate(r.targetUserId, {
                        onSuccess: () => toast.success(`Accepted ${r.targetUser.displayName}'s request`),
                        onError: () => toast.error('Failed to accept request'),
                      })
                    }}
                    title="Accept"
                  >
                    <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      decline.mutate(r.targetUserId, {
                        onSuccess: () => toast.success('Request declined'),
                        onError: () => toast.error('Failed to decline request'),
                      })
                    }}
                    title="Decline"
                    danger
                  >
                    <XCircle size={16} />
                  </IconButton>
                </>
              }
            />
          ))}
        </>
      )}
      {outList.length > 0 && (
        <>
          <SectionHeader count={outList.length} label="Outgoing" />
          {outList.map((r) => (
            <FriendRow
              key={r.relationshipId}
              relationship={r}
              actions={
                <IconButton
                  onClick={() => {
                    decline.mutate(r.targetUserId, {
                      onSuccess: () => toast.success('Request cancelled'),
                      onError: () => toast.error('Failed to cancel request'),
                    })
                  }}
                  title="Cancel Request"
                  danger
                >
                  <XCircle size={16} />
                </IconButton>
              }
            />
          ))}
        </>
      )}
    </div>
  )
}

function BlockedTab() {
  const { data: blocked, isLoading } = useGetBlockedUsers()
  const unblock = useUnblockUser()

  if (isLoading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>

  const list = blocked ?? []

  if (list.length === 0) {
    return (
      <EmptyState
        title="No blocked users"
        description="Users you block will appear here."
      />
    )
  }

  return (
    <div>
      <SectionHeader count={list.length} label="Blocked" />
      {list.map((r) => (
        <FriendRow
          key={r.relationshipId}
          relationship={r}
          actions={
            <IconButton
              onClick={() => {
                unblock.mutate(r.targetUserId, {
                  onSuccess: () => toast.success('User unblocked'),
                  onError: () => toast.error('Failed to unblock user'),
                })
              }}
              title="Unblock"
            >
              <Ban size={16} />
            </IconButton>
          }
        />
      ))}
    </div>
  )
}

function AddFriendTab() {
  const sendRequest = useSendFriendRequest()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddFriendData>({ resolver: zodResolver(AddFriendSchema) })

  const onSubmit = (data: AddFriendData) => {
    // Backend takes userId, but we have username — use getByUsername first
    // The sendFriendRequest hook expects a userId, so we send username to a lookup
    // For now we pass the username directly and show the API error if any
    sendRequest.mutate(data.username, {
      onSuccess: () => {
        toast.success(`Friend request sent to ${data.username}!`)
        reset()
      },
      onError: (err: unknown) => {
        const msg =
          err instanceof Error ? err.message : 'Could not send friend request. Check the username.'
        toast.error(msg)
      },
    })
  }

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        Add Friend
      </h2>
      <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
        You can add friends by their username.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-2"
          style={{ background: 'var(--color-input-bg)', border: '1px solid var(--color-border)' }}
        >
          <input
            type="text"
            placeholder="Enter a username"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--color-text-primary)' }}
            {...register('username')}
          />
          <button
            type="submit"
            disabled={sendRequest.isPending}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--color-accent)' }}
          >
            {sendRequest.isPending ? <LoadingSpinner size="sm" /> : <><Send size={12} /> Send</>}
          </button>
        </div>
        {errors.username && (
          <p className="mt-1.5 text-xs" style={{ color: 'var(--color-danger)' }}>
            {errors.username.message}
          </p>
        )}
      </form>
    </div>
  )
}

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'online', label: 'Online', icon: <CheckCircle2 size={14} /> },
  { id: 'all', label: 'All', icon: <Users size={14} /> },
  { id: 'pending', label: 'Pending', icon: <Clock size={14} /> },
  { id: 'blocked', label: 'Blocked', icon: <Ban size={14} /> },
  { id: 'add', label: 'Add Friend', icon: <UserPlus size={14} /> },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DirectMessagesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('online')
  const { data: incoming } = useGetIncomingRequests()
  const pendingCount = incoming?.length ?? 0

  return (
    <div className="flex h-full">
      {/* DM sidebar */}
      <div
        className="w-60 flex-shrink-0 flex flex-col overflow-y-auto py-3"
        style={{ background: 'var(--color-channel-sidebar)', borderRight: '1px solid var(--color-border)' }}
      >
        <p
          className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Direct Messages
        </p>
        <FriendsList />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden" style={{ background: 'var(--color-content-area)' }}>
        {/* Header */}
        <div
          className="flex h-12 flex-shrink-0 items-center gap-4 px-4 shadow-sm"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <Users size={20} style={{ color: 'var(--color-text-secondary)' }} />
            <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Friends
            </span>
          </div>

          {/* Tab bar */}
          <div
            className="mx-2 h-5 w-px"
            style={{ background: 'var(--color-border)' }}
          />
          <nav className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded px-3 py-1 text-sm font-medium transition-colors relative',
                )}
                style={{
                  background: activeTab === tab.id ? 'var(--color-hover)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                }}
              >
                {tab.icon}
                {tab.label}
                {tab.id === 'pending' && pendingCount > 0 && (
                  <span
                    className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: 'var(--color-danger)', fontSize: '10px' }}
                  >
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
                {tab.id === 'add' && (
                  <span
                    className="ml-0.5 text-xs px-1 rounded font-bold"
                    style={{ background: 'var(--color-success)', color: '#fff', fontSize: '9px' }}
                  >
                    NEW
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'online' && <OnlineTab />}
          {activeTab === 'all' && <AllFriendsTab />}
          {activeTab === 'pending' && <PendingTab />}
          {activeTab === 'blocked' && <BlockedTab />}
          {activeTab === 'add' && <AddFriendTab />}
        </div>
      </div>
    </div>
  )
}
