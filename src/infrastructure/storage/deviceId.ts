// Stable per-device identifier sent to the backend as `X-Device-Id`.
// The backend uses it to enforce one active session per device: logging in
// again from the same browser revokes the previous session instead of
// stacking duplicates. The id is generated once on first use and persists
// in localStorage; clearing site data resets it (treated as a new device).

const DEVICE_ID_KEY = 'hermes_device_id'

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID (older browsers,
  // some test runners). 122 bits of randomness is plenty for uniqueness.
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export const deviceId = {
  get(): string {
    let id = localStorage.getItem(DEVICE_ID_KEY)
    if (!id) {
      id = generateId()
      localStorage.setItem(DEVICE_ID_KEY, id)
    }
    return id
  },
}
