import { application, wsService } from '@/application'
import { useTodoStore } from '@/plugins/store/todo'
import { AppError } from '@/types/app-errors'
import { AppSuccess, type GetAllParams } from '@/types/app.types'
import type { CreateTodoDTO, UpdateTodoDTO } from '@/types/todo'
import { getTotalPages } from '@/utils/getTotalPages'
import { onUnmounted } from 'vue'

export function useTodo() {
  const { addAll, messageHandler } = useTodoStore()
  const unsubscribe = wsService.subscribe('todos', messageHandler)
  const { todoApplication } = application

  const getAll = async (params: GetAllParams) => {
    const response = await todoApplication.getAll(params)

    if (response instanceof AppSuccess) {
      const data = {
        ...getTotalPages(response.headers),
        todos: response.data,
        currentPage: params.page ?? 1,
      }
      addAll(data)
    }
  }

  async function create(payload: CreateTodoDTO): Promise<AppError | void> {
    const res = await todoApplication.create(payload)
    if (res instanceof AppError) {
      return res
    }
  }

  async function update(
    _id: number,
    payload: UpdateTodoDTO,
  ): Promise<AppError | void> {
    const res = await todoApplication.update(_id, payload)
    if (res instanceof AppError) {
      return res
    }
  }

  async function remove(id: number): Promise<AppError | void> {
    const res = await todoApplication.delete(id)
    if (res instanceof AppError) {
      return res
    }
  }

  async function getOne(id: number) {
    return todoApplication.getOne(id)
  }

  onUnmounted(() => {
    unsubscribe()
  })

  return { getAll, create, update, remove, getOne }
}
