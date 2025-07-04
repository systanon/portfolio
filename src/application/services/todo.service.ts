import { HTTPClient } from '../../lib/http.client'
import type {
  CreateTodoDTO,
  Todo,
  ReplaceTodoDTO,
  UpdateTodoDTO,
} from '../../types/todo'
import { AppError } from '../../types/app-errors'
import type { ID } from '../../types/general'
import { errorMsg } from '@/helpers/formatErrorMsg'
import type { GetAllParams, PaginateResult } from '@/types/app.types'
import { getTotalPages } from '@/utils/getTotalPages'
import { API_URL } from '@/constants'

export class TodoService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
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
      return new AppError(errorMsg(error))
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
      return new AppError(errorMsg(error))
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
      return new AppError(errorMsg(error))
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
      return new AppError(errorMsg(error))
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
      return new AppError(errorMsg(error))
    }
  }
}
