// Create channel modal

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { CreateChannelSchema, type CreateChannelData } from '@/presentation/dto/channel.dto'
import { useCreateChannel } from '@/application/channel/useCreateChannel'
import { useUIStore } from '@/state/uiStore'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

export function CreateChannelModal() {
  const { isModalOpen, closeModal, activeGuildId } = useUIStore()
  const isOpen = isModalOpen('createChannel')
  const createChannel = useCreateChannel(activeGuildId ?? '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateChannelData>({
    resolver: zodResolver(CreateChannelSchema),
    defaultValues: { channel_type: 'text' },
  })

  if (!isOpen) return null

  const onSubmit = (data: CreateChannelData) => {
    createChannel.mutate(data, {
      onSuccess: () => reset(),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && closeModal('createChannel')}
    >
      <div
        className="relative w-full max-w-md rounded-lg p-6 shadow-2xl"
        style={{ background: 'var(--color-channel-sidebar)' }}
      >
        <button
          onClick={() => { closeModal('createChannel'); reset() }}
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
          Create Channel
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Channel Type
            </label>
            <select
              className="w-full rounded px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border: '1px solid transparent',
              }}
              {...register('channel_type')}
            >
              <option value="text">Text Channel</option>
              <option value="voice">Voice Channel</option>
              <option value="announcement">Announcement Channel</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Channel Name <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="new-channel"
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

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { closeModal('createChannel'); reset() }}
              className="flex-1 rounded py-2 text-sm font-semibold"
              style={{ background: 'var(--color-hover)', color: 'var(--color-text-primary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createChannel.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded py-2 text-sm font-semibold text-white"
              style={{ background: 'var(--color-accent)' }}
            >
              {createChannel.isPending ? <LoadingSpinner size="sm" /> : 'Create Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
