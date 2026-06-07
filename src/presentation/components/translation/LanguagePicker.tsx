import { Languages } from 'lucide-react'
import { LANGUAGES, getLanguage } from '@/infrastructure/translation/languages'
import type { LanguageCode } from '@/domain/translation/entities'

interface LanguagePickerProps {
  value: LanguageCode
  onChange: (language: LanguageCode | null) => void
  allowClear?: boolean
  clearLabel?: string
  label?: string
  compact?: boolean
}

export function LanguagePicker({
  value,
  onChange,
  allowClear,
  clearLabel = 'Use default language',
  label = 'Translate to',
  compact,
}: LanguagePickerProps) {
  const language = getLanguage(value)

  return (
    <label className="inline-flex items-center gap-1.5 text-xs" title={label}>
      <Languages size={compact ? 13 : 14} style={{ color: 'var(--color-translation)' }} />
      {!compact && (
        <span style={{ color: 'var(--color-text-secondary)' }}>
          {label}
        </span>
      )}
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value
          onChange(next === '__default__' ? null : (next as LanguageCode))
        }}
        className="rounded px-2 py-1 text-xs outline-none"
        style={{
          background: 'var(--color-input-bg)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
        }}
        aria-label={label}
      >
        {allowClear && <option value="__default__">{clearLabel}</option>}
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label} ({item.flag})
          </option>
        ))}
      </select>
      {compact && (
        <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {language.flag}
        </span>
      )}
    </label>
  )
}
