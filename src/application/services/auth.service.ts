import type { HTTPClient } from '@/lib/http.client'
import { AppError, AppRateLimitError, AppSilentError } from '@/types/app-errors'
import type {
  ConfirmQuery,
  ForgotPasswordDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  UserProfile,
  UserProfileUpdateInfo,
} from '@/types/auth'
import { API_URL } from '@/constants'
import { AppSuccess } from '@/types/app.types'
import { Errors } from '@/constants'

export class AuthService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async registration(dto: SignUpDto): Promise<AppSuccess | AppError> {
    const url = API_URL.auth.sign_up
    const body = JSON.stringify(dto)
    const result = await this.httpClient.jsonDo<null>(url, {
      method: 'POST',
      body,
      credentials: 'include',
      resource: url,
      url,
    })
    if (result instanceof AppError) {
      return result
    }

    return new AppSuccess(null, result.message)
  }

  async confirmEmail(params: ConfirmQuery): Promise<void | AppError> {
    const url = API_URL.auth.confirm
    const response = await this.httpClient.jsonDo(url, {
      method: 'POST',
      params,
      resource: url,
      url,
    })
    if (response instanceof AppSuccess) {
      const access_token = response.headers?.get('access_token')
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      } else {
        return new AppError(
          'access token not found',
          Errors.ACCESS_TOKEN_NOT_FOUND,
        )
      }
    } else {
      return response
    }
  }
  async resendConfirmEmail(
    dto: ResendConfirmEmailDto,
  ): Promise<AppSuccess | AppError | AppRateLimitError> {
    const url = API_URL.auth.resendEmail
    const body = JSON.stringify(dto)
    const result = await this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      resource: url,
      url,
    })

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
    const url = API_URL.auth.forgotPass
    const body = JSON.stringify(dto)
    const result = await this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      resource: url,
      url,
    })
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
    const url = API_URL.auth.resetPass
    const body = JSON.stringify(dto)
    return await this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      resource: url,
      url,
    })
  }

  async authorization(dto: SignInDto): Promise<void | AppError> {
    const url = API_URL.auth.sign_in
    const body = JSON.stringify(dto)
    const result = await this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      credentials: 'include',
      resource: url,
      url,
    })

    if (result instanceof AppSuccess) {
      const { access_token } = result.data
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      } else {
        return new AppError(
          'access token not found',
          Errors.ACCESS_TOKEN_NOT_FOUND,
        )
      }
    } else {
      return result
    }
  }
  async getProfile(): Promise<UserProfile | AppError | AppSilentError> {
    const url = API_URL.auth.profile
    const result = await this.httpClient.jsonDo<UserProfile>(url, {
      method: 'POST',
      credentials: 'include',
      resource: url,
      url,
    })
    if (result instanceof AppSuccess) {
      return result.data
    } else {
      if (result.code === Errors.UNAUTHORIZED) {
        return new AppSilentError(result.message)
      }
    }
    return result
  }
  async updateProfile(
    dto: UserProfileUpdateInfo,
  ): Promise<AppError | AppSuccess> {
    const url = API_URL.auth.profile
    const body = JSON.stringify(dto)
    return await this.httpClient.jsonDo(url, {
      method: 'PATCH',
      credentials: 'include',
      resource: url,
      body,
      url,
    })
  }
  async refresh(): Promise<AppSuccess | void> {
    const url = API_URL.auth.refresh
    const result = await this.httpClient.jsonDo(url, {
      method: 'POST',
      credentials: 'include',
      resource: url,
      url,
    })
    if (result instanceof AppSuccess) {
      const { access_token } = result.data
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      } else {
        throw new AppError(
          'access token not found',
          Errors.ACCESS_TOKEN_NOT_FOUND,
        )
      }
    } else {
      throw result
    }
  }
  async logout(): Promise<void | AppError> {
    const url = API_URL.auth.logout
    const result = await this.httpClient.jsonDo(url, {
      method: 'POST',
      credentials: 'include',
      resource: url,
      url,
    })
    if (result instanceof AppSuccess) {
      localStorage.removeItem('access_token')
    } else {
      return result
    }
  }
}
