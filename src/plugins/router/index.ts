import { createRouter as makeRouter, createWebHistory, } from 'vue-router'
import type { Router } from 'vue-router'
import { routes } from './routes'
import { navigationGuard } from './guardes'
import { application } from '@/application'
import type { Application } from '@/application/application'

export const createRouter = (application: Application): Router => {
  const router = makeRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })

  router.beforeEach(navigationGuard(application))

  return router
}

// Here only for Pinia
export const router = createRouter(application)
