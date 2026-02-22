// Full-screen settings overlay with sidebar navigation

import { Outlet, Link, useRouter } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { label: 'My Account', to: '/settings/account' },
  { label: 'Profile', to: '/settings/profile' },
  { label: 'Privacy & Safety', to: '/settings/privacy' },
] as const

export function SettingsLayout() {
  const router = useRouter()

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: 'var(--color-content-area)' }}
    >
      {/* Settings nav sidebar */}
      <div
        className="flex w-56 flex-shrink-0 flex-col items-end overflow-y-auto py-16 pr-2"
        style={{ background: 'var(--color-channel-sidebar)' }}
      >
        <nav className="w-40 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'block rounded px-2 py-1.5 text-sm font-medium transition-colors',
              )}
              style={{ color: 'var(--color-text-secondary)' }}
              activeProps={{
                style: {
                  background: 'var(--color-hover)',
                  color: 'var(--color-text-primary)',
                },
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Settings content */}
      <div className="flex flex-1 overflow-y-auto py-16 pl-10">
        <div className="w-full max-w-xl">
          <Outlet />
        </div>

        {/* Close button */}
        <div className="ml-20 flex flex-col items-center gap-2 pt-1">
          <button
            onClick={() => router.history.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: 'var(--color-text-secondary)',
              color: 'var(--color-text-secondary)',
            }}
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            ESC
          </span>
        </div>
      </div>
    </div>
  )
}
