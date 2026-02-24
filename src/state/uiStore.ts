// Mirrors: state/app_state.rs — UI domain state
// Tracks active guild/channel selection and modal open states

import { create } from 'zustand'

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

  setActiveGuild: (guildId: string | null) => void
  setActiveChannel: (channelId: string | null) => void
  openModal: (key: ModalKey, data?: unknown) => void
  closeModal: (key: ModalKey) => void
  isModalOpen: (key: ModalKey) => boolean
  getModalData: <T>(key: ModalKey) => T | null
}

export const useUIStore = create<UIState>()((set, get) => ({
  activeGuildId: null,
  activeChannelId: null,
  modals: {},
  modalsData: {},

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
}))
