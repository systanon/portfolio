import { ref, type Ref } from 'vue'
import EventEmitter from 'eventemitter3'
import type {
  CreateTodoDTO,
  ReplaceTodoDTO,
  Todo,
  UpdateTodoDTO,
} from '../types/todo'
import type { TodoService } from './services/todo.service'
import type { ID } from '../types/general'
import { AppError } from '../types/app-errors'
import type { AuthService } from './services/auth.service'
import type {
  ConfirmQuery,
  SignInDto,
  SignUpDto,
  UserProfile,
  UserProfileUpdateInfo,
} from '@/types/auth'
import type { GetAllParams, PaginateResult } from '@/types/app.types'
import type { NotesService } from './services/notes.service'
import type {
  CreateNoteDTO,
  Note,
  ReplaceNoteDTO,
  UpdateNoteDTO,
} from '@/types/notes'
import type { NotificationService } from './services/notification.service'
export class Application<
  EventTypes extends EventEmitter.ValidEventTypes = string | symbol,
  EventContext extends any = any
> {
  #ee: EventEmitter = new EventEmitter()
  #todoService: TodoService
  #noteService: NotesService
  #authService: AuthService
  #notificationService: NotificationService
  #profile: Ref<UserProfile | null> = ref(null)
  #loading: Ref<boolean> = ref(false)
  resolveProfileLoading: (() => void) | null = null
  profileLoading: Promise<void> = Promise.resolve()

  constructor(
    todoService: TodoService,
    authService: AuthService,
    notesService: NotesService,
    notificationService: NotificationService
  ) {
    this.#todoService = todoService
    this.#authService = authService
    this.#noteService = notesService
    this.#notificationService = notificationService
  }

  private clearProfile() {
    this.#profile.value = null
  }

  public get userProfile() {
    return this.#profile.value
  }
  public get notifications() {
    return this.#notificationService.notifications.value
  }

  public get isLogged(): boolean {
    return this.#profile.value !== null
  }

  public get loading(): boolean {
    return this.#loading.value
  }

  public on<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn: EventEmitter.EventListener<EventTypes, T>,
    context?: EventContext
  ): EventEmitter {
    return this.#ee.on(event, fn, context)
  }

  public off<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn?: EventEmitter.EventListener<EventTypes, T>,
    context?: EventContext,
    once?: boolean
  ): EventEmitter {
    return this.#ee.off(event, fn, context, once)
  }

  public async signUp(dto: SignUpDto): Promise<void | AppError> {
    this.#loading.value = true
    const res = await this.#authService.registration(dto)
    if (res instanceof AppError) {
      this.#notificationService.notify('error', res.message)
      return res
    }
    this.#loading.value = false
    this.#notificationService.notify('success', res.message)
  }

  public async confirmEmail(params: ConfirmQuery): Promise<void> {
    this.#loading.value = true
    const res = await this.#authService.confirmEmail(params)
    if (res instanceof AppError) {
      this.#loading.value = false
      this.#notificationService.notify('error', res.message)
      return
    }
    await this.getProfile()
  }

  public async logout(): Promise<void | AppError> {
    const res = await this.#authService.logout()
    if (res instanceof AppError) {
      this.#notificationService.notify('error', res.message)
      return res
    }
    this.clearProfile()
    this.#ee.emit('unlogged')
  }

  public async signIn(dto: SignInDto): Promise<void | AppError> {
    const res = await this.#authService.authorization(dto)
    if (res instanceof AppError) {
      this.#notificationService.notify('error', res.message)
      return res
    }
    await this.getProfile()
  }

  public async getProfile(): Promise<UserProfile | AppError> {
    this.#loading.value = true
    this.profileLoading = new Promise<void>(
      (resolve) => (this.resolveProfileLoading = resolve)
    )
    const res = await this.#authService.getProfile()
    if (res instanceof AppError) {
      this.#profile.value = null
      this.resolveProfileLoading?.()
      this.#notificationService.notify('error', res.message)
      this.#ee.emit('unlogged')
    } else {
      this.#profile.value = res
      this.resolveProfileLoading?.()
      this.#ee.emit('logged')
    }

    this.#loading.value = false

    return res
  }

  public async updateProfileInfo(
    dto: UserProfileUpdateInfo
  ): Promise<AppError | string> {
    return await this.#authService.updateProfile(dto)
  }

  public async refreshToken(): Promise<void | AppError> {
    const res = await this.#authService.refresh()
    return res
  }

  public async createTodo(dto: CreateTodoDTO): Promise<ID | AppError> {
    const res = await this.#todoService.create(dto)
    return res
  }

  public async getAllTodos(
    params: GetAllParams
  ): Promise<PaginateResult<Todo>> {
    try {
      return await this.#todoService.getAll(params)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  public async getOneTodo(id: ID): Promise<Todo | AppError> {
    const res = await this.#todoService.getOne(id)
    return res
  }

  public async replaceTodo(
    id: ID,
    dto: ReplaceTodoDTO
  ): Promise<Todo | AppError> {
    const res = await this.#todoService.replace(id, dto)
    return res
  }

  public async updateTodo(
    id: ID,
    dto: UpdateTodoDTO
  ): Promise<Todo | AppError> {
    const res = await this.#todoService.update(id, dto)
    return res
  }

  public async deleteTodo(id: ID): Promise<Todo | AppError> {
    const res = await this.#todoService.delete(id)
    return res
  }

  public async getAllNotes(
    params: GetAllParams
  ): Promise<PaginateResult<Note>> {
    try {
      return await this.#noteService.getAll(params)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  public async createNote(dto: CreateNoteDTO): Promise<ID | AppError> {
    const res = await this.#noteService.create(dto)
    return res
  }

  public async getOneNote(id: ID): Promise<Note | AppError> {
    const res = await this.#noteService.getOne(id)
    return res
  }

  public async replaceNote(
    id: ID,
    dto: ReplaceNoteDTO
  ): Promise<Note | AppError> {
    const res = await this.#noteService.replace(id, dto)
    return res
  }

  public async updateNote(
    id: ID,
    dto: UpdateNoteDTO
  ): Promise<Note | AppError> {
    const res = await this.#noteService.update(id, dto)
    return res
  }

  public async deleteNote(id: ID): Promise<Note | AppError> {
    const res = await this.#noteService.delete(id)
    return res
  }

  public async run(): Promise<void> {
    await this.getProfile()
  }
}
