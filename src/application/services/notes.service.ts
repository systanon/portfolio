import { HTTPClient } from '../../lib/http.client'
import type {
  CreateNoteDTO,
  CreateNoteResponse,
  Note,
  ReplaceNoteDTO,
  UpdateNoteDTO,
} from '../../types/notes'
import { AppError } from '../../types/app-errors'
import type { ID } from '../../types/general'
import {
  AppSuccess,
  type GetAllParams,
  type PaginateResult,
} from '@/types/app.types'
import { getTotalPages } from '@/utils/getTotalPages'
import { API_URL } from '@/constants'

export class NotesService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async create(
    dto: CreateNoteDTO,
  ): Promise<AppSuccess<CreateNoteResponse> | AppError> {
    const url = API_URL.notes
    const body = JSON.stringify(dto)

    return await this.httpClient.jsonDo(url, {
      method: 'POST',
      body,
      credentials: 'include',
      resource: url,
      url,
    })
  }

  public async getAll(
    params: GetAllParams,
  ): Promise<PaginateResult<Note> | AppError> {
    const url = API_URL.notes

    const result = await this.httpClient.jsonDo<Note[]>(url, {
      method: 'GET',
      params,
      resource: url,
      credentials: 'include',
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

  async getOne(id: ID): Promise<Note | AppError> {
    const url = `${API_URL.notes}/${id}`
    const result = await this.httpClient.jsonDo<Note>(url, {
      credentials: 'include',
      resource: url,
      url,
    })

    if (result instanceof AppSuccess) {
      return result.data
    }

    return result
  }

  async replace(id: ID, dto: ReplaceNoteDTO): Promise<AppSuccess | AppError> {
    const url = `${API_URL.notes}/${id}`
    const body = JSON.stringify(dto)

    return await this.httpClient.jsonDo<null>(url, {
      method: 'PUT',
      body,
      resource: url,
      credentials: 'include',
      url,
    })
  }

  async update(id: ID, dto: UpdateNoteDTO): Promise<AppSuccess | AppError> {
    const url = `${API_URL.notes}/${id}`
    const body = JSON.stringify(dto)

    return await this.httpClient.jsonDo<null>(url, {
      method: 'PATCH',
      body,
      credentials: 'include',
      resource: url,
      url,
    })
  }

  async delete(id: ID): Promise<AppSuccess | AppError> {
    const url = `${API_URL.notes}/${id}`
    return await this.httpClient.jsonDo(url, {
      method: 'DELETE',
      resource: url,
      credentials: 'include',
      url,
    })
  }
}
