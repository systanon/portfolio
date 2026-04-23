import { AppSuccess } from '@/types/app.types'
import type { UserService } from './services/user.service'
import { AppError } from '@/types/app-errors'
import type { UserProfile, UserProfileUpdateInfo } from '@/types/auth'
import { ref, type Ref } from 'vue'
import type { WSService } from './services/ws.service'

export class UserApplication {
  private userService: UserService
  private profile: Ref<UserProfile | null> = ref(null)
  private wsService: WSService
  resolveProfileLoading: (() => void) | null = null
  profileLoading: Promise<void> = Promise.resolve()

  constructor(userService: UserService, wsService: WSService) {
    this.userService = userService
    this.wsService = wsService
  }

  async getProfile(): Promise<AppSuccess<UserProfile> | AppError> {
    this.profileLoading = new Promise<void>(
      (resolve) => (this.resolveProfileLoading = resolve),
    )
    const profile = await this.userService.getProfile()
    if (profile instanceof AppSuccess) {
      this.profile.value = profile.data

      await this.wsService.wsConnecting

      this.wsService.auth(profile.data.id)
    }
    this.resolveProfileLoading?.()
    return profile
  }

  async updateProfile(
    dto: UserProfileUpdateInfo,
  ): Promise<AppError | AppSuccess> {
    return this.userService.updateProfile(dto)
  }

  public get userProfile() {
    return this.profile.value
  }

  public get isLogged(): boolean {
    return this.profile.value !== null
  }

  public clearProfile() {
    this.profile.value = null
    this.wsService.unauth()
  }
}
