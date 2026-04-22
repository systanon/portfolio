import type { AppSuccess, GetAllParams } from '@/types/app.types'
import type { NoteService } from './services/note.service'
import type {
  CreateNoteDTO,
  CreateNoteResponse,
  Note,
  UpdateNoteDTO,
} from '@/types/notes'
import type { AppError } from '@/types/app-errors'
import type { ID } from '@/types/general'

export class NoteApplication {
  private notesService: NoteService

  constructor(notesService: NoteService) {
    this.notesService = notesService
  }

  async create(
    dto: CreateNoteDTO,
  ): Promise<AppSuccess<CreateNoteResponse> | AppError> {
    return this.notesService.create(dto)
  }

  async getAll(params: GetAllParams): Promise<AppSuccess<Note[]> | AppError> {
    return this.notesService.getAll(params)
  }

  async getOne(id: ID): Promise<AppSuccess<Note> | AppError> {
    return this.notesService.getOne(id)
  }

  async update(id: ID, dto: UpdateNoteDTO): Promise<AppSuccess | AppError> {
    return this.notesService.update(id, dto)
  }

  async delete(id: ID): Promise<AppSuccess | AppError> {
    return this.notesService.delete(id)
  }
}
