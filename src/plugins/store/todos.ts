import { inject, ref } from 'vue'
import { defineStore } from 'pinia'

import { AppError } from '@/types/app-errors'
import type { CreateTodoDTO, Todo, UpdateTodoDTO } from '@/types/todo'
import type { GetAllParams } from '@/types/app.types'
import { errorMsg } from '@/helpers/formatErrorMsg'
import type { Application } from '@/application/application'

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])
  const todosMap = ref(new Map<number, Todo>())
  const total = ref<number>(0)
  const pages = ref<number>(1)

  const application = inject('application') as Application

  async function getAll(params: GetAllParams) {
    try {
      const {
        data,
        total: _total,
        pages: _pages,
      } = await application.getAllTodos(params)
      todos.value = data
      todosMap.value = new Map(data.map((todo) => [todo.id, todo]))
      total.value = _total
      pages.value = _pages
    } catch (error) {
      todos.value = []
      todosMap.value = new Map()
      total.value = 0
      pages.value = 1
      application.notify('error', errorMsg(error))
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

  async function completedToggler(
    _id: number,
    payload: { completed: boolean }
  ): Promise<void> {
    const res = await application.updateTodo(_id, payload)
    if (!(res instanceof AppError)) {
      const current = todosMap.value.get(_id)
      if (!current) return

      const updated = { ...current, ...payload }

      todosMap.value.set(_id, updated)
      const index = todos.value.findIndex((t) => t.id === _id)
      if (index !== -1) {
        todos.value[index] = updated
      }
    }
  }

  async function create(payload: CreateTodoDTO): Promise<AppError | void> {
    const res = await application.createTodo(payload)
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
    todos,
    todosMap,
    update,
    create,
    remove,
    total,
    pages,
    completedToggler,
  }
})
