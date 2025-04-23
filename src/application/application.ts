import EventEmitter from 'eventemitter3'
import type { CreateTodoDTO, ReplaceTodoDTO, Todo, UpdateTodoDTO } from '../types/todo'
import type { TodoService } from './services/todo.service'
import type { ID } from '../types/general'
import type { AppError } from '../types/app-errors'

export class Application<
  EventTypes extends EventEmitter.ValidEventTypes = string | symbol,
  EventContext extends any = any
> {
  #ee: EventEmitter = new EventEmitter()
  #todoService: TodoService

  constructor(todoService: TodoService) {
    this.#todoService = todoService
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

  public async createTodo(dto: CreateTodoDTO): Promise<ID | AppError> {
    const res = await this.#todoService.create(dto)
    return res
  }


  public async getAllTodos(params: any): Promise<Array<Todo | AppError>> {
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

}