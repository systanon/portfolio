import { HTTPClient } from '@/lib/http.client'
import type {
  CreateTodoDTO,
  Todo,
  ReplaceTodoDTO,
  UpdateTodoDTO,
} from '@/types/todo'
import { AppError } from '@/types/app-errors'
import type { ID } from '@/types/general'
import { errorMsg } from '@/helpers/formatErrorMsg'
import type { GetAllParams, PaginateResult } from '@/types/app.types'
import { getTotalPages } from '@/utils/getTotalPages'
import { API_URL } from '@/constants'
import type { NotificationService } from './notification.service'

export class TodoService {
  private readonly httpClient: HTTPClient
  private readonly notificationService: NotificationService

  constructor(
    httpClient: HTTPClient,
    notificationService: NotificationService
  ) {
    this.httpClient = httpClient
    this.notificationService = notificationService
  }

  async create(dto: CreateTodoDTO): Promise<ID | AppError> {
    const url = API_URL.todos
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, {
        method: 'POST',
        body,
        resource: url,
        url,
      })
      const id = Number(result.id)

      return id
    } catch (error) {
      const msg = errorMsg(error)
      this.notificationService.notify('error', msg)
      return new AppError(msg)
    }
  }

  async getAll(params: GetAllParams): Promise<PaginateResult<Todo>> {
    const url = API_URL.todos
    try {
      const response = await this.httpClient.do(url, { params })
      if (response.ok) {
        const data = await response.json()
        return {
          ...getTotalPages(response.headers),
          data,
        }
      }
      return Promise.reject(response)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getOne(id: ID): Promise<Todo | AppError> {
    const url = `${API_URL.todos}/${id}`
    try {
      const result = await this.httpClient.jsonDo<Todo>(url)
      return result
    } catch (error) {
      const msg = errorMsg(error)
      this.notificationService.notify('error', msg)
      return new AppError(msg)
    }
  }

  async replace(id: ID, dto: ReplaceTodoDTO): Promise<Todo | AppError> {
    const url = `${API_URL.todos}/${id}`
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, {
        method: 'PUT',
        body,
        resource: url,
        url,
      })
      return result
    } catch (error) {
      const msg = errorMsg(error)
      this.notificationService.notify('error', msg)
      return new AppError(msg)
    }
  }

  async update(id: ID, dto: UpdateTodoDTO): Promise<Todo | AppError> {
    const url = `${API_URL.todos}/${id}`
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, {
        method: 'PATCH',
        body,
        resource: url,
        url,
      })
      return result
    } catch (error) {
      const msg = errorMsg(error)
      this.notificationService.notify('error', msg)
      return new AppError(msg)
    }
  }

  async delete(id: ID): Promise<Todo | AppError> {
    const url = `${API_URL.todos}/${id}`
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, {
        method: 'DELETE',
        resource: url,
        url,
      })
      return result
    } catch (error) {
      const msg = errorMsg(error)
      this.notificationService.notify('error', msg)
      return new AppError(msg)
    }
  }
}
