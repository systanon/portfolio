import { HTTPClient } from '../../lib/http.client'
import type {
  CreateNoteDTO,
  Note,
  ReplaceNoteDTO,
  UpdateNoteDTO,
} from '../../types/notes'
import { AppError } from '../../types/app-errors'
import type { ID } from '../../types/general'
import { errorMsg } from '@/helpers/formatErrorMsg'
import type { GetAllParams, PaginateResult } from '@/types/app.types'
import { getTotalPages } from '@/utils/getTotalPages'
import { API_URL } from '@/constants'

export class NotesService {
  private readonly httpClient: HTTPClient

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient
  }

  async create(dto: CreateNoteDTO): Promise<ID | AppError> {
    const url = API_URL.notes
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo<Note>(url, {
        method: 'POST',
        body,
        credentials: 'include',
        resource: url,
        url,
      })
      const id = Number(result.id)

      return id
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }

  public async getAll(params: GetAllParams): Promise<PaginateResult<Note>> {
    const url = API_URL.notes
    try {
      const response = await this.httpClient.do(url, {
        params,
        credentials: 'include',
      })
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

  async getOne(id: ID): Promise<Note | AppError> {
    const url = `${API_URL.notes}/${id}`
    try {
      const result = await this.httpClient.jsonDo<Note>(url, {
        credentials: 'include',
        resource: url,
        url,
      })
      return result
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }

  async replace(id: ID, dto: ReplaceNoteDTO): Promise<Note | AppError> {
    const url = `${API_URL.notes}/${id}`
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo<Note>(url, {
        method: 'PUT',
        body,
        resource: url,
        credentials: 'include',
        url,
      })
      return result
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }

  async update(id: ID, dto: UpdateNoteDTO): Promise<Note | AppError> {
    const url = `${API_URL.notes}/${id}`
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo<Note>(url, {
        method: 'PATCH',
        body,
        credentials: 'include',
        resource: url,
        url,
      })
      return result
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }

  async delete(id: ID): Promise<Note | AppError> {
    const url = `${API_URL.notes}/${id}`
    try {
      const result = await this.httpClient.jsonDo<Note>(url, {
        method: 'DELETE',
        resource: url,
        credentials: 'include',
        url,
      })
      return result
    } catch (error) {
      return new AppError(errorMsg(error))
    }
  }
}
