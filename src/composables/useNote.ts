import { application, wSService } from '@/application'
import { useNoteStore } from '@/plugins/store/note'
import { AppError } from '@/types/app-errors'
import { AppSuccess, type GetAllParams } from '@/types/app.types'
import type { CreateNoteDTO, UpdateNoteDTO } from '@/types/notes'
import { getTotalPages } from '@/utils/getTotalPages'
import { onUnmounted } from 'vue'

export function useNote() {
  const { addAll, messageHandler } = useNoteStore()
  const unsubscribe = wSService.subscribe('notes', messageHandler)
  const { noteApplication } = application

  const getAll = async (params: GetAllParams) => {
    const response = await noteApplication.getAll(params)
    if (response instanceof AppSuccess) {
      const data = {
        ...getTotalPages(response.headers),
        notes: response.data,
        currentPage: params.page ?? 1,
      }
      addAll(data)
    }
  }

  const update = async (_id: number, payload: UpdateNoteDTO) => {
    const res = await noteApplication.update(_id, payload)
    if (res instanceof AppError) {
      return res
    }
  }

  const create = async (payload: CreateNoteDTO) => {
    const res = await noteApplication.create(payload)
    if (res instanceof AppError) {
      return res
    }
  }

  const remove = async (id: number) => {
    const res = await noteApplication.delete(id)
    if (res instanceof AppError) {
      return res
    }
  }

  onUnmounted(() => {
    unsubscribe()
  })

  return {
    update,
    create,
    remove,
    getAll,
  }
}
