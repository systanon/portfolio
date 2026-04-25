import type {
  ConfirmQuery,
  ForgotPasswordDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from '@/types/auth'
import type { AuthService } from './services/auth.service'
import { AppSuccess } from '@/types/app.types'
import { AppError, AppRateLimitError } from '@/types/app-errors'
import type { TokenManager } from '../lib/token.manager'
import type { NotificationModule } from './modules/notification.module'

export class AuthApplication {
  private authService: AuthService
  private tokenManager: TokenManager
  private notificationModule: NotificationModule

  constructor(
    authService: AuthService,
    tokenManager: TokenManager,
    notificationModule: NotificationModule,
  ) {
    this.authService = authService
    this.tokenManager = tokenManager
    this.notificationModule = notificationModule
  }

  async signIn(dto: SignInDto): Promise<AppSuccess | AppError> {
    const response = await this.authService.authorization(dto)
    if (response instanceof AppSuccess) {
      const { access_token } = response.data
      this.tokenManager.setToken(access_token)
    } else {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async signUp(dto: SignUpDto): Promise<AppSuccess | AppError> {
    const response = await this.authService.registration(dto)

    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async confirmEmail(params: ConfirmQuery): Promise<AppSuccess | AppError> {
    const response = await this.authService.confirmEmail(params)
    if (response instanceof AppSuccess) {
      const access_token = response.data.access_token
      this.tokenManager.setToken(access_token)
    } else {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async resendConfirmEmail(
    dto: ResendConfirmEmailDto,
  ): Promise<AppSuccess | AppError | AppRateLimitError> {
    const response = await this.authService.resendConfirmEmail(dto)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<AppSuccess | AppError | AppRateLimitError> {
    const response = await this.authService.forgotPassword(dto)

    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async resetPassword(dto: ResetPasswordDto): Promise<AppSuccess | AppError> {
    const response = await this.authService.resetPassword(dto)
    if (response instanceof AppSuccess) {
      this.notificationModule.notify('success', response.message)
    } else {
      this.notificationModule.notify('error', response.message)
    }

    return response
  }

  async refresh(): Promise<AppSuccess | AppError> {
    const response = await this.authService.refresh()
    if (response instanceof AppSuccess) {
      const access_token = response.data.access_token
      this.tokenManager.setToken(access_token)
    }
    return response
  }

  async logout(): Promise<AppSuccess | AppError> {
    const response = await this.authService.logout()
    if (response instanceof AppSuccess) {
      this.tokenManager.clearToken()
    } else {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }
}
