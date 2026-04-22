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

export class AuthApplication {
  private authService: AuthService
  private tokenManager: TokenManager

  constructor(authService: AuthService, tokenManager: TokenManager) {
    this.authService = authService
    this.tokenManager = tokenManager
  }

  async signIn(dto: SignInDto): Promise<AppSuccess | AppError> {
    const result = await this.authService.authorization(dto)
    if (result instanceof AppSuccess) {
      this.tokenManager.setToken(result.data.access_token)
    }
    return result
  }

  async signUp(dto: SignUpDto): Promise<AppSuccess | AppError> {
    return this.authService.registration(dto)
  }

  async confirmEmail(params: ConfirmQuery): Promise<AppSuccess | AppError> {
    const result = await this.authService.confirmEmail(params)
    if (result instanceof AppSuccess) {
      const access_token = result.data.access_token
      if (access_token) {
        this.tokenManager.setToken(access_token)
      }
    }
    return result
  }

  async resendConfirmEmail(
    dto: ResendConfirmEmailDto,
  ): Promise<AppSuccess | AppError | AppRateLimitError> {
    const result = await this.authService.resendConfirmEmail(dto)
    if (result instanceof AppError) {
      if (result.code === Errors.RATE_LIMIT) {
        const retry = result.headers!.get('Retry-After')
        return new AppRateLimitError(result.message, Number(retry))
      }
      return result
    }
    return result
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<AppSuccess | AppError | AppRateLimitError> {
    const result = await this.authService.forgotPassword(dto)

    if (result instanceof AppError) {
      if (result.code === Errors.RATE_LIMIT) {
        const retry = result.headers!.get('Retry-After')
        return new AppRateLimitError(result.message, Number(retry))
      }
      return result
    }
    return result
  }

  async resetPassword(dto: ResetPasswordDto): Promise<AppSuccess | AppError> {
    return this.authService.resetPassword(dto)
  }

  async refresh(): Promise<AppSuccess | AppError> {
    const result = await this.authService.refresh()
    if (result instanceof AppSuccess) {
      const access_token = result.data.access_token
      if (access_token) {
        this.tokenManager.setToken(access_token)
      }
    }
    return result
  }

  async logout(): Promise<AppSuccess | AppError> {
    const result = await this.authService.logout()
    if (result instanceof AppSuccess) {
      this.tokenManager.clearToken()
    }
    return result
  }
}
