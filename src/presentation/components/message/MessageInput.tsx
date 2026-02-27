import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Reply, X } from 'lucide-react'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { SendMessageSchema, type SendMessageData } from '@/presentation/dto/message.dto'
import type { Message } from '@/domain/message/entities'

interface MessageInputProps {
  placeholder: string
  onSend: (data: SendMessageData) => void
  isSending?: boolean
  replyTo?: Message | null
  onCancelReply?: () => void
}

export function MessageInput({
  placeholder,
  onSend,
  isSending,
  replyTo,
  onCancelReply,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMessageData>({ resolver: zodResolver(SendMessageSchema) })

  const { ref: registerRef, ...contentField } = register('content')

  const onSubmit = (data: SendMessageData) => {
    onSend({ ...data, replyToId: replyTo?.id })
    reset()
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit(onSubmit)()
    }
  }

  return (
    <div className="flex-shrink-0 px-4 pb-6">
      {replyTo && (
        <div
          className="flex items-center gap-2 rounded-t-lg px-4 py-2 text-xs"
          style={{
            background: 'var(--color-input-bg)',
            borderBottom: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Reply size={12} />
          <span>
            Replying to{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>
              User {replyTo.userId.slice(0, 6)}
            </strong>
          </span>
          <button onClick={onCancelReply} className="ml-auto" aria-label="Cancel reply">
            <X size={14} />
          </button>
        </div>
      )}

      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: 'var(--color-input-bg)',
          borderRadius: replyTo ? '0 0 8px 8px' : '8px',
        }}
      >
        <textarea
          {...contentField}
          ref={(el) => {
            registerRef(el)
            textareaRef.current = el
          }}
          placeholder={placeholder}
          rows={1}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          className="flex-1 bg-transparent text-sm outline-none resize-none"
          style={{ color: 'var(--color-text-primary)', maxHeight: '160px' }}
        />
        {isSending && <LoadingSpinner size="sm" />}
      </div>

      {errors.content && (
        <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
          {errors.content.message}
        </p>
      )}
    </div>
  )
}
