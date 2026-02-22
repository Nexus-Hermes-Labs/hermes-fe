import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          className="flex flex-col items-center justify-center p-8 rounded-lg text-center"
          style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}
        >
          <p className="text-lg font-semibold mb-2"
             style={{ color: 'var(--color-danger)' }}>
            Something went wrong
          </p>
          <p className="text-sm mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{
              background: 'var(--color-accent)',
              color: '#fff',
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
