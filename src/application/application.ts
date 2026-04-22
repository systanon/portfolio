import { ref, type Ref } from 'vue'
import EventEmitter from 'eventemitter3'
import type { ID } from '../types/general'
import { AppError } from '../types/app-errors'
import type {
  AppSuccess,
  GetAllParams,
  PaginateResult,
} from '@/types/app.types'
import type { NotesService } from './services/notes.service'
import type {
  CreateNoteDTO,
  Note,
  ReplaceNoteDTO,
  UpdateNoteDTO,
} from '@/types/notes'
import type {
  NotificationService,
  NotificationType,
} from './services/notification.service'
import type { StatisticService } from './services/statistic.service'
import type { StatisticDTO } from '@/types/statistic'
import type { AuthApplication } from './auth.application'
import type { UserApplication } from './user.application'
import type { TodoApplication } from './todo.application'

export class Application<
  EventTypes extends EventEmitter.ValidEventTypes = string | symbol,
  EventContext extends any = any,
> {
  #ee: EventEmitter = new EventEmitter()
  public todoApplication: TodoApplication
  #noteService: NotesService
  public authApplication: AuthApplication
  public userApplication: UserApplication
  #notificationService: NotificationService
  #loading: Ref<boolean> = ref(false)
  private _pageTitle: Ref<string | null> = ref(null)
  private statisticService: StatisticService

  constructor(
    authApplication: AuthApplication,
    userApplication: UserApplication,
    todoApplication: TodoApplication,
    notesService: NotesService,
    notificationService: NotificationService,
    statisticService: StatisticService,
  ) {
    this.authApplication = authApplication
    this.userApplication = userApplication
    this.todoApplication = todoApplication
    this.#noteService = notesService
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

  public async getAllNotes(
    params: GetAllParams,
  ): Promise<PaginateResult<Note> | AppError> {
    this.#loading.value = true
    const res = await this.#noteService.getAll(params)
    this.#loading.value = false
    return res
  }

  public async createNote(dto: CreateNoteDTO): Promise<AppSuccess | AppError> {
    const res = await this.#noteService.create(dto)
    return res
  }

  public async getOneNote(id: ID): Promise<Note | AppError> {
    const res = await this.#noteService.getOne(id)
    return res
  }

  public async replaceNote(
    id: ID,
    dto: ReplaceNoteDTO,
  ): Promise<AppSuccess | AppError> {
    const res = await this.#noteService.replace(id, dto)
    return res
  }

  public async updateNote(
    id: ID,
    dto: UpdateNoteDTO,
  ): Promise<AppSuccess | AppError> {
    const res = await this.#noteService.update(id, dto)
    return res
  }

  public async deleteNote(id: ID): Promise<AppSuccess | AppError> {
    const res = await this.#noteService.delete(id)
    return res
  }

  public async saveStatistic(dto: StatisticDTO): Promise<any | AppError> {
    const res = await this.statisticService.save(dto)
    return res
  }

  public notify(type: NotificationType, message: string): void {
    this.#notificationService.notify(type, message)
  }
}
