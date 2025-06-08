import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: { accessMode: "public" },
    component: HomeView,
  },
  {
    path: '/todos',
    name: 'TodoList',
    meta: { accessMode: "public" },
    component: () => import('@/views/TodosView.vue'),
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    meta: { accessMode: "only-for-unauthorized" },
    component: () => import('@/views/SignInView.vue'),
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    meta: { accessMode: "only-for-unauthorized" },
    component: () => import('@/views/SignUpView.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: { accessMode: "private" },
    component: () => import('@/views/ProfileView.vue'),
  },
]