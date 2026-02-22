// Account settings page — username + logout

import { useGetMe } from '@/application/auth/useGetMe'
import { useLogout } from '@/application/auth/useLogout'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

export default function AccountSettingsPage() {
  const { data: user } = useGetMe()
  const logout = useLogout()

  if (!user) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-bold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        My Account
      </h1>

      {/* Account info card */}
      <div
        className="rounded-lg p-4 mb-6"
        style={{ background: 'var(--color-surface-raised)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Account Information
          </h2>
        </div>

        <div className="space-y-3">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-0.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Username
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              @{user.username}
            </p>
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-0.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Email
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div
        className="rounded-lg p-4"
        style={{
          background: 'var(--color-surface-raised)',
          border: '1px solid var(--color-danger)',
        }}
      >
        <h2
          className="mb-3 text-sm font-semibold uppercase tracking-wide"
          style={{ color: 'var(--color-danger)' }}
        >
          Danger Zone
        </h2>
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-white"
          style={{ background: 'var(--color-danger)' }}
        >
          {logout.isPending ? <LoadingSpinner size="sm" /> : 'Log Out'}
        </button>
      </div>
    </div>
  )
}
