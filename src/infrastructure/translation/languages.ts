import type { Language, LanguageCode } from '@/domain/translation/entities'

export const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: 'EN' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Turkce', flag: 'TR' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: 'DE' },
  { code: 'fr', label: 'French', nativeLabel: 'Francais', flag: 'FR' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Espanol', flag: 'ES' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano', flag: 'IT' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Portugues', flag: 'PT' },
  { code: 'ja', label: 'Japanese', nativeLabel: 'Nihongo', flag: 'JA' },
  { code: 'ko', label: 'Korean', nativeLabel: 'Hangugeo', flag: 'KO' },
  { code: 'zh', label: 'Chinese', nativeLabel: 'Zhongwen', flag: 'ZH' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'Al-Arabiyyah', flag: 'AR' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Russkiy', flag: 'RU' },
]

export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0]
}
