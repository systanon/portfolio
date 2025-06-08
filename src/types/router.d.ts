// src/types/router.d.ts
import 'vue-router'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

declare module 'vue-router' {
  interface Router {
    checkAccessCurrentRoute: () => Promise<void>
  }
}