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
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'verify-email',
        name: 'VerifyEmail',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/VerifyEmail.vue'),
      },
      {
        path: 'sign-in',
        name: 'SignIn',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/SignIn.vue'),
      },
      {
        path: 'sign-up',
        name: 'SignUp',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/SignUp.vue'),
      },
      {
        path: '/registration-success',
        name: 'RegistrationSuccess',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/RegistrationSuccess.vue'),
      },
      {
        path: '/forgot-password-success',
        name: 'ForgotPasswordSuccess',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/ForgotPasswordSuccess.vue'),
      },
      {
        path: 'notes',
        name: 'Notes',
        meta: { accessMode: 'private' },
        component: () => import('@/views/Notes.vue'),
      },
      {
        path: 'resend-email-verification',
        name: 'ResendEmailVerification',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/ResendVerificationEmail.vue'),
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/ForgotPassword.vue'),
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/ResetPassword.vue'),
      },
      {
        path: 'about',
        name: 'About',
        meta: { accessMode: 'public' },
        component: () => import('@/views/About.vue'),
      },
      {
        path: 'contacts',
        name: 'Contacts',
        meta: { accessMode: 'public' },
        component: () => import('@/views/Contacts.vue'),
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
        component: () => import('@/views/Todos.vue'),
      },
      {
        path: ':id',
        name: 'TodoDetail',
        meta: { accessMode: 'public' },
        component: () => import('@/views/TodoDetail.vue'),
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
        component: () => import('@/views/Profile.vue'),
      },
    ],
  },
]
