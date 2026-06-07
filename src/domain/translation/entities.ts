export type LanguageCode =
  | 'en'
  | 'tr'
  | 'de'
  | 'fr'
  | 'es'
  | 'it'
  | 'pt'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'ar'
  | 'ru'

export interface Language {
  code: LanguageCode
  label: string
  nativeLabel: string
  flag: string
}

export type TranslationStatus =
  | 'idle'
  | 'translating'
  | 'translated'
  | 'failed'
  | 'unavailable'

export interface Translation {
  targetLanguage: LanguageCode
  text: string
  status: TranslationStatus
  provider?: string
  confidence?: number
  latencyMs?: number
  cached?: boolean
}

export interface ConversationTranslationOverride {
  targetLanguage: LanguageCode | null
  scope: 'session' | 'persistent'
}

export interface TranslationPreferences {
  preferredLanguage: LanguageCode
  autoTranslateIncoming: boolean
  alwaysShowOriginal: boolean
  askBeforeTranslatingDms: boolean
  preserveFormatting: boolean
}
