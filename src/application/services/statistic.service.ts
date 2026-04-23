import { HTTPClient } from '@/lib/http.client'
import { AppError } from '@/types/app-errors'
import { API_URL } from '@/constants/apiUrl'
import type { StatisticDTO } from '@/types/statistic'
import { AppSuccess } from '@/types/app.types'

export class StatisticService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async save(dto: StatisticDTO): Promise<AppSuccess<Blob> | AppError> {
    const body = JSON.stringify(dto)
    return this.httpClient.blobDo(API_URL.statistic, {
      method: 'POST',
      body,
    })
  }
}
