import { useForm } from 'react-hook-form'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import axios from 'axios'
import {
  ResetPasswordFormSchema,
  type ResetPasswordFormData,
} from '@/presentation/dto/auth.dto'
import { useResetPassword } from '@/application/auth/useResetPassword'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const resetPassword = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordFormSchema),
    values: {
      token,
      new_password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate(data)
  }

  return (
    <div>
      <h1 className="mb-1 text-center text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
        Choose a new password
      </h1>
      <p className="mb-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Use a password with uppercase, lowercase, and a digit.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <input type="hidden" {...register('token')} />
        {errors.token && (
          <p className="text-xs" style={{ color: 'var(--color-danger)' }}>
            {errors.token.message}
          </p>
        )}

        <PasswordField
          label="New password"
          autoComplete="new-password"
          error={errors.new_password?.message}
          registration={register('new_password')}
        />
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          registration={register('confirmPassword')}
        />

        {resetPassword.error && (
          <p className="text-xs" style={{ color: 'var(--color-danger)' }}>
            {axios.isAxiosError(resetPassword.error)
              ? (resetPassword.error.response?.data?.error ?? resetPassword.error.message)
              : 'Could not reset password.'}
          </p>
        )}

        <button
          type="submit"
          disabled={resetPassword.isPending}
          className="flex w-full items-center justify-center gap-2 rounded py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: 'var(--color-accent)' }}
        >
          {resetPassword.isPending ? <LoadingSpinner size="sm" /> : 'Reset password'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Back to{' '}
        <Link to="/login" className="hover:underline" style={{ color: 'var(--color-accent)' }}>
          Log In
        </Link>
      </p>
    </div>
  )
}

function PasswordField({
  label,
  autoComplete,
  error,
  registration,
}: {
  label: string
  autoComplete: string
  error?: string
  registration: UseFormRegisterReturn
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      <input
        type="password"
        autoComplete={autoComplete}
        className="w-full rounded px-3 py-2 text-sm outline-none"
        style={{
          background: 'var(--color-input-bg)',
          color: 'var(--color-text-primary)',
          border: error ? '1px solid var(--color-danger)' : '1px solid transparent',
        }}
        {...registration}
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
