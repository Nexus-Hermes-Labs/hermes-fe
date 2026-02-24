// View any user's profile — opened by clicking on a user in FriendsList / MemberList

import { X, Edit } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useUIStore } from '@/state/uiStore'
import { useAuthStore } from '@/state/authStore'
import { useGetUser } from '@/application/user/useGetUser'
import { UserAvatar } from '@/presentation/components/user/UserAvatar'
import { UserStatusBadge } from '@/presentation/components/user/UserStatusBadge'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { formatDate } from '@/lib/formatters'
import type { UserStatus } from '@/domain/user/valueObjects'

export function UserProfileModal() {
  const { isModalOpen, closeModal, getModalData } = useUIStore()
  const { user: me } = useAuthStore()
  const navigate = useNavigate()

  const isOpen = isModalOpen('userProfile')
  const userId = getModalData<string>('userProfile')

  const isOwnProfile = !!userId && userId === me?.userId
  // Only fetch if it's a different user; use auth store data for own profile
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

            {/* Avatar overlapping banner */}
            <div className="px-4 pb-4">
              <div className="flex items-end justify-between -mt-10 mb-3">
                <UserAvatar
                  displayName={user.displayName}
                  avatarUrl={user.avatarUrl}
                  status={user.status as UserStatus}
                  showStatus
                  size="lg"
                  className="ring-4"
                />
                {isOwnProfile && (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold text-white"
                    style={{ background: 'var(--color-accent)' }}
                  >
                    <Edit size={12} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Name + status */}
              <p
                className="text-xl font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
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
                  style={{
                    background: 'var(--color-input-bg)',
                    color: 'var(--color-text-primary)',
                  }}
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

              {/* Member since */}
              <p
                className="mt-3 text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
