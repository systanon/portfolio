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
  #profile: UserProfile | null = null
  #isLodged: boolean = false
  #isInitApplication: Ref<boolean> = ref(false)

  constructor(todoService: TodoService, authService: AuthService) {
    this.#todoService = todoService
    this.#authService = authService
  }

  public get userProfile() {
    return this.#profile
  }

  public get isLodged(): boolean {
    return this.#isLodged
  }

  public get isInitApplication(): boolean {
    return this.#isInitApplication.value
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
    return res
  }

  public async signIn(dto: SignInDto): Promise<void | AppError> {
    const res = await this.#authService.authorization(dto)
    return res
  }

  public async getProfile(): Promise<UserProfile | AppError> {
    const access_token = localStorage.getItem('access_token') ?? ""
    const res = await this.#authService.getProfile({ access_token })
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
    const res = await this.getProfile()
    this.#isInitApplication.value = true
    if (!(res instanceof AppError)) {
      this.#profile = res
      this.#isLodged = true
    }
  }
}