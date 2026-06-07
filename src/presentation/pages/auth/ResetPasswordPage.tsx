import { ResetPasswordForm } from '@/presentation/components/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
  const token = new URLSearchParams(window.location.search).get('token') ?? ''

  return <ResetPasswordForm token={token} />
}
