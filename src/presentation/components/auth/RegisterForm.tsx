import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import axios from 'axios'
import { RegisterFormSchema, type RegisterFormData } from '@/presentation/dto/auth.dto'
import { useRegister } from '@/application/auth/useRegister'
import { LoadingSpinner } from '@/presentation/components/shared/LoadingSpinner'

interface FieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

function Field({ label, required, error, children }: FieldProps) {
  return (
    <div>
      <label
        className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export function RegisterForm() {
  const register_ = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
  })

  const inputStyle = (hasError: boolean) => ({
    background: 'var(--color-input-bg)',
    color: 'var(--color-text-primary)',
    border: hasError ? '1px solid var(--color-danger)' : '1px solid transparent',
  })

  const onSubmit = (data: RegisterFormData) => {
    register_.mutate(data)
  }

  return (
    <div>
      <h1
        className="mb-1 text-2xl font-bold text-center"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Create an account
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
        <Field label="Email" required error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded px-3 py-2 text-sm outline-none"
            style={inputStyle(!!errors.email)}
            {...register('email')}
          />
        </Field>

        <Field label="Display Name" required error={errors.display_name?.message}>
          <input
            type="text"
            autoComplete="name"
            className="w-full rounded px-3 py-2 text-sm outline-none"
            style={inputStyle(!!errors.display_name)}
            {...register('display_name')}
          />
        </Field>

        <Field label="Username" required error={errors.username?.message}>
          <input
            type="text"
            autoComplete="username"
            className="w-full rounded px-3 py-2 text-sm outline-none"
            style={inputStyle(!!errors.username)}
            {...register('username')}
          />
          <p
            className="mt-1 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            3-32 characters. Lowercase letters, numbers, underscores only.
          </p>
        </Field>

        <Field label="Password" required error={errors.password?.message}>
          <input
            type="password"
            autoComplete="new-password"
            className="w-full rounded px-3 py-2 text-sm outline-none"
            style={inputStyle(!!errors.password)}
            {...register('password')}
          />
        </Field>

        <Field label="Confirm Password" required error={errors.confirmPassword?.message}>
          <input
            type="password"
            autoComplete="new-password"
            className="w-full rounded px-3 py-2 text-sm outline-none"
            style={inputStyle(!!errors.confirmPassword)}
            {...register('confirmPassword')}
          />
        </Field>

        {register_.error && (
          <p className="text-xs" style={{ color: 'var(--color-danger)' }}>
            {axios.isAxiosError(register_.error)
              ? (register_.error.response?.data?.error ?? register_.error.message ?? 'Registration failed. Please try again.')
              : 'Registration failed. Please try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={register_.isPending}
          className="flex w-full items-center justify-center gap-2 rounded py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: 'var(--color-accent)' }}
        >
          {register_.isPending ? (
            <>
              <LoadingSpinner size="sm" />
              Creating account...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </form>

      <p
        className="mt-4 text-xs text-center"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          className="hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          Log In
        </Link>
      </p>
    </div>
  )
}
