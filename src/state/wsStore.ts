// WebSocket connection state — mirrors shared_state.rs concept for WS

import { create } from 'zustand'

type WsStatus = 'connecting' | 'open' | 'closed' | 'error'

interface WsState {
  status: WsStatus
  latency: number | null
  lastPingAt: number | null

  setStatus: (status: WsStatus) => void
  setLatency: (latency: number) => void
  recordPing: () => void
}

export const useWsStore = create<WsState>()((set) => ({
  status: 'closed',
  latency: null,
  lastPingAt: null,

  setStatus: (status) => set({ status }),

  setLatency: (latency) => set({ latency }),

  recordPing: () => set({ lastPingAt: Date.now() }),
}))
