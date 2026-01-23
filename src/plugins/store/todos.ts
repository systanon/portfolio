import { inject, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

import { AppError } from '@/types/app-errors'
import type { CreateTodoDTO, Todo, UpdateTodoDTO } from '@/types/todo'
import type { GetAllParams } from '@/types/app.types'
import { errorMsg } from '@/helpers/formatErrorMsg'
import type { Application } from '@/application/application'
import type { WSMessage } from '@/application/services/ws.service'

export const useTodoStore = defineStore('todos', () => {
  const rows: Ref<Todo[]> = ref([])
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
      rows.value = data.map(todo => {
        todosMap.value.set(todo.id, todo)
        return todo
      })
      total.value = _total
      pages.value = _pages
    } catch (error) {
      rows.value = []
      todosMap.value = new Map()
      total.value = 0
      pages.value = 1
      application.notify('error', errorMsg(error))
    }
  }

  function _update(
    todo: Todo,
  ): void {
    const _todo = todosMap.value.get(todo.id)
    if (!_todo) {
      return
    }
    Object.assign(_todo, todo)
  }

  function _create(
    todo: Todo,
  ): void {
    rows.value.unshift(todo)
    todosMap.value.set(todo.id, todo)

  }

  function _delete(
    id: number,
  ): void {
    const _todo = todosMap.value.get(id)
    if (!_todo) {
      return
    }
    rows.value = rows.value.filter(({ id }) => id !== _todo.id)
    todosMap.value.delete(_todo.id)
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
    rows,
    messageHandler,
  }
})
