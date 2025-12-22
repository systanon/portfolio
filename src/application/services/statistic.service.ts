import { HTTPClient } from '@/lib/http.client'
import type { NotificationService } from './notification.service'
import { AppError } from '@/types/app-errors'
import { API_URL } from '@/constants/apiUrl'
import { errorMsg } from '@/helpers/formatErrorMsg'
import type { StatisticDTO } from '@/types/statistic'

export class StatisticService {
  private readonly httpClient: HTTPClient
  private readonly notificationService: NotificationService

  constructor(
    httpClient: HTTPClient,
    notificationService: NotificationService
  ) {
    this.httpClient = httpClient
    this.notificationService = notificationService
  }

  async save(dto: StatisticDTO): Promise<void | AppError> {
    const body = JSON.stringify(dto)
    try {
      const blob = await this.httpClient.blobDo(API_URL.statistic, {
        method: 'POST',
        body,
      })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = 'Serhii_Tustanovskyi_CV.pdf'
      a.click()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      const msg = errorMsg(error)
      this.notificationService.notify('error', msg)
      return new AppError(msg)
    }
  }
}