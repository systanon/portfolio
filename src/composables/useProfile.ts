import { application } from '@/application'
import { AppSuccess } from '@/types/app.types'
import { router } from '@/plugins/router'
import { computed } from 'vue'
import type { UserProfileUpdateInfo } from '@/types/auth'

export function useProfile() {
  const { userApplication } = application

  const getProfile = async () => {
    const profile = await userApplication.getProfile()
    if (profile instanceof AppSuccess) {
      router.checkAccessCurrentRoute()
    }
  }

  const updateProfile = async (dto: UserProfileUpdateInfo) => {
    return userApplication.updateProfile(dto)
  }

  const isLogged = computed(() => {
    return userApplication.isLogged
  })

  const profile = computed(() => {
    return userApplication.userProfile
  })

  return {
    getProfile,
    isLogged,
    updateProfile,
    profile,
  }
}
