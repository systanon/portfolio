import type { StatisticDTO } from '@/types/app.types'
import type { StatisticService } from './services/statistic.service'
import type { NotificationModule } from './modules/notification.module'
import { AppError } from '@/types/app-errors'

export class StatisticApplication {
  private statisticService: StatisticService
  private notificationModule: NotificationModule

  constructor(
    statisticService: StatisticService,
    notificationMoNotificationModule: NotificationModule,
  ) {
    this.statisticService = statisticService
    this.notificationModule = notificationMoNotificationModule
  }

  async getCV(dto: StatisticDTO) {
    const response = await this.statisticService.save(dto)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
  }
}
