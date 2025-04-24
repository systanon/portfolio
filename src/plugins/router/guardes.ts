import type { Application } from '@/application/application'
import type { NavigationGuard } from 'vue-router'

export const navigationGuard = (application: Application): NavigationGuard => async (to, from) => {

}
