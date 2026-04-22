import type { HTTPClient } from '@/lib/http.client'
import { AppError } from '@/types/app-errors'
import { API_URL } from '@/constants'

import type { UserProfile, UserProfileUpdateInfo } from '@/types/auth'
import { AppSuccess } from '@/types/app.types'

export class UserService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async getProfile(): Promise<AppSuccess<UserProfile> | AppError> {
    const url = API_URL.auth.profile
    return this.httpClient.jsonDo<UserProfile>(url, {
      method: 'POST',
      credentials: 'include',
      resource: url,
      url,
    })
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
