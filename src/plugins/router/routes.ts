import type { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        meta: { accessMode: 'public' },
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'verify-email',
        name: 'VerifyEmail',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/VerifyEmailView.vue'),
      },
      {
        path: 'sign-in',
        name: 'SignIn',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/SignInView.vue'),
      },
      {
        path: 'sign-up',
        name: 'SignUp',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/SignUpView.vue'),
      },
      {
        path: 'notes',
        name: 'Notes',
        meta: { accessMode: 'private' },
        component: () => import('@/views/NotesView.vue'),
      },
      {
        path: 'resend-email-verification',
        name: 'ResendEmailVerification',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/ResendVerificationEmailView.vue'),
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/ForgotPasswordView.vue'),
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/ResetPasswordView.vue'),
      },
      {
        path: 'about',
        name: 'About',
        meta: { accessMode: 'public' },
        component: () => import('@/views/AboutView.vue'),
      },
    ],
  },
  {
    path: '/todos',
    component: () => import('@/layouts/TodoLayout.vue'),
    children: [
      {
        path: '',
        name: 'TodoList',
        meta: { accessMode: 'public' },
        component: () => import('@/views/TodosView.vue'),
      },
      {
        path: ':id',
        name: 'TodoDetail',
        meta: { accessMode: 'public' },
        component: () => import('@/views/TodoDetailView.vue'),
      },
    ],
  },
  {
    path: '/profile',
    component: () => import('@/layouts/AccountLayout.vue'),
    children: [
      {
        path: '',
        name: 'Profile',
        meta: { accessMode: 'private' },
        component: () => import('@/views/ProfileView.vue'),
      },
    ],
  },
]
