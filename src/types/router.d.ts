// src/types/router.d.ts
import 'vue-router'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

export type AccessMode = 'only-for-unauthorized' | 'public' | 'private'

declare module 'vue-router' {
  interface Router {
    checkAccessCurrentRoute: () => Promise<void>
  }
  interface RouteMeta {
    accessMode: AccessMode
  }
}

export const routeNames = [
  'Home',
  'VerifyEmail',
  'SignIn',
  'SignUp',
  'Profile',
  'Notes',
  'ResendEmailVerification',
  'ForgotPassword',
  'ResetPassword',
  'TodoList',
  'TodoDetail',
  'RegistrationSuccess',
  'ForgotPasswordSuccess',
] as const
export type RouteName = (typeof routeNames)[number]
