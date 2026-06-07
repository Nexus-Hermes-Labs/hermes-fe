// Mirrors: state/app_state.rs — UI domain state
// Tracks active guild/channel selection and modal open states

import { create } from 'zustand'
import type {
  ConversationTranslationOverride,
  LanguageCode,
  TranslationPreferences,
} from '@/domain/translation/entities'

type ModalKey =
  | 'createGuild'
  | 'guildSettings'
  | 'createChannel'
  | 'invite'
  | 'userSettings'
  | 'search'
  | 'userProfile'
  | 'joinGuild'
  | 'customStatus'

interface UIState {
  activeGuildId: string | null
  activeChannelId: string | null
  modals: Partial<Record<ModalKey, boolean>>
  modalsData: Partial<Record<ModalKey, unknown>>
  translationPreferences: TranslationPreferences
  conversationTranslationOverrides: Record<string, ConversationTranslationOverride>
  messageShowOriginal: Record<string, boolean>
  messageTargetOverrides: Record<string, LanguageCode>

  setActiveGuild: (guildId: string | null) => void
  setActiveChannel: (channelId: string | null) => void
  openModal: (key: ModalKey, data?: unknown) => void
  closeModal: (key: ModalKey) => void
  isModalOpen: (key: ModalKey) => boolean
  getModalData: <T>(key: ModalKey) => T | null
  updateTranslationPreferences: (patch: Partial<TranslationPreferences>) => void
  setConversationTranslationOverride: (
    conversationKey: string,
    override: ConversationTranslationOverride | null,
  ) => void
  toggleMessageOriginal: (messageId: string) => void
  setMessageTargetOverride: (messageId: string, language: LanguageCode | null) => void
}

export const useUIStore = create<UIState>()((set, get) => ({
  activeGuildId: null,
  activeChannelId: null,
  modals: {},
  modalsData: {},
  translationPreferences: {
    preferredLanguage: 'en',
    autoTranslateIncoming: true,
    alwaysShowOriginal: false,
    askBeforeTranslatingDms: false,
    preserveFormatting: true,
  },
  conversationTranslationOverrides: {},
  messageShowOriginal: {},
  messageTargetOverrides: {},

  setActiveGuild: (guildId) =>
    set({ activeGuildId: guildId, activeChannelId: null }),

  setActiveChannel: (channelId) =>
    set({ activeChannelId: channelId }),

  openModal: (key, data) =>
    set((state) => ({
      modals: { ...state.modals, [key]: true },
      modalsData: { ...state.modalsData, [key]: data ?? null },
    })),

  closeModal: (key) =>
    set((state) => ({
      modals: { ...state.modals, [key]: false },
      modalsData: { ...state.modalsData, [key]: null },
    })),

  isModalOpen: (key) => get().modals[key] === true,

  getModalData: <T>(key: ModalKey) => (get().modalsData[key] as T) ?? null,

  updateTranslationPreferences: (patch) =>
    set((state) => ({
      translationPreferences: { ...state.translationPreferences, ...patch },
    })),

  setConversationTranslationOverride: (conversationKey, override) =>
    set((state) => {
      const next = { ...state.conversationTranslationOverrides }
      if (!override || override.targetLanguage === null) {
        delete next[conversationKey]
      } else {
        next[conversationKey] = override
      }
      return { conversationTranslationOverrides: next }
    }),

  toggleMessageOriginal: (messageId) =>
    set((state) => ({
      messageShowOriginal: {
        ...state.messageShowOriginal,
        [messageId]: !state.messageShowOriginal[messageId],
      },
    })),

  setMessageTargetOverride: (messageId, language) =>
    set((state) => {
      const next = { ...state.messageTargetOverrides }
      if (language === null) {
        delete next[messageId]
      } else {
        next[messageId] = language
      }
      return { messageTargetOverrides: next }
    }),
}))
