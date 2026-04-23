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
import type { TokenManager } from './tokenManager'
import { Errors } from '@/constants'
import type { NotificationService } from './services/notification.service'

export class AuthApplication {
  private authService: AuthService
  private tokenManager: TokenManager
  private notificationService: NotificationService

  constructor(
    authService: AuthService,
    tokenManager: TokenManager,
    notificationService: NotificationService,
  ) {
    this.authService = authService
    this.tokenManager = tokenManager
    this.notificationService = notificationService
  }

  async signIn(dto: SignInDto): Promise<AppSuccess | AppError> {
    const response = await this.authService.authorization(dto)
    if (response instanceof AppSuccess) {
      this.tokenManager.setToken(response.data.access_token)
    } else {
      this.notificationService.notify('error', response.message)
    }
    return response
  }

  async signUp(dto: SignUpDto): Promise<AppSuccess | AppError> {
    const response = await this.authService.registration(dto)

    if (response instanceof AppError) {
      this.notificationService.notify('error', response.message)
    }
    return response
  }

  async confirmEmail(params: ConfirmQuery): Promise<AppSuccess | AppError> {
    const response = await this.authService.confirmEmail(params)
    if (response instanceof AppSuccess) {
      const access_token = response.data.access_token
      if (access_token) {
        this.tokenManager.setToken(access_token)
      }
    } else {
      this.notificationService.notify('error', response.message)
    }
    return response
  }

  async resendConfirmEmail(
    dto: ResendConfirmEmailDto,
  ): Promise<AppSuccess | AppError | AppRateLimitError> {
    const response = await this.authService.resendConfirmEmail(dto)
    if (response instanceof AppError) {
      this.notificationService.notify('error', response.message)
      if (response.code === Errors.RATE_LIMIT) {
        const retry = response.headers!.get('Retry-After')
        return new AppRateLimitError(response.message, Number(retry))
      }
    }
    return response
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<AppSuccess | AppError | AppRateLimitError> {
    const response = await this.authService.forgotPassword(dto)

    if (response instanceof AppError) {
      this.notificationService.notify('error', response.message)
      if (response.code === Errors.RATE_LIMIT) {
        const retry = response.headers!.get('Retry-After')
        return new AppRateLimitError(response.message, Number(retry))
      }
    }
    return response
  }

  async resetPassword(dto: ResetPasswordDto): Promise<AppSuccess | AppError> {
    const response = await this.authService.resetPassword(dto)
    if (response instanceof AppSuccess) {
      this.notificationService.notify('success', response.message)
    } else {
      this.notificationService.notify('error', response.message)
    }

    return response
  }

  async refresh(): Promise<AppSuccess | AppError> {
    const response = await this.authService.refresh()
    if (response instanceof AppSuccess) {
      const access_token = response.data.access_token
      if (access_token) {
        this.tokenManager.setToken(access_token)
      }
    }
    return response
  }

  async logout(): Promise<AppSuccess | AppError> {
    const response = await this.authService.logout()
    if (response instanceof AppSuccess) {
      this.tokenManager.clearToken()
    } else {
      this.notificationService.notify('error', response.message)
    }
    return response
  }
}
