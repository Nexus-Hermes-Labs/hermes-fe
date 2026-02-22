// Centered auth card layout — mirrors auth-layout in the route plan

import { Outlet } from '@tanstack/react-router'

export function AuthLayout() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: 'var(--color-content-area)' }}
    >
      <div
        className="w-full max-w-md rounded-lg p-8 shadow-xl"
        style={{ background: 'var(--color-channel-sidebar)' }}
      >
        <Outlet />
      </div>
    </div>
  )
}
