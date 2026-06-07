import { useState } from 'react'
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Languages,
  Loader2,
  Pencil,
  Reply,
  RotateCw,
  Smile,
  Trash2,
} from 'lucide-react'
import { UserAvatar } from '@/presentation/components/user/UserAvatar'
import { ReactionPanel } from './ReactionPanel'
import { formatRelativeTime } from '@/lib/formatters'
import { useAuthStore } from '@/state/authStore'
import { useGetUser } from '@/application/user/useGetUser'
import { useUIStore } from '@/state/uiStore'
import { getLanguage } from '@/infrastructure/translation/languages'
import { LanguagePicker } from '@/presentation/components/translation/LanguagePicker'
import type { Message } from '@/domain/message/entities'
import type { LanguageCode, TranslationStatus } from '@/domain/translation/entities'

interface MessageItemProps {
  message: Message
  onEdit: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
  onReply?: (message: Message) => void
}

function ActionBtn({
  onClick,
  title,
  danger,
  children,
}: {
  onClick: () => void
  title: string
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex h-7 w-7 items-center justify-center rounded transition-colors"
      style={{ color: danger ? 'var(--color-danger)' : 'var(--color-text-secondary)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? 'rgba(237,66,69,0.15)' : 'var(--color-hover)'
        e.currentTarget.style.color = danger ? 'var(--color-danger)' : 'var(--color-text-primary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = danger ? 'var(--color-danger)' : 'var(--color-text-secondary)'
      }}
    >
      {children}
    </button>
  )
}

export function MessageItem({ message, onEdit, onDelete, onReply }: MessageItemProps) {
  const { user } = useAuthStore()
  const isOwn = user?.userId === message.userId
  const { data: author } = useGetUser(message.userId)
  const translationPreferences = useUIStore((state) => state.translationPreferences)
  const conversationOverrides = useUIStore((state) => state.conversationTranslationOverrides)
  const messageShowOriginal = useUIStore((state) => state.messageShowOriginal[message.id])
  const messageTargetOverride = useUIStore((state) => state.messageTargetOverrides[message.id])
  const toggleMessageOriginal = useUIStore((state) => state.toggleMessageOriginal)
  const setMessageTargetOverride = useUIStore((state) => state.setMessageTargetOverride)
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [reactionsOpen, setReactionsOpen] = useState(false)

  const displayName = isOwn
    ? (user?.displayName ?? 'You')
    : (author?.displayName ?? author?.username ?? `User ${message.userId.slice(0, 6)}`)

  const avatarUrl = isOwn ? (user?.avatarUrl ?? null) : (author?.avatarUrl ?? null)
  const conversationKey = message.channelId ?? message.conversationId ?? 'unknown'
  const conversationOverride = conversationOverrides[conversationKey]
  const originalLanguage = message.originalLanguage ?? 'en'
  const targetLanguage =
    messageTargetOverride ??
    conversationOverride?.targetLanguage ??
    translationPreferences.preferredLanguage
  const sameLanguage = originalLanguage === targetLanguage
  const translation = sameLanguage ? undefined : message.translations?.[targetLanguage]
  const translationStatus: TranslationStatus = sameLanguage
    ? 'idle'
    : translation
      ? translation.status
      : translationPreferences.autoTranslateIncoming || messageTargetOverride || conversationOverride
        ? 'unavailable'
        : 'idle'
  const showOriginalBelow =
    !sameLanguage &&
    translationStatus === 'translated' &&
    (translationPreferences.alwaysShowOriginal || messageShowOriginal)

  const handleSaveEdit = () => {
    const trimmed = editContent.trim()
    if (trimmed && trimmed !== message.content) {
      onEdit(message.id, trimmed)
    }
    setEditing(false)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveEdit()
    }
    if (e.key === 'Escape') {
      setEditing(false)
      setEditContent(message.content)
    }
  }

  if (message.isDeleted) {
    return (
      <div className="flex items-center gap-3 px-4 py-1">
        <div className="w-10 flex-shrink-0" />
        <span className="text-sm italic" style={{ color: 'var(--color-text-muted)' }}>
          Message deleted
        </span>
      </div>
    )
  }

  return (
    <div
      className="relative flex items-start gap-3 px-4 py-1.5 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? 'rgba(255,255,255,0.02)' : 'transparent' }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <UserAvatar displayName={displayName} avatarUrl={avatarUrl} size="md" />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-baseline gap-2 mb-0.5">
          <span
            className="text-sm font-semibold"
            style={{ color: isOwn ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
          >
            {displayName}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {formatRelativeTime(message.createdAt)}
          </span>
          {message.editedAt && (
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              (edited)
            </span>
          )}
        </div>

        {/* Content */}
        {editing ? (
          <div>
            <textarea
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleEditKeyDown}
              rows={2}
              className="w-full rounded px-3 py-2 text-sm outline-none resize-none"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-accent)',
              }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Enter to save · Esc to cancel
            </p>
          </div>
        ) : (
          <TranslatedMessageBody
            message={message}
            originalLanguage={originalLanguage}
            targetLanguage={targetLanguage}
            status={translationStatus}
            sameLanguage={sameLanguage}
            showOriginalBelow={showOriginalBelow}
            showOriginalToggle={Boolean(messageShowOriginal)}
            onToggleOriginal={() => toggleMessageOriginal(message.id)}
            onChangeTarget={(language) => setMessageTargetOverride(message.id, language)}
          />
        )}

        {/* Reactions panel (on-demand) */}
        {reactionsOpen && <ReactionPanel messageId={message.id} />}
      </div>

      {/* Hover action bar */}
      {hovered && !editing && (
        <div
          className="absolute top-0 right-4 flex items-center gap-0.5 rounded px-1 py-0.5 shadow-md"
          style={{
            background: 'var(--color-channel-sidebar)',
            border: '1px solid var(--color-border)',
          }}
        >
          {onReply && (
            <ActionBtn onClick={() => onReply(message)} title="Reply">
              <Reply size={14} />
            </ActionBtn>
          )}
          <ActionBtn
            onClick={() => setReactionsOpen((o) => !o)}
            title={reactionsOpen ? 'Close reactions' : 'Add reaction'}
          >
            <Smile size={14} />
          </ActionBtn>
          {!sameLanguage && translationStatus === 'translated' && (
            <ActionBtn
              onClick={() => toggleMessageOriginal(message.id)}
              title={messageShowOriginal ? 'Hide original' : 'Show original'}
            >
              {messageShowOriginal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </ActionBtn>
          )}
          <LanguagePicker
            value={targetLanguage}
            onChange={(language) => setMessageTargetOverride(message.id, language)}
            allowClear={Boolean(messageTargetOverride)}
            clearLabel="Use conversation default"
            label="Translate message"
            compact
          />
          {translationStatus === 'failed' && (
            <ActionBtn onClick={() => setMessageTargetOverride(message.id, targetLanguage)} title="Retry translation">
              <RotateCw size={14} />
            </ActionBtn>
          )}
          {isOwn && (
            <>
              <ActionBtn
                onClick={() => {
                  setEditContent(message.content)
                  setEditing(true)
                }}
                title="Edit"
              >
                <Pencil size={14} />
              </ActionBtn>
              <ActionBtn onClick={() => onDelete(message.id)} title="Delete" danger>
                <Trash2 size={14} />
              </ActionBtn>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function TranslatedMessageBody({
  message,
  originalLanguage,
  targetLanguage,
  status,
  sameLanguage,
  showOriginalBelow,
  showOriginalToggle,
  onToggleOriginal,
  onChangeTarget,
}: {
  message: Message
  originalLanguage: LanguageCode
  targetLanguage: LanguageCode
  status: TranslationStatus
  sameLanguage: boolean
  showOriginalBelow: boolean
  showOriginalToggle: boolean
  onToggleOriginal: () => void
  onChangeTarget: (language: LanguageCode | null) => void
}) {
  const original = getLanguage(originalLanguage)
  const target = getLanguage(targetLanguage)
  const translation = sameLanguage ? undefined : message.translations?.[targetLanguage]

  if (sameLanguage || status === 'idle') {
    return (
      <p
        className="text-sm whitespace-pre-wrap break-words"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {message.content}
      </p>
    )
  }

  if (status === 'translated' && translation) {
    return (
      <div className="space-y-1">
        <p
          className="text-sm whitespace-pre-wrap break-words"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {translation.text}
        </p>
        <div
          className="flex flex-wrap items-center gap-2 text-[11px]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span className="inline-flex items-center gap-1">
            <Languages size={12} style={{ color: 'var(--color-translation)' }} />
            Translated from {original.label} to {target.label}
          </span>
          {message.languageAutoDetected && <span>auto-detected</span>}
          {typeof translation.confidence === 'number' && (
            <span>{Math.round(translation.confidence * 100)}% confidence</span>
          )}
          {translation.cached && <span>cached</span>}
          <button
            type="button"
            onClick={onToggleOriginal}
            className="inline-flex items-center gap-1 hover:underline"
            style={{ color: 'var(--color-translation)' }}
          >
            {showOriginalToggle ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showOriginalToggle ? 'Hide original' : 'Show original'}
          </button>
          <LanguagePicker
            value={targetLanguage}
            onChange={onChangeTarget}
            allowClear
            clearLabel="Use conversation default"
            label="Translate message"
            compact
          />
        </div>
        {showOriginalBelow && (
          <blockquote
            className="mt-1 border-l-2 pl-3 text-sm whitespace-pre-wrap break-words"
            style={{
              borderColor: 'var(--color-translation-muted)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {message.content}
          </blockquote>
        )}
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-warning)' }}>
          <AlertTriangle size={14} />
          Translation failed. Showing original {original.label}.
        </div>
        <p
          className="text-sm whitespace-pre-wrap break-words"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {message.content}
        </p>
      </div>
    )
  }

  if (status === 'translating') {
    return (
      <div className="flex items-center gap-2 text-sm italic" style={{ color: 'var(--color-text-secondary)' }}>
        <Loader2 size={14} className="animate-spin" style={{ color: 'var(--color-translation)' }} />
        Translating to {target.label}...
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
        <Languages size={12} style={{ color: 'var(--color-translation)' }} />
        Translation is not available for {target.label} yet.
        <button
          type="button"
          onClick={() => onChangeTarget(targetLanguage)}
          className="hover:underline"
          style={{ color: 'var(--color-translation)' }}
        >
          Request translation
        </button>
      </div>
      <p
        className="text-sm whitespace-pre-wrap break-words"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {message.content}
      </p>
    </div>
  )
}
