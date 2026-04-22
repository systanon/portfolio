import type { UserApplication } from '@/application/user.application'
import type { NavigationGuard, RouteLocationNormalized } from 'vue-router'

export const canUserAccess = async (
  to: RouteLocationNormalized,
  isAuthenticated: boolean,
) => {
  const { accessMode = 'public' } = to.meta

  if (accessMode === 'only-for-unauthorized' && !isAuthenticated) {
    return true
  }
  if (accessMode === 'only-for-unauthorized' && isAuthenticated) {
    return false
  }
  if (accessMode === 'private' && !isAuthenticated) {
    return false
  }
  if (accessMode === 'private' && isAuthenticated) {
    return true
  }

  return false
}

export const navigationGuard =
  (userApplication: UserApplication): NavigationGuard =>
  async (to, from) => {
    const { accessMode = 'public' } = to.meta
    if (from.fullPath === to.fullPath && from.name === to.name) return false

    if (accessMode === 'public') return true

    await userApplication.profileLoading

    const canAccess = await canUserAccess(to, userApplication.isLogged)
    if (!canAccess) {
      const canAccess = await canUserAccess(from, userApplication.isLogged)
      if (!canAccess) {
        return { name: 'Home' }
      }

      return false
    }

    return true
  }
