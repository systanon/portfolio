import type { Application } from '@/application/application'
import type { NavigationGuard } from 'vue-router'

export const navigationGuard = (_application: Application): NavigationGuard => async (_to, _from) => {

}
