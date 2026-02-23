// Profile settings page — display name, bio, avatar

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateProfileSchema, type UpdateProfileData } from '@/presentation/dto/user.dto'
import { useUpdateMe } from '@/application/user/useUpdateMe'
import { useGetMe } from '@/application/auth/useGetMe'
import { UserAvatar } from '@/presentation/components/user/UserAvatar'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { toast } from 'sonner'

export default function ProfileSettingsPage() {
  const { data: user } = useGetMe()
  const updateMe = useUpdateMe()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(UpdateProfileSchema),
    values: {
      display_name: user?.displayName,
      bio: user?.bio ?? undefined,
      avatar_url: user?.avatarUrl ?? undefined,
    },
  })

  const onSubmit = (data: UpdateProfileData) => {
    updateMe.mutate(data, {
      onSuccess: () => toast.success('Profile updated!'),
      onError: () => toast.error('Failed to update profile.'),
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
        Profile
      </h1>

      <div
        className="mb-6 rounded-lg overflow-hidden"
        style={{ background: 'var(--color-surface-raised)' }}
      >
        {/* Banner */}
        <div
          className="h-24"
          style={{ background: 'var(--color-accent)' }}
        />
        <div className="px-4 pb-4">
          <div className="-mt-8 mb-3">
            <UserAvatar
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              size="lg"
              showStatus={false}
            />
          </div>
          <p
            className="text-xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {user.displayName}
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            @{user.username}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Display Name
          </label>
          <input
            type="text"
            className="w-full rounded px-3 py-2 text-sm outline-none"
            style={{
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              border: errors.display_name ? '1px solid var(--color-danger)' : '1px solid transparent',
            }}
            {...register('display_name')}
          />
          {errors.display_name && (
            <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
              {errors.display_name.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            About Me
          </label>
          <textarea
            rows={4}
            placeholder="Tell people a little about yourself."
            className="w-full rounded px-3 py-2 text-sm outline-none resize-none"
            style={{
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              border: '1px solid transparent',
            }}
            {...register('bio')}
          />
          <p
            className="mt-1 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Max 500 characters.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!isDirty || updateMe.isPending}
            className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--color-accent)' }}
          >
            {updateMe.isPending ? <LoadingSpinner size="sm" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
