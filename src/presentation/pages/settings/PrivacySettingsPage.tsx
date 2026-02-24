// Privacy settings page

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdatePrivacySchema, type UpdatePrivacyData } from '@/presentation/dto/user.dto'
import { useGetPrivacy } from '@/application/user/useGetPrivacy'
import { useUpdatePrivacy } from '@/application/user/useUpdatePrivacy'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { toast } from 'sonner'

interface ToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors"
        style={{
          background: checked ? 'var(--color-accent)' : 'var(--color-hover)',
        }}
        role="switch"
        aria-checked={checked}
      >
        <span
          className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
          style={{ transform: checked ? 'translateX(1.25rem)' : 'translateX(0.25rem)' }}
        />
      </button>
    </div>
  )
}

export default function PrivacySettingsPage() {
  const { data: privacy, isLoading } = useGetPrivacy()
  const updatePrivacy = useUpdatePrivacy()

  const { watch, setValue, handleSubmit } = useForm<UpdatePrivacyData>({
    resolver: zodResolver(UpdatePrivacySchema),
    values: {
      // Map enum → boolean for toggle: 'Everyone' = on, anything else = off
      allow_friend_requests_from: privacy?.allowFriendRequestsFrom,
      allow_dms_from: privacy?.allowDmsFrom,
      show_online_status: privacy?.showOnlineStatus,
      show_current_activity: privacy?.showCurrentActivity,
      show_profile_to_non_friends: privacy?.showProfileToNonFriends,
      allow_nsfw_content: privacy?.allowNsfwContent,
    },
  })

  const values = watch()

  const onSubmit = (data: UpdatePrivacyData) => {
    updatePrivacy.mutate(data, {
      onSuccess: () => toast.success('Privacy settings updated!'),
      onError: () => toast.error('Failed to update privacy settings.'),
    })
  }

  if (isLoading) {
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
        Privacy & Safety
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          className="rounded-lg p-4 mb-6 divide-y"
          style={{
            background: 'var(--color-surface-raised)',
          }}
        >
          <Toggle
            label="Allow Friend Requests"
            description="Let other users send you friend requests."
            checked={values.allow_friend_requests_from === 'Everyone'}
            onChange={(v) => setValue('allow_friend_requests_from', v ? 'Everyone' : 'None')}
          />
          <Toggle
            label="Allow Direct Messages"
            description="Let server members send you direct messages."
            checked={values.allow_dms_from === 'Everyone'}
            onChange={(v) => setValue('allow_dms_from', v ? 'Everyone' : 'None')}
          />
          <Toggle
            label="Show Online Status"
            description="Let others see when you are online."
            checked={values.show_online_status ?? true}
            onChange={(v) => setValue('show_online_status', v)}
          />
          <Toggle
            label="Show Current Activity"
            description="Display what you're currently doing to others."
            checked={values.show_current_activity ?? true}
            onChange={(v) => setValue('show_current_activity', v)}
          />
          <Toggle
            label="Show Profile to Non-Friends"
            description="Allow people who aren't your friends to view your full profile."
            checked={values.show_profile_to_non_friends ?? false}
            onChange={(v) => setValue('show_profile_to_non_friends', v)}
          />
          <Toggle
            label="Allow NSFW Content"
            description="Show age-restricted content in servers that have it enabled."
            checked={values.allow_nsfw_content ?? false}
            onChange={(v) => setValue('allow_nsfw_content', v)}
          />
          <div className="py-3">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Content Filter Level
            </p>
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Automatically scan and filter messages with explicit content.
            </p>
            <select
              value={values.content_filter_level ?? 0}
              onChange={(e) => setValue('content_filter_level', Number(e.target.value) as 0 | 1 | 2)}
              className="rounded px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border: '1px solid transparent',
              }}
            >
              <option value={0}>None — Do not filter</option>
              <option value={1}>Low — Filter from non-friends</option>
              <option value={2}>Medium — Filter all messages</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={updatePrivacy.isPending}
          className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-white"
          style={{ background: 'var(--color-accent)' }}
        >
          {updatePrivacy.isPending ? <LoadingSpinner size="sm" /> : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
