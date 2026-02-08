import { errorMsg } from '@/helpers/formatErrorMsg'
import type { HTTPClient } from '@/lib/http.client'
import {
  AppError,
  AppRateLimitError,
  AppSilentError,
  AppSuccess,
  isHttpError,
  type APIError,
} from '@/types/app-errors'
import type {
  AuthResponse,
  ConfirmQuery,
  ForgotPasswordDto,
  RegistrationResponse,
  ResendConfirmEmailDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  SuccessResponse,
  UserProfile,
  UserProfileUpdateInfo,
} from '@/types/auth'
import { API_URL } from '@/constants'

export class AuthService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async registration(dto: SignUpDto): Promise<AppSuccess | AppError> {
    const url = API_URL.auth.sign_up
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo(url, {
        method: 'POST',
        body,
        credentials: 'include',
        resource: url,
        url,
      })
      return new AppSuccess<RegistrationResponse>(errorMsg(result))
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }

  async confirmEmail(params: ConfirmQuery): Promise<void | AppError> {
    try {
      const response = await this.httpClient.do(API_URL.auth.confirm, {
        method: 'POST',
        params,
      })
      if (response.ok) {
        const { access_token } = (await response.json()) as AuthResponse
        localStorage.setItem('access_token', access_token)
      } else {
        return new AppError(errorMsg(await response.json()))
      }
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }
  async resendConfirmEmail(
    dto: ResendConfirmEmailDto,
  ): Promise<SuccessResponse | AppError | AppRateLimitError> {
    const url = API_URL.auth.resendEmail
    const body = JSON.stringify(dto)
    try {
      const result: RegistrationResponse = await this.httpClient.jsonDo(url, {
        method: 'POST',
        body,
        resource: url,
        url,
      })
      return result
    } catch (error: unknown) {
      if (isHttpError(error)) {
        if (error.status === 429) {
          return new AppRateLimitError(errorMsg(error), error.data.retryAfter)
        }
      }
      return new AppError(errorMsg(error))
    }
  }
  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<SuccessResponse | AppError> {
    const url = API_URL.auth.forgotPass
    const body = JSON.stringify(dto)
    try {
      return await this.httpClient.jsonDo(url, {
        method: 'POST',
        body,
        resource: url,
        url,
      })
    } catch (error: unknown) {
      if (isHttpError(error)) {
        if (error.status === 429) {
          return new AppRateLimitError(errorMsg(error), error.data.retryAfter)
        }
      }
      return new AppError(errorMsg(error))
    }
  }

  async resetPassword(
    dto: ResetPasswordDto,
  ): Promise<SuccessResponse | AppError> {
    const url = API_URL.auth.resetPass
    const body = JSON.stringify(dto)
    try {
      return await this.httpClient.jsonDo(url, {
        method: 'POST',
        body,
        resource: url,
        url,
      })
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }

  async authorization(dto: SignInDto): Promise<void | AppError> {
    const url = API_URL.auth.sign_in
    const body = JSON.stringify(dto)
    try {
      const result: AuthResponse = await this.httpClient.jsonDo(url, {
        method: 'POST',
        body,
        credentials: 'include',
        resource: url,
        url,
      })
      localStorage.setItem('access_token', result.access_token)
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }
  async getProfile(): Promise<UserProfile | AppError> {
    const url = API_URL.auth.profile
    try {
      const result = await this.httpClient.jsonDo(url, {
        method: 'POST',
        credentials: 'include',
        resource: url,
        url,
      })
      return result.message
    } catch (e: unknown) {
      const error = e as APIError
      const msg = errorMsg(error.data)
      if (error.status === 401) {
        return new AppSilentError(msg)
      }
      return new AppError(msg)
    }
  }
  async updateProfile(dto: UserProfileUpdateInfo): Promise<AppError | string> {
    const url = API_URL.auth.profile
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo(url, {
        method: 'PATCH',
        credentials: 'include',
        resource: url,
        body,
        url,
      })
      return result.msg
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }
  async refresh(): Promise<void | AppError> {
    const url = API_URL.auth.refresh
    try {
      const result = await this.httpClient.jsonDo(url, {
        method: 'POST',
        credentials: 'include',
        resource: url,
        url,
      })
      localStorage.setItem('access_token', result.access_token)
    } catch (error) {
      throw new AppError(errorMsg(error))
    }
  }
  async logout(): Promise<void | AppError> {
    const url = API_URL.auth.logout
    try {
      await this.httpClient.jsonDo(url, {
        method: 'POST',
        credentials: 'include',
        resource: url,
        url,
      })
      localStorage.removeItem('access_token')
    } catch (error) {
      throw new AppError(errorMsg(error))
    }
  }
}
