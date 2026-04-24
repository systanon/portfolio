import type { AppSuccess, GetAllParams } from '@/types/app.types'
import type { NoteService } from './services/note.service'
import type {
  CreateNoteDTO,
  CreateNoteResponse,
  Note,
  UpdateNoteDTO,
} from '@/types/notes'
import { AppError } from '@/types/app-errors'
import type { ID } from '@/types/general'
import type { NotificationModule } from './modules/notification.module'

export class NoteApplication {
  private notesService: NoteService
  private notificationModule: NotificationModule

  constructor(
    notesService: NoteService,
    notificationModule: NotificationModule,
  ) {
    this.notesService = notesService
    this.notificationModule = notificationModule
  }

  async create(
    dto: CreateNoteDTO,
  ): Promise<AppSuccess<CreateNoteResponse> | AppError> {
    const response = await this.notesService.create(dto)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async getAll(params: GetAllParams): Promise<AppSuccess<Note[]> | AppError> {
    const response = await this.notesService.getAll(params)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async getOne(id: ID): Promise<AppSuccess<Note> | AppError> {
    const response = await this.notesService.getOne(id)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async update(id: ID, dto: UpdateNoteDTO): Promise<AppSuccess | AppError> {
    const response = await this.notesService.update(id, dto)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }

  async delete(id: ID): Promise<AppSuccess | AppError> {
    const response = await this.notesService.delete(id)
    if (response instanceof AppError) {
      this.notificationModule.notify('error', response.message)
    }
    return response
  }
}
