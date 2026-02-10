import { createRouter as makeRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'
import { routes } from './routes'
import { navigationGuard } from './guards'
import { application } from '@/application'
import { canUserAccess } from '@/plugins/router/guards'
import type { Application } from '@/application/application'

export const createRouter = (application: Application): Router => {
  const router = makeRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })

  router.beforeEach(() => {
    application.clearPageTitle()
  })

  router.beforeEach(navigationGuard(application))

  router.checkAccessCurrentRoute = async () => {
    const route = router.currentRoute.value
    const { accessMode = 'public' } = route.meta
    if (accessMode === 'public') return

    const canAccess = await canUserAccess(route, application.isLogged)
    if (canAccess) return

    console.log('Redirect because there is no access to the route.')
    if (accessMode === 'private') router.push({ name: 'SignIn' })
    if (accessMode === 'only-for-unauthorized') router.push({ name: 'Profile' })
  }

  return router
}

// Here only for Pinia
export const router = createRouter(application)
