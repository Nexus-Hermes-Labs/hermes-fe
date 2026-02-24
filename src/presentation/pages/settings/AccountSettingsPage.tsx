// Account settings page — username change + logout

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetMe } from '@/application/auth/useGetMe'
import { useLogout } from '@/application/auth/useLogout'
import { useUpdateUsername } from '@/application/user/useUpdateUsername'
import { UpdateUsernameSchema, type UpdateUsernameData } from '@/presentation/dto/user.dto'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { toast } from 'sonner'

export default function AccountSettingsPage() {
  const { data: user } = useGetMe()
  const logout = useLogout()
  const updateUsername = useUpdateUsername()
  const [showUsernameForm, setShowUsernameForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUsernameData>({
    resolver: zodResolver(UpdateUsernameSchema),
  })

  const onSubmitUsername = (data: UpdateUsernameData) => {
    updateUsername.mutate(data.username, {
      onSuccess: () => {
        toast.success('Username updated!')
        reset()
        setShowUsernameForm(false)
      },
      onError: () => toast.error('Failed to update username. Check your password and try again.'),
    })
  }

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
          <div className="flex items-center justify-between">
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
            <button
              onClick={() => setShowUsernameForm((v) => !v)}
              className="rounded px-3 py-1.5 text-xs font-semibold"
              style={{ background: 'var(--color-hover)', color: 'var(--color-text-primary)' }}
            >
              {showUsernameForm ? 'Cancel' : 'Change'}
            </button>
          </div>

          {showUsernameForm && (
            <form onSubmit={handleSubmit(onSubmitUsername)} noValidate className="space-y-3 pt-2">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  New Username
                </label>
                <input
                  type="text"
                  placeholder="new_username"
                  className="w-full rounded px-3 py-2 text-sm outline-none"
                  style={{
                    background: 'var(--color-input-bg)',
                    color: 'var(--color-text-primary)',
                    border: errors.username ? '1px solid var(--color-danger)' : '1px solid transparent',
                  }}
                  {...register('username')}
                />
                {errors.username && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Required to change username"
                  className="w-full rounded px-3 py-2 text-sm outline-none"
                  style={{
                    background: 'var(--color-input-bg)',
                    color: 'var(--color-text-primary)',
                    border: errors.current_password ? '1px solid var(--color-danger)' : '1px solid transparent',
                  }}
                  {...register('current_password')}
                />
                {errors.current_password && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
                    {errors.current_password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={updateUsername.isPending}
                className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: 'var(--color-accent)' }}
              >
                {updateUsername.isPending ? <LoadingSpinner size="sm" /> : 'Save Username'}
              </button>
            </form>
          )}
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
