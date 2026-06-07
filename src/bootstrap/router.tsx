// Mirrors: bootstrap/app_builder.rs route tree
// TanStack Router with type-safe auth guards

import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { tokenStorage } from '@/infrastructure/storage/tokenStorage'

// ── Lazy page imports ─────────────────────────────────────────────────────────
import { lazy } from 'react'

const LoginPage = lazy(() => import('@/presentation/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/presentation/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(
  () => import('@/presentation/pages/auth/ForgotPasswordPage'),
)
const ResetPasswordPage = lazy(
  () => import('@/presentation/pages/auth/ResetPasswordPage'),
)
const DirectMessagesPage = lazy(
  () => import('@/presentation/pages/app/DirectMessagesPage'),
)
const DmConversationPage = lazy(
  () => import('@/presentation/pages/app/DmConversationPage'),
)
const ChannelPage = lazy(() => import('@/presentation/pages/app/ChannelPage'))
const JoinByCodePage = lazy(() => import('@/presentation/pages/app/JoinByCodePage'))
const ProfileSettingsPage = lazy(
  () => import('@/presentation/pages/settings/ProfileSettingsPage'),
)
const AccountSettingsPage = lazy(
  () => import('@/presentation/pages/settings/AccountSettingsPage'),
)
const PrivacySettingsPage = lazy(
  () => import('@/presentation/pages/settings/PrivacySettingsPage'),
)

// ── Layout imports ────────────────────────────────────────────────────────────
import { AuthLayout } from '@/presentation/layouts/AuthLayout'
import { AppLayout } from '@/presentation/layouts/AppLayout'
import { SettingsLayout } from '@/presentation/layouts/SettingsLayout'

// ── Root route ────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// ── Index redirect ────────────────────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    if (tokenStorage.hasTokens()) {
      throw redirect({ to: '/channels/@me' })
    }
    throw redirect({ to: '/login' })
  },
})

// ── Auth layout route ─────────────────────────────────────────────────────────
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: AuthLayout,
})

const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: () => {
    if (tokenStorage.hasTokens()) {
      throw redirect({ to: '/channels/@me' })
    }
  },
})

const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/register',
  component: RegisterPage,
  beforeLoad: () => {
    if (tokenStorage.hasTokens()) {
      throw redirect({ to: '/channels/@me' })
    }
  },
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
  beforeLoad: () => {
    if (tokenStorage.hasTokens()) {
      throw redirect({ to: '/channels/@me' })
    }
  },
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/reset-password',
  component: ResetPasswordPage,
  beforeLoad: () => {
    if (tokenStorage.hasTokens()) {
      throw redirect({ to: '/channels/@me' })
    }
  },
})

// ── Authenticated layout route ────────────────────────────────────────────────
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: AppLayout,
  beforeLoad: () => {
    if (!tokenStorage.hasTokens()) {
      throw redirect({ to: '/login' })
    }
  },
})

// /channels/@me — friends hub
const channelsMeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/channels/@me',
  component: DirectMessagesPage,
})

// /channels/@me/:conversationId — DM or group DM chat
const dmConversationRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/channels/@me/$conversationId',
  component: () => {
    const { conversationId } = dmConversationRoute.useParams()
    return <DmConversationPage conversationId={conversationId} />
  },
})

// /channels/:guildId — redirects to first channel
const guildRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/channels/$guildId',
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/channels/$guildId/$channelId',
      params: { guildId: params.guildId, channelId: '@me' },
    })
  },
})

// /channels/:guildId/:channelId — guild text channel
const channelRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/channels/$guildId/$channelId',
  component: ChannelPage,
})

const joinByCodeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/join/$code',
  component: () => {
    const { code } = joinByCodeRoute.useParams()
    return <JoinByCodePage code={code} />
  },
})

// ── Settings layout route ─────────────────────────────────────────────────────
const settingsLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsLayout,
  beforeLoad: () => {
    if (!tokenStorage.hasTokens()) {
      throw redirect({ to: '/login' })
    }
  },
})

const profileSettingsRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/profile',
  component: ProfileSettingsPage,
})

const accountSettingsRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/account',
  component: AccountSettingsPage,
})

const privacySettingsRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/privacy',
  component: PrivacySettingsPage,
})

// ── Route tree ────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  authLayoutRoute.addChildren([
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
  ]),
  appLayoutRoute.addChildren([
    channelsMeRoute,
    dmConversationRoute,
    guildRoute,
    channelRoute,
    joinByCodeRoute,
  ]),
  settingsLayoutRoute.addChildren([
    profileSettingsRoute,
    accountSettingsRoute,
    privacySettingsRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
