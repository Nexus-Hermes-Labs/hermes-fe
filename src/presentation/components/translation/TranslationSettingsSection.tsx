import { useUIStore } from '@/state/uiStore'
import { LANGUAGES } from '@/infrastructure/translation/languages'
import type { LanguageCode, TranslationPreferences } from '@/domain/translation/entities'

type ToggleKey = Exclude<keyof TranslationPreferences, 'preferredLanguage'>

const TOGGLES: Array<{ key: ToggleKey; title: string; description: string }> = [
  {
    key: 'autoTranslateIncoming',
    title: 'Auto-translate incoming messages',
    description: 'Messages in other languages are displayed in your preferred language by default.',
  },
  {
    key: 'alwaysShowOriginal',
    title: 'Always show original below translation',
    description: 'Useful when you want to audit translation quality while chatting.',
  },
  {
    key: 'askBeforeTranslatingDms',
    title: 'Ask before translating private DMs',
    description: 'Hermes will ask before private DM content is sent to the translation service.',
  },
  {
    key: 'preserveFormatting',
    title: 'Preserve original formatting',
    description: 'Keep code blocks, mentions, links, and emoji stable during translation.',
  },
]

export function TranslationSettingsSection() {
  const preferences = useUIStore((state) => state.translationPreferences)
  const update = useUIStore((state) => state.updateTranslationPreferences)

  return (
    <section
      className="rounded-lg p-4"
      style={{ background: 'var(--color-surface-raised)' }}
    >
      <h2
        className="mb-1 text-sm font-semibold uppercase tracking-wide"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Translation
      </h2>
      <p className="mb-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        These are frontend preferences until user-service exposes a persisted language contract.
      </p>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Preferred language
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Default language for channels and direct messages.
          </p>
        </div>
        <select
          value={preferences.preferredLanguage}
          onChange={(event) =>
            update({ preferredLanguage: event.target.value as LanguageCode })
          }
          className="rounded px-3 py-2 text-sm outline-none"
          style={{
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.nativeLabel} - {language.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {TOGGLES.map((item) => (
          <label key={item.key} className="flex items-start justify-between gap-4">
            <span>
              <span
                className="block text-sm font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {item.title}
              </span>
              <span className="block text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {item.description}
              </span>
            </span>
            <input
              type="checkbox"
              checked={preferences[item.key]}
              onChange={(event) => update({ [item.key]: event.target.checked })}
              className="mt-1 h-4 w-4 accent-[var(--color-translation)]"
            />
          </label>
        ))}
      </div>
    </section>
  )
}
