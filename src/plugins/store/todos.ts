import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

import type { Todo } from '@/types/todo'
import type { WSMessage } from '@/application/services/ws.service'

type InsertData = {
  todos: Todo[]
  total: number
  pages: number
  currentPage: number
}

export const useTodoStore = defineStore('todos', () => {
  const rows: Ref<Todo[]> = ref([])
  const indexID = ref(new Map<number, Todo>())
  const total = ref<number>(0)
  const pages = ref<number>(0)
  let currentPage = 0

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

  async function addAll(data: InsertData) {
    rows.value = data.todos.map((todo) => {
      indexID.value.set(todo.id, todo)
      return todo
    })
    total.value = data.total
    pages.value = data.pages
    currentPage = data.currentPage
  }

  function _update(todo: Todo): void {
    const _todo = indexID.value.get(todo.id)
    if (!_todo) {
      return
    }
    Object.assign(_todo, todo)
  }

  function _create(todo: Todo): void {
    indexID.value.set(todo.id, todo)
    if (currentPage === 1) {
      rows.value.unshift(todo)
    }
    total.value++
  }

  function _delete(id: number): void {
    const _todo = indexID.value.get(id)
    if (!_todo) {
      return
    }
    rows.value = rows.value.filter(({ id }) => id !== _todo.id)
    indexID.value.delete(_todo.id)
  }

  return {
    addAll,
    indexID,
    total,
    pages,
    rows,
    messageHandler,
  }
})
