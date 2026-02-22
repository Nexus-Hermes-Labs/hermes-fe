// Render children only if user has required permission in the active guild
// Mirrors the permission bitfield check from guild_role/valueobject.rs

import type { ReactNode } from 'react'
import { PermissionsHelper } from '@/lib/permissions'
import { useGetRoles } from '@/application/guild/useGetRoles'
import { useGetMembers } from '@/application/guild/useGetMembers'
import { useAuthStore } from '@/state/authStore'
import { useUIStore } from '@/state/uiStore'

interface PermissionGateProps {
  permission: number
  guildId?: string
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({
  permission,
  guildId: propGuildId,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { user } = useAuthStore()
  const { activeGuildId } = useUIStore()
  const guildId = propGuildId ?? activeGuildId

  const { data: members } = useGetMembers(guildId)
  const { data: roles } = useGetRoles(guildId)

  if (!user || !guildId || !members || !roles) return <>{fallback}</>

  const member = members.find((m) => m.userId === user.userId)
  if (!member) return <>{fallback}</>

  // Compute effective permissions from all member roles
  const effectiveBits = member.roleIds.reduce((acc, roleId) => {
    const role = roles.find((r) => r.roleId === roleId)
    return role ? acc | role.permissions : acc
  }, 0)

  const helper = PermissionsHelper.from(effectiveBits)

  if (!helper.has(permission)) return <>{fallback}</>

  return <>{children}</>
}
