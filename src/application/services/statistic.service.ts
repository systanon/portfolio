import { HTTPClient } from '@/lib/http.client'
import { AppError } from '@/types/app-errors'
import { API_URL } from '@/constants/apiUrl'
import type { StatisticDTO } from '@/types/statistic'

export class StatisticService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async save(dto: StatisticDTO): Promise<void | AppError> {
    const body = JSON.stringify(dto)
    const blob = await this.httpClient.blobDo(API_URL.statistic, {
      method: 'POST',
      body,
    })

    if (blob instanceof AppError) {
      return blob
    }

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = 'Serhii_Tustanovskyi_CV.pdf'
    a.click()

    window.URL.revokeObjectURL(url)
  }
}
