import { inject, ref } from 'vue'
import { defineStore } from 'pinia'

import { AppError } from '@/types/app-errors'
import type { CreateTodoDTO, Todo, UpdateTodoDTO } from '@/types/todo'
import type { GetAllParams } from '@/types/app.types'
import { errorMsg } from '@/helpers/formatErrorMsg'
import type { Application } from '@/application/application'
import type { WSMessage } from '@/application/services/ws.service'

export const useTodoStore = defineStore('todos', () => {
  const todosMap = ref(new Map<number, Todo>())
  const total = ref<number>(0)
  const pages = ref<number>(1)

  const application = inject('application') as Application

  function messageHandler(message: WSMessage) {
    switch (message.event) {
      case 'create':
        _create(message.data)
        break
      case 'update':
        _update(message.data)
        break
      case 'delete':
        _delete(message.data)
        break
    }
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
    data: Todo,
  ): void {
    const oldTodo = todosMap.value.get(data.id)
    oldTodo && todosMap.value.set(data.id, Object.assign(oldTodo, data))
  }

  function _create(
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
    messageHandler,
  }
})
