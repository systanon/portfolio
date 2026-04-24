import type { HTTPClient } from '@/lib/http.client'
import { AppError, AppRateLimitError } from '@/types/app-errors'
import type {
  AuthResponse,
  ConfirmQuery,
  ForgotPasswordDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from '@/types/auth'
import { API_URL, Errors } from '@/constants'
import { AppSuccess } from '@/types/app.types'

export class AuthService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async registration(dto: SignUpDto): Promise<AppSuccess | AppError> {
    const url = API_URL.auth.sign_up
    const body = JSON.stringify(dto)
    return this.httpClient.jsonDo<null>(url, {
      method: 'POST',
      body,
      credentials: 'include',
      resource: url,
      url,
    })
  }

  async confirmEmail(
    params: ConfirmQuery,
  ): Promise<AppSuccess<AuthResponse> | AppError> {
    const url = API_URL.auth.confirm
    const response = await this.httpClient.jsonDo<AuthResponse>(url, {
      method: 'POST',
      params,
      resource: url,
      url,
    })
    if (response instanceof AppSuccess) {
      const access_token = response.data.access_token
      if (!access_token) {
        return new AppError(
          'access token not found',
          Errors.ACCESS_TOKEN_NOT_FOUND,
        )
      }
    }

    return response
  }

  async resendConfirmEmail(
    dto: ResendConfirmEmailDto,
  ): Promise<AppSuccess | AppError | AppRateLimitError> {
    const url = API_URL.auth.resendEmail
    const body = JSON.stringify(dto)
    const response = await this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      resource: url,
      url,
    })
    if (response instanceof AppError) {
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
    const url = API_URL.auth.forgotPass
    const body = JSON.stringify(dto)
    const response = this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      resource: url,
      url,
    })
    if (response instanceof AppError) {
      if (response.code === Errors.RATE_LIMIT) {
        const retry = response.headers!.get('Retry-After')
        return new AppRateLimitError(response.message, Number(retry))
      }
    }
    return response
  }

  async resetPassword(dto: ResetPasswordDto): Promise<AppSuccess | AppError> {
    const url = API_URL.auth.resetPass
    const body = JSON.stringify(dto)
    return this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      resource: url,
      url,
    })
  }

  async authorization(
    dto: SignInDto,
  ): Promise<AppSuccess<AuthResponse> | AppError> {
    const url = API_URL.auth.sign_in
    const body = JSON.stringify(dto)
    const response = await this.httpClient.jsonDo<AuthResponse>(url, {
      method: 'POST',
      body,
      credentials: 'include',
      resource: url,
      url,
    })
    if (response instanceof AppSuccess) {
      const { access_token } = response.data
      if (!access_token) {
        return new AppError(
          'access token not found',
          Errors.ACCESS_TOKEN_NOT_FOUND,
        )
      }
    }

    return response
  }

  async refresh(): Promise<AppSuccess<AuthResponse> | AppError> {
    const url = API_URL.auth.refresh
    const response = await this.httpClient.jsonDo<AuthResponse>(url, {
      method: 'POST',
      credentials: 'include',
      resource: url,
      url,
    })

    if (response instanceof AppSuccess) {
      const access_token = response.data.access_token
      if (!access_token) {
        return new AppError(
          'access token not found',
          Errors.ACCESS_TOKEN_NOT_FOUND,
        )
      }
    }
    return response
  }

  async logout(): Promise<AppSuccess | AppError> {
    const url = API_URL.auth.logout
    return this.httpClient.jsonDo(url, {
      method: 'POST',
      credentials: 'include',
      resource: url,
      url,
    })
  }
}
