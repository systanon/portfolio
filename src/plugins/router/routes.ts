import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TodoLayout from '@/layouts/TodoLayout.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'DefaultLayout',
    component: DefaultLayout,
    children: [
      {
        path: '/',
        name: 'Home',
        meta: { accessMode: 'public' },
        component: HomeView,
      },
      {
        path: '/verify-email',
        name: 'VerifyEmail',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/VerifyEmailView.vue'),
      },
      {
        path: '/sign-in',
        name: 'SignIn',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/SignInView.vue'),
      },
      {
        path: '/sign-up',
        name: 'SignUp',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/SignUpView.vue'),
      },
      {
        path: '/profile',
        name: 'Profile',
        meta: { accessMode: 'private' },
        component: () => import('@/views/ProfileView.vue'),
      },
      {
        path: '/notes',
        name: 'Notes',
        meta: { accessMode: 'private' },
        component: () => import('@/views/NotesView.vue'),
      },
      {
        path: '/resend-email-verification',
        name: 'ResendEmailVerification',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/ResendVerificationEmailView.vue'),
      },
      {
        path: '/forgot-password',
        name: 'ForgotPassword',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/ForgotPasswordView.vue'),
      },
      {
        path: '/reset-password',
        name: 'ResetPassword',
        meta: { accessMode: 'only-for-unauthorized' },
        component: () => import('@/views/ResetPasswordView.vue'),
      },
    ],
  },
  {
    path: '/todos',
    name: 'TodoLayout',
    component: TodoLayout,
    children: [
      {
        path: '/todos',
        name: 'TodoList',
        meta: { accessMode: 'public' },
        component: () => import('@/views/TodosView.vue'),
      },
      {
        path: '/todos/:id',
        name: 'TodoDetail',
        meta: { accessMode: 'public' },
        component: () => import('@/views/TodoDetailView.vue'),
      },
    ],
  },
]
