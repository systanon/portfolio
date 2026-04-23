import { ref, type Ref } from 'vue'
import EventEmitter from 'eventemitter3'
import { AppError } from '../types/app-errors'

import type {
  NotificationService,
  NotificationType,
} from './services/notification.service'
import type { StatisticService } from './services/statistic.service'
import type { StatisticDTO } from '@/types/statistic'
import type { AuthApplication } from './auth.application'
import type { UserApplication } from './user.application'
import type { TodoApplication } from './todo.application'
import type { NoteApplication } from './note.application'

export class Application<
  EventTypes extends EventEmitter.ValidEventTypes = string | symbol,
  EventContext extends any = any,
> {
  #ee: EventEmitter = new EventEmitter()
  public todoApplication: TodoApplication
  public authApplication: AuthApplication
  public userApplication: UserApplication
  public noteApplication: NoteApplication
  #notificationService: NotificationService
  #loading: Ref<boolean> = ref(false)
  private _pageTitle: Ref<string | null> = ref(null)
  private statisticService: StatisticService

  constructor(
    authApplication: AuthApplication,
    userApplication: UserApplication,
    todoApplication: TodoApplication,
    noteApplication: NoteApplication,
    notificationService: NotificationService,
    statisticService: StatisticService,
  ) {
    this.authApplication = authApplication
    this.userApplication = userApplication
    this.todoApplication = todoApplication
    this.noteApplication = noteApplication
    this.#notificationService = notificationService
    this.statisticService = statisticService
  }

  public get notifications() {
    return this.#notificationService.notifications.value
  }

  public get loading(): boolean {
    return this.#loading.value
  }

  public get pageTitle() {
    return this._pageTitle.value
  }

  public setPageTitle(title: string) {
    this._pageTitle.value = title
  }

  public clearPageTitle() {
    this._pageTitle.value = null
  }

  public on<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn: EventEmitter.EventListener<EventTypes, T>,
    context?: EventContext,
  ): EventEmitter {
    return this.#ee.on(event, fn, context)
  }

  public off<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn?: EventEmitter.EventListener<EventTypes, T>,
    context?: EventContext,
    once?: boolean,
  ): EventEmitter {
    return this.#ee.off(event, fn, context, once)
  }

  public async init() {
    this.userApplication.getProfile()
  }

  public async saveStatistic(dto: StatisticDTO): Promise<any | AppError> {
    const res = await this.statisticService.save(dto)
    return res
  }

  public notify(type: NotificationType, message: string): void {
    this.#notificationService.notify(type, message)
  }
}
