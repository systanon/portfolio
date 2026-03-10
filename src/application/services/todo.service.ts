import { HTTPClient } from '@/lib/http.client'
import type {
  CreateTodoDTO,
  Todo,
  ReplaceTodoDTO,
  UpdateTodoDTO,
  CreateTodoResponse,
} from '@/types/todo'
import { AppError } from '@/types/app-errors'
import type { ID } from '@/types/general'
import {
  AppSuccess,
  type GetAllParams,
  type PaginateResult,
} from '@/types/app.types'
import { getTotalPages } from '@/utils/getTotalPages'
import { API_URL } from '@/constants'

export class TodoService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async create(
    dto: CreateTodoDTO,
  ): Promise<AppSuccess<CreateTodoResponse> | AppError> {
    const url = API_URL.todos
    const body = JSON.stringify(dto)
    return await this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      resource: url,
      url,
    })
  }

  async getAll(params: GetAllParams): Promise<PaginateResult<Todo> | AppError> {
    const url = API_URL.todos
    const result = await this.httpClient.jsonDo<Todo[]>(url, {
      method: 'GET',
      params,
      resource: url,
      url,
    })
    if (result instanceof AppSuccess) {
      return {
        ...getTotalPages(result.headers),
        data: result.data,
      }
    }
    return result
  }

  async getOne(id: ID): Promise<Todo | AppError> {
    const url = `${API_URL.todos}/${id}`
    const response = await this.httpClient.jsonDo<Todo>(url, {
      resource: url,
      url,
    })

    if (response instanceof AppSuccess) {
      return response.data
    }

    return response
  }

  async replace(id: ID, dto: ReplaceTodoDTO): Promise<AppSuccess | AppError> {
    const url = `${API_URL.todos}/${id}`
    const body = JSON.stringify(dto)
    return await this.httpClient.jsonDo<Todo>(url, {
      method: 'PUT',
      body,
      resource: url,
      url,
    })
  }

  async update(id: ID, dto: UpdateTodoDTO): Promise<AppSuccess | AppError> {
    const url = `${API_URL.todos}/${id}`
    const body = JSON.stringify(dto)
    return await this.httpClient.jsonDo<Todo>(url, {
      method: 'PATCH',
      body,
      resource: url,
      url,
    })
  }

  async delete(id: ID): Promise<AppSuccess | AppError> {
    const url = `${API_URL.todos}/${id}`
    return await this.httpClient.jsonDo<Todo>(url, {
      method: 'DELETE',
      resource: url,
      url,
    })
  }
}
