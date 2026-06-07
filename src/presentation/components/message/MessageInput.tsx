import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Languages, Reply, X } from 'lucide-react'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'
import { SendMessageSchema, type SendMessageData } from '@/presentation/dto/message.dto'
import { useUIStore } from '@/state/uiStore'
import { getLanguage } from '@/infrastructure/translation/languages'
import { LanguagePicker } from '@/presentation/components/translation/LanguagePicker'
import type { Message } from '@/domain/message/entities'

interface MessageInputProps {
  placeholder: string
  onSend: (data: SendMessageData) => void
  isSending?: boolean
  replyTo?: Message | null
  onCancelReply?: () => void
  conversationKey: string
}

export function MessageInput({
  placeholder,
  onSend,
  isSending,
  replyTo,
  onCancelReply,
  conversationKey,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const preferences = useUIStore((state) => state.translationPreferences)
  const override = useUIStore(
    (state) => state.conversationTranslationOverrides[conversationKey],
  )
  const setOverride = useUIStore((state) => state.setConversationTranslationOverride)
  const targetLanguage = override?.targetLanguage ?? preferences.preferredLanguage
  const target = getLanguage(targetLanguage)
  const writingLanguage = getLanguage(preferences.preferredLanguage)

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
          borderRadius: replyTo ? '0' : '8px 8px 0 0',
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

      <div
        className="flex flex-wrap items-center gap-2 rounded-b-lg px-4 py-2 text-[11px]"
        style={{
          background: 'var(--color-input-bg)',
          borderTop: '1px solid var(--color-border)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <span>
          Writing in <strong style={{ color: 'var(--color-text-primary)' }}>{writingLanguage.label}</strong>
        </span>
        <span style={{ color: 'var(--color-text-muted)' }}>.</span>
        <span className="inline-flex items-center gap-1">
          <Languages size={12} style={{ color: 'var(--color-translation)' }} />
          Readers receive translated text
        </span>
        <div className="ml-auto">
          <LanguagePicker
            value={targetLanguage}
            onChange={(language) =>
              setOverride(
                conversationKey,
                language ? { targetLanguage: language, scope: 'session' } : null,
              )
            }
            allowClear={Boolean(override)}
            clearLabel="Reset conversation override"
            label={override ? `Override: ${target.label}` : `Auto: ${target.label}`}
            compact
          />
        </div>
      </div>

      {errors.content && (
        <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
          {errors.content.message}
        </p>
      )}
    </div>
  )
}
