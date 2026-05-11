import { application } from '@/application'
export type BreadcrumbLabel = string | (() => string)

export type BreadcrumbsItem = {
  id: number
  parentId: number | null
  i18n_key?: string
  path: string
  name: string
  label: BreadcrumbLabel
  disabled?: boolean
}

export type Breadcrumbs = BreadcrumbsItem[]

export const breadcrumbsConfig: Breadcrumbs = [
  {
    id: 0,
    parentId: null,
    path: '/todos',
    name: 'TodoList',
    i18n_key: 'nav-menu.todo',
    label: 'Todos',
  },
  {
    id: 1,
    parentId: 0,
    path: '/todos/:id',
    name: 'TodoDetail',
    label: () => application.pageTitle || 'Todo title',
  },
  {
    id: 2,
    parentId: null,
    path: '/sign-in',
    name: 'SignIn',
    i18n_key: 'nav-menu.sign_in',
    label: 'Sign In',
  },
  {
    id: 3,
    parentId: 2,
    path: '/forgot-password',
    name: 'ForgotPassword',
    i18n_key: 'page_forgot_password.title',
    label: 'Forgot Password',
  },
  {
    id: 4,
    parentId: 3,
    path: '/resend-email-verification',
    name: 'ResendEmailVerification',
    i18n_key: 'resend_verification.title',
    label: 'Resend Email Verification',
  },
]
