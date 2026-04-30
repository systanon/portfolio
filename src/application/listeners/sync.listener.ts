import { syncModule, application } from '@/application'
import type { UserProfile } from '@/types/auth'
import { router } from '@/plugins/router'

export function setupSyncListener() {
  const { userApplication } = application
  syncModule.on('user: profile', (profile: UserProfile) => {
    userApplication.setProfile(profile)
    router.checkAccessCurrentRoute()
  })
  syncModule.on('user: logout', () => {
    userApplication.syncClearProfile()
    router.checkAccessCurrentRoute()
  })
}
