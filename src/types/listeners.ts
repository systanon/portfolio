import type { UserProfile } from './auth'

export interface AppSyncEvents {
  'user: profile': (profile: UserProfile) => void
  'user: logout': () => void
}
