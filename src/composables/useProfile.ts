import { application } from '@/application'
import { AppSuccess } from '@/types/app.types'
import { router } from '@/plugins/router'
import { computed } from 'vue'
import type { UserProfileUpdateInfo } from '@/types/auth'

export function useProfile() {
  const getProfile = async () => {
    const profile = await application.userApplication.getProfile()
    if (profile instanceof AppSuccess) {
      router.checkAccessCurrentRoute()
    }
  }

  const updateProfile = async (dto: UserProfileUpdateInfo) => {
    return application.userApplication.updateProfile(dto)
  }

  const isLogged = computed(() => {
    return application.userApplication.isLogged
  })

  const profile = computed(() => {
    return application.userApplication.userProfile
  })

  return {
    getProfile,
    isLogged,
    updateProfile,
    profile,
  }
}
