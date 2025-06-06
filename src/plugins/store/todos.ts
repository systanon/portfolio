import { ref } from 'vue'
import { defineStore } from 'pinia'

import { application } from '../../application'
import { AppError } from '../../types/app-errors';
import type { CreateTodoDTO, Todo, UpdateTodoDTO } from '../../types/todo';


export const useTodoStore = defineStore('todos', () => {

  const todos = ref<Todo[]>([])
  const todosMap = ref(new Map<number, Todo>())

  async function init(params: any) {
    const res = await application.getAllTodos(params)
    if (res instanceof AppError) {
      todos.value = []
    } else {
      todos.value = res
      todosMap.value = new Map(res.map(todo => [todo.id, todo]))
    }
  }

  async function update(_id: number, payload: UpdateTodoDTO) {
    const _payload = { ...payload }
    const res = await application.updateTodo(_id, payload)
    if (res instanceof AppError) {
      console.warn(res)
    } else {
      const todo = todos.value.find(t => t.id === _id)
      if (todo) Object.assign(todo, _payload)

      const mapTodo = todosMap.value.get(_id)
      mapTodo && Object.assign(mapTodo, _payload)
    }
  }

  async function create(payload: CreateTodoDTO) {
    const res = await application.createTodo(payload)
    if (res instanceof AppError) {
      console.warn(res)
    } else {
      const todo = await application.getOneTodo(res)
      if (todo instanceof AppError) {
        console.warn(res)
      } else {
        todos.value.push(todo)
        todosMap.value.set(todo.id, todo)
      }
    }
  }

  async function remove(id: number) {
    const res = await application.deleteTodo(id)
    if (res instanceof AppError) {
      console.warn(res)
    } else {
      const index = todos.value.findIndex((todo) => todo.id === id)
      if (index !== -1) {
        todos.value.splice(index, 1)
      }
      todosMap.value.delete(id)
    }
  }

  return { init, todos, todosMap, update, create, remove }
})