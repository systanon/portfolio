import { ref, type Ref } from 'vue'
import EventEmitter from 'eventemitter3'
import type { CreateTodoDTO, ReplaceTodoDTO, Todo, UpdateTodoDTO } from '../types/todo'
import type { TodoService } from './services/todo.service'
import type { ID } from '../types/general'
import { AppError } from '../types/app-errors'
import type { AuthService } from './services/auth.service'
import type { SignInDto, SignUpDto, UserProfile } from '@/types/auth'
export class Application<
  EventTypes extends EventEmitter.ValidEventTypes = string | symbol,
  EventContext extends any = any
> {
  #ee: EventEmitter = new EventEmitter()
  #todoService: TodoService
  #authService: AuthService
  #profile: Ref<UserProfile | null> = ref(null)
  #loading: Ref<boolean> = ref(false)
  resolveProfileLoading: (() => void) | null = null;
  profileLoading: Promise<void> = Promise.resolve()

  constructor(todoService: TodoService, authService: AuthService) {
    this.#todoService = todoService
    this.#authService = authService
  }

  public get userProfile() {
    return this.#profile.value
  }

  public get isLodged(): boolean {
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

  public off<T extends EventEmitter.EventNames<EventTypes>
  >(
    event: T,
    fn?: EventEmitter.EventListener<EventTypes, T>,
    context?: EventContext,
    once?: boolean): EventEmitter {
    return this.#ee.off(event, fn, context, once)
  }

  public async signUp(dto: SignUpDto): Promise<void | AppError> {
    const res = await this.#authService.registration(dto)
    if (res instanceof AppError) {
      return res
    }
    await this.getProfile()
  }

  public async signIn(dto: SignInDto): Promise<void | AppError> {
    const res = await this.#authService.authorization(dto)
    if (res instanceof AppError) {
      return res
    }
    await this.getProfile()
  }

  public async getProfile(): Promise<UserProfile | AppError> {
    this.#loading.value = true
    this.profileLoading = new Promise<void>(
      (resolve) => (this.resolveProfileLoading = resolve)
    );
    const res = await this.#authService.getProfile()
    if (res instanceof AppError) {
      this.#profile.value = null
      this.resolveProfileLoading?.()
      this.#ee.emit('unlogged');
    } else {
      this.#profile.value = res
      this.resolveProfileLoading?.()
      this.#ee.emit('logged');
    }

    this.#loading.value = false

    return res
  }

  public async refreshToken(): Promise<void | AppError> {
    const res = await this.#authService.refresh()
    return res
  }

  public async createTodo(dto: CreateTodoDTO): Promise<ID | AppError> {
    const res = await this.#todoService.create(dto)
    return res
  }


  public async getAllTodos(params: any): Promise<Todo[] | AppError> {
    const res = await this.#todoService.getAll(params)
    return res
  }


  public async getOneTodo(id: ID): Promise<Todo | AppError> {
    const res = await this.#todoService.getOne(id)
    return res
  }

  public async replaceTodo(id: ID, dto: ReplaceTodoDTO): Promise<Todo | AppError> {
    const res = await this.#todoService.replace(id, dto)
    return res
  }

  public async updateTodo(id: ID, dto: UpdateTodoDTO): Promise<Todo | AppError> {
    const res = await this.#todoService.update(id, dto)
    return res
  }

  public async deleteTodo(id: ID): Promise<Todo | AppError> {
    const res = await this.#todoService.delete(id)
    return res
  }

  public async run(): Promise<void> {
    await this.getProfile()
  }
}