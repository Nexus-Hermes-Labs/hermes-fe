// Guild settings modal — basic guild update form

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { UpdateGuildSchema, type UpdateGuildData } from '@/presentation/dto/guild.dto'
import { useUpdateGuild } from '@/application/guild/useUpdateGuild'
import { useUIStore } from '@/state/uiStore'
import { useGuildStore } from '@/state/guildStore'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

export function GuildSettingsModal() {
  const { isModalOpen, closeModal, activeGuildId } = useUIStore()
  const { getGuild } = useGuildStore()
  const isOpen = isModalOpen('guildSettings')
  const guild = activeGuildId ? getGuild(activeGuildId) : null
  const updateGuild = useUpdateGuild(activeGuildId ?? '')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateGuildData>({
    resolver: zodResolver(UpdateGuildSchema),
    defaultValues: {
      name: guild?.name,
      description: guild?.description ?? undefined,
      visibility: guild?.visibility,
    },
  })

  if (!isOpen || !guild) return null

  const onSubmit = (data: UpdateGuildData) => {
    updateGuild.mutate(data, {
      onSuccess: () => closeModal('guildSettings'),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && closeModal('guildSettings')}
    >
      <div
        className="relative w-full max-w-md rounded-lg p-6 shadow-2xl"
        style={{ background: 'var(--color-channel-sidebar)' }}
      >
        <button
          onClick={() => closeModal('guildSettings')}
          className="absolute right-4 top-4 rounded p-1"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2
          className="mb-6 text-xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Server Settings
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Server Name
            </label>
            <input
              type="text"
              className="w-full rounded px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border: errors.name ? '1px solid var(--color-danger)' : '1px solid transparent',
              }}
              {...register('name')}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded px-3 py-2 text-sm outline-none resize-none"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border: '1px solid transparent',
              }}
              {...register('description')}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Visibility
            </label>
            <select
              className="w-full rounded px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border: '1px solid transparent',
              }}
              {...register('visibility')}
            >
              <option value="private">Private (invite only)</option>
              <option value="public">Public (discoverable)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => closeModal('guildSettings')}
              className="flex-1 rounded py-2 text-sm font-semibold transition-colors"
              style={{
                background: 'var(--color-hover)',
                color: 'var(--color-text-primary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateGuild.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded py-2 text-sm font-semibold text-white"
              style={{ background: 'var(--color-accent)' }}
            >
              {updateGuild.isPending ? <LoadingSpinner size="sm" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
