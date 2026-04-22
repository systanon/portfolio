import type {
  CreateTodoDTO,
  CreateTodoResponse,
  ReplaceTodoDTO,
  Todo,
  UpdateTodoDTO,
} from '@/types/todo'
import type { TodoService } from './services/todo.service'
import type { AppError } from '@/types/app-errors'
import type { AppSuccess, GetAllParams } from '@/types/app.types'
import type { ID } from '@/types/general'

export class TodoApplication {
  private todoService: TodoService

  constructor(todoService: TodoService) {
    this.todoService = todoService
  }

  async create(
    dto: CreateTodoDTO,
  ): Promise<AppSuccess<CreateTodoResponse> | AppError> {
    return this.todoService.create(dto)
  }

  async getAll(params: GetAllParams): Promise<AppSuccess<Todo[]> | AppError> {
    return this.todoService.getAll(params)
  }

  async getOne(id: ID): Promise<AppSuccess<Todo> | AppError> {
    return this.todoService.getOne(id)
  }

  async replace(id: ID, dto: ReplaceTodoDTO): Promise<AppSuccess | AppError> {
    return this.todoService.replace(id, dto)
  }

  async update(id: ID, dto: UpdateTodoDTO): Promise<AppSuccess | AppError> {
    return this.todoService.update(id, dto)
  }

  async delete(id: ID): Promise<AppSuccess | AppError> {
    return this.todoService.delete(id)
  }
}
