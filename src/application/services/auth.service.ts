import { errorMsg } from '@/helpers/formatErrorMsg'
import type { HTTPClient } from '@/lib/http.client'
import { AppError } from '@/types/app-errors'
import type {
  AuthResponse,
  SignInDto,
  SignUpDto,
  UserProfile,
  UserProfileUpdateInfo,
} from '@/types/auth'

export class AuthService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async registration(dto: SignUpDto): Promise<void | AppError> {
    const url = '/api/auth/sign-up'
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
  async authorization(dto: SignInDto): Promise<void | AppError> {
    const url = '/api/auth/sign-in'
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
    const url = '/api/auth/profile'
    try {
      const result = await this.httpClient.jsonDo(url, {
        method: 'POST',
        credentials: 'include',
        resource: url,
        url,
      })
      return result.message
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }
  async updateProfile(dto: UserProfileUpdateInfo): Promise<AppError | string> {
    const url = '/api/auth/profile'
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
    const url = '/api/auth/refresh'
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
    const url = '/api/auth/logout'
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
