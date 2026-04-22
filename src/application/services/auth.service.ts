import type { HTTPClient } from '@/lib/http.client'
import { AppError } from '@/types/app-errors'
import type {
  AuthResponse,
  ConfirmQuery,
  ForgotPasswordDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from '@/types/auth'
import { API_URL } from '@/constants'
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
    return this.httpClient.jsonDo<AuthResponse>(url, {
      method: 'POST',
      params,
      resource: url,
      url,
    })
  }

  async resendConfirmEmail(
    dto: ResendConfirmEmailDto,
  ): Promise<AppSuccess | AppError> {
    const url = API_URL.auth.resendEmail
    const body = JSON.stringify(dto)
    return this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      resource: url,
      url,
    })
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<AppSuccess | AppError> {
    const url = API_URL.auth.forgotPass
    const body = JSON.stringify(dto)
    return this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      resource: url,
      url,
    })
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
    return this.httpClient.jsonDo<AuthResponse>(url, {
      method: 'POST',
      body,
      credentials: 'include',
      resource: url,
      url,
    })
  }

  async refresh(): Promise<AppSuccess<AuthResponse> | AppError> {
    const url = API_URL.auth.refresh
    return this.httpClient.jsonDo<AuthResponse>(url, {
      method: 'POST',
      credentials: 'include',
      resource: url,
      url,
    })
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
