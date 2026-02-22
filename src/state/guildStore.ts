// Mirrors: state/app_state.rs — guild domain state
// Maintains ordered guild list with O(1) lookups

import { create } from 'zustand'
import type { Guild } from '@/domain/guild/entities'

interface GuildState {
  guilds: Map<string, Guild>
  guildOrder: string[]

  setGuilds: (guilds: Guild[]) => void
  addGuild: (guild: Guild) => void
  updateGuild: (guild: Guild) => void
  removeGuild: (guildId: string) => void
  getGuild: (guildId: string) => Guild | undefined
  getOrderedGuilds: () => Guild[]
}

export const useGuildStore = create<GuildState>()((set, get) => ({
  guilds: new Map(),
  guildOrder: [],

  setGuilds: (guilds) => {
    const map = new Map(guilds.map((g) => [g.guildId, g]))
    set({ guilds: map, guildOrder: guilds.map((g) => g.guildId) })
  },

  addGuild: (guild) =>
    set((state) => {
      const newMap = new Map(state.guilds)
      newMap.set(guild.guildId, guild)
      return {
        guilds: newMap,
        guildOrder: state.guildOrder.includes(guild.guildId)
          ? state.guildOrder
          : [...state.guildOrder, guild.guildId],
      }
    }),

  updateGuild: (guild) =>
    set((state) => {
      const newMap = new Map(state.guilds)
      newMap.set(guild.guildId, guild)
      return { guilds: newMap }
    }),

  removeGuild: (guildId) =>
    set((state) => {
      const newMap = new Map(state.guilds)
      newMap.delete(guildId)
      return {
        guilds: newMap,
        guildOrder: state.guildOrder.filter((id) => id !== guildId),
      }
    }),

  getGuild: (guildId) => get().guilds.get(guildId),

  getOrderedGuilds: () => {
    const { guilds, guildOrder } = get()
    return guildOrder.flatMap((id) => {
      const g = guilds.get(id)
      return g ? [g] : []
    })
  },
}))
