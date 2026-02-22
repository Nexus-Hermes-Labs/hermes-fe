import { cn } from '@/lib/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  className?: string
}

export function LoadingSpinner({ size = 'md', fullScreen, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  }

  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-solid border-current border-t-transparent',
        sizeClasses[size],
        className,
      )}
      style={{ color: 'var(--color-accent)' }}
      role="status"
      aria-label="Loading"
    />
  )

  if (fullScreen) {
    return (
      <div className="flex h-screen w-screen items-center justify-center"
           style={{ background: 'var(--color-content-area)' }}>
        {spinner}
      </div>
    )
  }

  return spinner
}
