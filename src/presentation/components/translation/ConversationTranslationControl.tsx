import { Languages } from 'lucide-react'
import { useUIStore } from '@/state/uiStore'
import { getLanguage } from '@/infrastructure/translation/languages'
import type { LanguageCode } from '@/domain/translation/entities'
import { LanguagePicker } from './LanguagePicker'

interface ConversationTranslationControlProps {
  conversationKey: string
  compact?: boolean
}

export function ConversationTranslationControl({
  conversationKey,
  compact,
}: ConversationTranslationControlProps) {
  const preferences = useUIStore((state) => state.translationPreferences)
  const override = useUIStore(
    (state) => state.conversationTranslationOverrides[conversationKey],
  )
  const setOverride = useUIStore((state) => state.setConversationTranslationOverride)

  const targetLanguage = override?.targetLanguage ?? preferences.preferredLanguage
  const language = getLanguage(targetLanguage)
  const isOverride = Boolean(override)

  const handleChange = (languageCode: LanguageCode | null) => {
    setOverride(
      conversationKey,
      languageCode ? { targetLanguage: languageCode, scope: 'session' } : null,
    )
  }

  return (
    <div
      className="flex items-center gap-2 rounded px-2 py-1"
      style={{
        background: isOverride ? 'rgba(37, 207, 218, 0.12)' : 'transparent',
        color: isOverride ? 'var(--color-translation)' : 'var(--color-text-secondary)',
      }}
    >
      <Languages size={14} />
      {!compact && (
        <span className="text-xs font-medium">
          {isOverride ? 'Override:' : 'Auto:'} {language.label}
        </span>
      )}
      <LanguagePicker
        value={targetLanguage}
        onChange={handleChange}
        allowClear={isOverride}
        clearLabel="Reset to preferred language"
        label="Conversation language"
        compact
      />
    </div>
  )
}
