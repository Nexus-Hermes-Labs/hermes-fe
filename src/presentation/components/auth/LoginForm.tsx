import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import axios from 'axios'
import { LoginFormSchema, type LoginFormData } from '@/presentation/dto/auth.dto'
import { useLogin } from '@/application/auth/useLogin'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

export function LoginForm() {
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data)
  }

  return (
    <div>
      <h1
        className="mb-1 text-2xl font-bold text-center"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Welcome back!
      </h1>
      <p
        className="mb-6 text-sm text-center"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        We're so excited to see you again!
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Email or Phone Number{' '}
            <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded px-3 py-2 text-sm outline-none"
            style={{
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              border: errors.email ? '1px solid var(--color-danger)' : '1px solid transparent',
            }}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Password <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full rounded px-3 py-2 text-sm outline-none"
            style={{
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              border: errors.password ? '1px solid var(--color-danger)' : '1px solid transparent',
            }}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {login.error && (
          <p className="text-xs" style={{ color: 'var(--color-danger)' }}>
            {axios.isAxiosError(login.error)
              ? (login.error.response?.data?.error ?? login.error.message ?? 'Login failed. Please try again.')
              : 'Login failed. Please try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="flex w-full items-center justify-center gap-2 rounded py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
          style={{ background: 'var(--color-accent)' }}
        >
          {login.isPending ? (
            <>
              <LoadingSpinner size="sm" />
              Logging in...
            </>
          ) : (
            'Log In'
          )}
        </button>
      </form>

      <p
        className="mt-4 text-sm text-center"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Need an account?{' '}
        <Link
          to="/register"
          className="hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          Register
        </Link>
      </p>
    </div>
  )
}
