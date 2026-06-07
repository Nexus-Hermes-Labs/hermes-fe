import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import axios from 'axios'
import {
  ForgotPasswordFormSchema,
  type ForgotPasswordFormData,
} from '@/presentation/dto/auth.dto'
import { useForgotPassword } from '@/application/auth/useForgotPassword'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword()
  const [message, setMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    setMessage(null)
    forgotPassword.mutate(data, {
      onSuccess: (response) => setMessage(response.message),
    })
  }

  return (
    <div>
      <h1 className="mb-1 text-center text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
        Reset your password
      </h1>
      <p className="mb-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Enter your email and Hermes will send a reset link if the account exists.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
            Email
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

        {message && (
          <p className="text-xs" style={{ color: 'var(--color-success)' }}>
            {message}
          </p>
        )}
        {forgotPassword.error && (
          <p className="text-xs" style={{ color: 'var(--color-danger)' }}>
            {axios.isAxiosError(forgotPassword.error)
              ? (forgotPassword.error.response?.data?.error ?? forgotPassword.error.message)
              : 'Could not request password reset.'}
          </p>
        )}

        <button
          type="submit"
          disabled={forgotPassword.isPending}
          className="flex w-full items-center justify-center gap-2 rounded py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: 'var(--color-accent)' }}
        >
          {forgotPassword.isPending ? <LoadingSpinner size="sm" /> : 'Send reset link'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Remembered it?{' '}
        <Link to="/login" className="hover:underline" style={{ color: 'var(--color-accent)' }}>
          Log In
        </Link>
      </p>
    </div>
  )
}
