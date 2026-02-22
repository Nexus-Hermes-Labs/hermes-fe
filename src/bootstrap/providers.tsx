// Mirrors: bootstrap/app_builder.rs — root <Providers> wrapping all deps
// QueryClient + Router + Toaster

import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import { queryClient } from './queryClient'
import { router } from './router'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'hsl(220 7% 26%)',
            border: '1px solid hsl(220 7% 12%)',
            color: 'hsl(210 10% 93%)',
          },
        }}
      />
    </QueryClientProvider>
  )
}
