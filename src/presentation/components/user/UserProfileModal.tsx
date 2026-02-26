// View any user's profile — opened by clicking a user in FriendsList / MemberList / SearchModal

import { X, Edit, UserPlus, UserX, Ban, CheckCircle2, XCircle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useUIStore } from '@/state/uiStore'
import { useAuthStore } from '@/state/authStore'
import { useGetUser } from '@/application/user/useGetUser'
import { useGetRelationship } from '@/application/user/useGetRelationship'
import { useSendFriendRequest } from '@/application/user/useSendFriendRequest'
import { useAcceptFriendRequest } from '@/application/user/useAcceptFriendRequest'
import { useDeclineFriendRequest } from '@/application/user/useDeclineFriendRequest'
import { useRemoveFriend } from '@/application/user/useRemoveFriend'
import { useBlockUser } from '@/application/user/useBlockUser'
import { useUnblockUser } from '@/application/user/useUnblockUser'
import { UserAvatar } from '@/presentation/components/user/UserAvatar'
import { UserStatusBadge } from '@/presentation/components/user/UserStatusBadge'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { formatDate } from '@/lib/formatters'
import type { UserStatus } from '@/domain/user/valueObjects'

// ── Relationship action buttons ───────────────────────────────────────────────

function RelationshipActions({ targetUserId }: { targetUserId: string }) {
  const { data: rel, isLoading } = useGetRelationship(targetUserId)
  const sendRequest = useSendFriendRequest()
  const accept = useAcceptFriendRequest()
  const decline = useDeclineFriendRequest()
  const removeFriend = useRemoveFriend()
  const blockUser = useBlockUser()
  const unblock = useUnblockUser()

  if (isLoading) return <LoadingSpinner size="sm" />

  const type = rel?.relationshipType

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* No relationship → send friend request */}
      {!type && (
        <ActionBtn
          onClick={() =>
            sendRequest.mutate(targetUserId, {
              onSuccess: () => toast.success('Friend request sent!'),
              onError: () => toast.error('Could not send request'),
            })
          }
          pending={sendRequest.isPending}
          icon={<UserPlus size={14} />}
          label="Add Friend"
          variant="primary"
        />
      )}

      {/* Incoming pending → accept + decline */}
      {type === 'pending_incoming' && (
        <>
          <ActionBtn
            onClick={() =>
              accept.mutate(targetUserId, {
                onSuccess: () => toast.success('Friend request accepted!'),
                onError: () => toast.error('Could not accept request'),
              })
            }
            pending={accept.isPending}
            icon={<CheckCircle2 size={14} />}
            label="Accept"
            variant="success"
          />
          <ActionBtn
            onClick={() =>
              decline.mutate(targetUserId, {
                onSuccess: () => toast.success('Request declined'),
                onError: () => toast.error('Could not decline request'),
              })
            }
            pending={decline.isPending}
            icon={<XCircle size={14} />}
            label="Decline"
            variant="danger"
          />
        </>
      )}

      {/* Outgoing pending → cancel */}
      {type === 'pending_outgoing' && (
        <ActionBtn
          onClick={() =>
            decline.mutate(targetUserId, {
              onSuccess: () => toast.success('Request cancelled'),
              onError: () => toast.error('Could not cancel'),
            })
          }
          pending={decline.isPending}
          icon={<XCircle size={14} />}
          label="Cancel Request"
          variant="secondary"
        />
      )}

      {/* Friend → remove */}
      {type === 'friend' && (
        <ActionBtn
          onClick={() =>
            removeFriend.mutate(targetUserId, {
              onSuccess: () => toast.success('Friend removed'),
              onError: () => toast.error('Could not remove friend'),
            })
          }
          pending={removeFriend.isPending}
          icon={<UserX size={14} />}
          label="Remove Friend"
          variant="danger"
        />
      )}

      {/* Blocked → unblock */}
      {type === 'blocked' && (
        <ActionBtn
          onClick={() =>
            unblock.mutate(targetUserId, {
              onSuccess: () => toast.success('User unblocked'),
              onError: () => toast.error('Could not unblock'),
            })
          }
          pending={unblock.isPending}
          icon={<Ban size={14} />}
          label="Unblock"
          variant="secondary"
        />
      )}

      {/* Block (always shown when not already blocked) */}
      {type !== 'blocked' && (
        <ActionBtn
          onClick={() =>
            blockUser.mutate(targetUserId, {
              onSuccess: () => toast.success('User blocked'),
              onError: () => toast.error('Could not block user'),
            })
          }
          pending={blockUser.isPending}
          icon={<Ban size={14} />}
          label="Block"
          variant="danger"
        />
      )}
    </div>
  )
}

function ActionBtn({
  onClick,
  pending,
  icon,
  label,
  variant,
}: {
  onClick: () => void
  pending: boolean
  icon: React.ReactNode
  label: string
  variant: 'primary' | 'secondary' | 'danger' | 'success'
}) {
  const bg = {
    primary: 'var(--color-accent)',
    secondary: 'var(--color-hover)',
    danger: 'rgba(237,66,69,0.15)',
    success: 'rgba(67,181,129,0.15)',
  }[variant]

  const color = {
    primary: '#fff',
    secondary: 'var(--color-text-primary)',
    danger: 'var(--color-danger)',
    success: 'var(--color-success)',
  }[variant]

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-opacity disabled:opacity-50"
      style={{ background: bg, color }}
    >
      {pending ? <LoadingSpinner size="sm" /> : icon}
      {label}
    </button>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export function UserProfileModal() {
  const { isModalOpen, closeModal, getModalData } = useUIStore()
  const { user: me } = useAuthStore()
  const navigate = useNavigate()

  const isOpen = isModalOpen('userProfile')
  const userId = getModalData<string>('userProfile')

  const isOwnProfile = !!userId && userId === me?.userId
  const { data: fetchedUser, isLoading } = useGetUser(
    !isOwnProfile && !!userId ? userId : '',
  )

  const user = isOwnProfile ? me : fetchedUser

  const handleClose = () => closeModal('userProfile')

  const handleEditProfile = () => {
    void navigate({ to: '/settings/profile' })
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="relative w-full max-w-md rounded-lg shadow-2xl overflow-hidden"
        style={{ background: 'var(--color-channel-sidebar)' }}
      >
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded p-1 transition-colors"
          style={{ color: 'var(--color-text-secondary)', background: 'rgba(0,0,0,0.4)' }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {isLoading && !user ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : !user ? (
          <div className="flex justify-center p-12">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              User not found.
            </p>
          </div>
        ) : (
          <>
            {/* Banner */}
            <div
              className="h-20"
              style={{
                background: user.bannerUrl
                  ? `url(${user.bannerUrl}) center/cover no-repeat`
                  : 'linear-gradient(135deg, var(--color-accent), var(--color-guild-sidebar))',
              }}
            />

            {/* Body */}
            <div className="px-4 pb-4">
              {/* Avatar + actions row */}
              <div className="flex items-end justify-between -mt-10 mb-3">
                <UserAvatar
                  displayName={user.displayName}
                  avatarUrl={user.avatarUrl}
                  status={user.status as UserStatus}
                  showStatus
                  size="lg"
                  className="ring-4"
                />
                {isOwnProfile ? (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold text-white"
                    style={{ background: 'var(--color-accent)' }}
                  >
                    <Edit size={12} />
                    Edit Profile
                  </button>
                ) : null}
              </div>

              {/* Name + status */}
              <p className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {user.displayName}
              </p>
              <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                @{user.username}
              </p>
              <UserStatusBadge status={user.status as UserStatus} showLabel />

              {/* Custom status */}
              {user.customStatus && (user.customStatus.text ?? user.customStatus.emoji) && (
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {user.customStatus.emoji && (
                    <span className="mr-1">{user.customStatus.emoji}</span>
                  )}
                  {user.customStatus.text}
                </p>
              )}

              {/* Bio */}
              {user.bio && (
                <div
                  className="mt-3 rounded p-3 text-sm"
                  style={{ background: 'var(--color-input-bg)', color: 'var(--color-text-primary)' }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    About Me
                  </p>
                  <p className="whitespace-pre-wrap break-words">{user.bio}</p>
                </div>
              )}

              {/* Relationship actions (only for other users) */}
              {!isOwnProfile && userId && (
                <div className="mt-4">
                  <RelationshipActions targetUserId={userId} />
                </div>
              )}

              {/* Member since */}
              <p className="mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
