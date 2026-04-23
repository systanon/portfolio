import { AppSuccess, type StatisticDTO } from '@/types/app.types'
import type { StatisticService } from './services/statistic.service'
import type { NotificationModule } from './modules/notification.module'
import { AppError } from '@/types/app-errors'

export class StatisticApplication {
  private statisticService: StatisticService
  private notificationModule: NotificationModule

  constructor(
    statisticService: StatisticService,
    notificationModule: NotificationModule,
  ) {
    this.statisticService = statisticService
    this.notificationModule = notificationModule
  }

  async getCV(dto: StatisticDTO): Promise<AppSuccess | AppError> {
    const response = await this.statisticService.save(dto)
    if (response instanceof AppSuccess) {
      const url = window.URL.createObjectURL(response.data)
      const a = document.createElement('a')

      a.href = url
      a.download = 'Serhii_Tustanovskyi_CV.pdf'
      a.click()

      window.URL.revokeObjectURL(url)
    } else {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }
}
