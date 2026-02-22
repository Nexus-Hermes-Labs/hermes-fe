// Mirrors: guild-service/src/domain/guild_role/valueobject.rs Permissions struct
// Helper class for bitfield permission checks

import { PERMISSIONS, rgbIntToHex, hexToRgbInt } from '@/domain/guild/valueObjects'

export class PermissionsHelper {
  private bits: number

  constructor(bits: number) {
    this.bits = bits
  }

  static from(bits: number): PermissionsHelper {
    return new PermissionsHelper(bits)
  }

  has(permission: number): boolean {
    // ADMINISTRATOR bypasses all checks (mirrors Rust impl)
    if (this.bits & PERMISSIONS.ADMINISTRATOR) return true
    return (this.bits & permission) !== 0
  }

  add(permission: number): PermissionsHelper {
    return new PermissionsHelper(this.bits | permission)
  }

  remove(permission: number): PermissionsHelper {
    return new PermissionsHelper(this.bits & ~permission)
  }

  toBits(): number {
    return this.bits
  }

  isAdministrator(): boolean {
    return (this.bits & PERMISSIONS.ADMINISTRATOR) !== 0
  }
}

export { rgbIntToHex, hexToRgbInt }
