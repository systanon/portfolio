import type {
  CreateTodoDTO,
  CreateTodoResponse,
  ReplaceTodoDTO,
  Todo,
  UpdateTodoDTO,
} from '@/types/todo'
import type { TodoService } from './services/todo.service'
import { AppError } from '@/types/app-errors'
import type { AppSuccess, GetAllParams } from '@/types/app.types'
import type { ID } from '@/types/general'
import type { NotificationModule } from './modules/notification.module'

export class TodoApplication {
  private todoService: TodoService
  private notificationModule: NotificationModule

  constructor(
    todoService: TodoService,
    notificationModule: NotificationModule,
  ) {
    this.todoService = todoService
    this.notificationModule = notificationModule
  }

  async create(
    dto: CreateTodoDTO,
  ): Promise<AppSuccess<CreateTodoResponse> | AppError> {
    const response = await this.todoService.create(dto)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async getAll(params: GetAllParams): Promise<AppSuccess<Todo[]> | AppError> {
    const response = await this.todoService.getAll(params)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async getOne(id: ID): Promise<AppSuccess<Todo> | AppError> {
    const response = await this.todoService.getOne(id)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async replace(id: ID, dto: ReplaceTodoDTO): Promise<AppSuccess | AppError> {
    const response = await this.todoService.replace(id, dto)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async update(id: ID, dto: UpdateTodoDTO): Promise<AppSuccess | AppError> {
    const response = await this.todoService.update(id, dto)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async delete(id: ID): Promise<AppSuccess | AppError> {
    const response = await this.todoService.delete(id)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }
}
