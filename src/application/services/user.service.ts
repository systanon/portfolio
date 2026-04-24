import type { HTTPClient } from '@/lib/http.client'
import { AppError, AppSilentError } from '@/types/app-errors'
import { API_URL, Errors } from '@/constants'

import type { UserProfile, UserProfileUpdateInfo } from '@/types/auth'
import { AppSuccess } from '@/types/app.types'

export class UserService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async getProfile(): Promise<
    AppSuccess<UserProfile> | AppError | AppSilentError
  > {
    const url = API_URL.auth.profile
    const response = await this.httpClient.jsonDo<UserProfile>(url, {
      method: 'POST',
      credentials: 'include',
      resource: url,
      url,
    })
    if (response instanceof AppError) {
      if (response.code === Errors.UNAUTHORIZED) {
        return new AppSilentError(response.message)
      }
    }

    return response
  }

  async updateProfile(
    dto: UserProfileUpdateInfo,
  ): Promise<AppError | AppSuccess> {
    const url = API_URL.auth.profile
    const body = JSON.stringify(dto)
    return this.httpClient.jsonDo(url, {
      method: 'PATCH',
      credentials: 'include',
      resource: url,
      body,
      url,
    })
  }
}
