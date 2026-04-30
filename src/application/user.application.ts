import { AppSuccess } from '@/types/app.types'
import type { UserService } from './services/user.service'
import { AppError, AppSilentError } from '@/types/app-errors'
import type { UserProfile, UserProfileUpdateInfo } from '@/types/auth'
import { ref, type Ref } from 'vue'
import type { WSService } from './services/ws.service'
import type { NotificationModule } from './modules/notification.module'
import type { SyncModule } from './modules/sync/sync.module'

export class UserApplication {
  private userService: UserService
  private profile: Ref<UserProfile | null> = ref(null)
  private wsService: WSService
  private notificationModule: NotificationModule
  private syncModule: SyncModule
  resolveProfileLoading: (() => void) | null = null
  profileLoading: Promise<void> = Promise.resolve()

  constructor(
    userService: UserService,
    wsService: WSService,
    notificationModule: NotificationModule,
    syncModule: SyncModule,
  ) {
    this.userService = userService
    this.wsService = wsService
    this.notificationModule = notificationModule
    this.syncModule = syncModule
  }

  async getProfile(): Promise<
    AppSuccess<UserProfile> | AppError | AppSilentError
  > {
    this.profileLoading = new Promise<void>(
      (resolve) => (this.resolveProfileLoading = resolve),
    )
    const response = await this.userService.getProfile()
    if (response instanceof AppSuccess) {
      const profile = response.data
      this.setProfile(profile)
      this.wsService.onOpen(() => this.wsService.auth(profile.id))

      this.syncModule.emit('user: profile', profile)
    } else {
      if (response instanceof AppError) {
        this.notificationModule.notify('error', response.message)
      }
    }
    this.resolveProfileLoading?.()
    return response
  }

  async updateProfile(
    dto: UserProfileUpdateInfo,
  ): Promise<AppError | AppSuccess> {
    const response = await this.userService.updateProfile(dto)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  public get userProfile() {
    return this.profile.value
  }

  public get isLogged(): boolean {
    return this.profile.value !== null
  }

  public setProfile(profile: UserProfile) {
    this.profile.value = profile
    this.wsService.onOpen(() => this.wsService.auth(profile.id))
  }

  public syncClearProfile() {
    this.profile.value = null
    this.wsService.unauth()
  }

  public clearProfile() {
    this.profile.value = null
    this.wsService.unauth()
    this.syncModule.emit('user: logout')
  }
}
