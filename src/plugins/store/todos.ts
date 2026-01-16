import { inject, ref } from 'vue'
import { defineStore } from 'pinia'

import { AppError } from '@/types/app-errors'
import type { CreateTodoDTO, Todo, UpdateTodoDTO } from '@/types/todo'
import type { GetAllParams } from '@/types/app.types'
import { errorMsg } from '@/helpers/formatErrorMsg'
import type { Application } from '@/application/application'
import type { WSService } from '@/application/services/ws.service'

export const useTodoStore = defineStore('todos', () => {
  const todosMap = ref(new Map<number, Todo>())
  const total = ref<number>(0)
  const pages = ref<number>(1)
  const unsubscribes: (() => void)[] = []

  const application = inject('application') as Application

  function connectWS(wsService: WSService) {
    unsubscribes.push(
      wsService.subscribe('create', _update),
      wsService.subscribe('update', _insert),
      wsService.subscribe('delete', _delete),
    )
  }

  function disconnectWS() {
    unsubscribes.forEach(fn => fn())
    unsubscribes.length = 0
  }

  async function getAll(params: GetAllParams) {
    try {
      const {
        data,
        total: _total,
        pages: _pages,
      } = await application.getAllTodos(params)
      todosMap.value = new Map(data.map((todo) => [todo.id, todo]))
      total.value = _total
      pages.value = _pages
    } catch (error) {
      todosMap.value = new Map()
      total.value = 0
      pages.value = 1
      application.notify('error', errorMsg(error))
    }
  }

  function _update(
    data: any,
  ): void {
    todosMap.value.set(data.id, data)
  }

  function _insert(
    data: any,
  ): void {
    todosMap.value.set(data.id, data)
  }

  function _delete(
    id: number,
  ): void {
    todosMap.value.delete(id)
  }

  async function create(payload: CreateTodoDTO): Promise<AppError | void> {
    const res = await application.createTodo(payload)
    if (res instanceof AppError) {
      return res
    }
  }

  async function update(
    _id: number,
    payload: UpdateTodoDTO
  ): Promise<AppError | void> {
    const res = await application.updateTodo(_id, payload)
    if (res instanceof AppError) {
      return res
    }
  }

  async function remove(id: number): Promise<AppError | void> {
    const res = await application.deleteTodo(id)
    if (res instanceof AppError) {
      return res
    }
  }

  return {
    getAll,
    todosMap,
    update,
    create,
    remove,
    total,
    pages,
    connectWS,
    disconnectWS
  }
})
