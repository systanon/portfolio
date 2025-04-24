import { ref } from 'vue'
import { defineStore } from 'pinia'

import { application } from '../../application'
import { AppError } from '../../types/app-errors';
import type { Todo } from '../../types/todo';


export const useTodoStore = defineStore('todos', () => {

  const todos = ref<Todo[]>([])

  async function init(params: any) {
    const res = await application.getAllTodos(params)
    if (res instanceof AppError) {
      todos.value = []
    } else {
      todos.value = res
    }
  }
  
  return { init, todos }
})
