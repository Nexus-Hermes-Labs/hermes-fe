// Modal for creating a new guild

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { CreateGuildSchema, type CreateGuildData } from '@/presentation/dto/guild.dto'
import { useCreateGuild } from '@/application/guild/useCreateGuild'
import { useUIStore } from '@/state/uiStore'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

export function CreateGuildModal() {
  const { isModalOpen, closeModal } = useUIStore()
  const isOpen = isModalOpen('createGuild')
  const createGuild = useCreateGuild()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGuildData>({
    resolver: zodResolver(CreateGuildSchema),
  })

  const onSubmit = (data: CreateGuildData) => {
    createGuild.mutate(data, {
      onSuccess: () => reset(),
    })
  }

  const handleClose = () => {
    closeModal('createGuild')
    reset()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="relative w-full max-w-md rounded-lg p-6 shadow-2xl"
        style={{ background: 'var(--color-channel-sidebar)' }}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded p-1 transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2
          className="mb-1 text-2xl font-bold text-center"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Create Your Server
        </h2>
        <p
          className="mb-6 text-sm text-center"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Give your new server a personality with a name and an icon.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="guild-name"
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Server Name <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="guild-name"
              type="text"
              placeholder="My Awesome Server"
              className="w-full rounded px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border: errors.name ? '1px solid var(--color-danger)' : '1px solid transparent',
              }}
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="guild-description"
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Description
            </label>
            <textarea
              id="guild-description"
              placeholder="What's your server about?"
              rows={3}
              className="w-full rounded px-3 py-2 text-sm outline-none resize-none"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border: errors.description ? '1px solid var(--color-danger)' : '1px solid transparent',
              }}
              {...register('description')}
            />
          </div>

          {createGuild.error && (
            <p className="text-xs" style={{ color: 'var(--color-danger)' }}>
              Failed to create server. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={createGuild.isPending}
            className="flex w-full items-center justify-center gap-2 rounded py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
            style={{ background: 'var(--color-accent)' }}
          >
            {createGuild.isPending ? (
              <>
                <LoadingSpinner size="sm" />
                Creating...
              </>
            ) : (
              'Create Server'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
