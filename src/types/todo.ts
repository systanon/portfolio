export type DBEntity = {
  id: number
  createdAt: string
  updatedAt: string
}

export type CreateTodoDTO = {
  title: string
  description: string
  completed?: boolean
}

export type UpdateTodoDTO = Partial<CreateTodoDTO>
export type ReplaceTodoDTO = Required<CreateTodoDTO>

export type Todo = {
  title: string
  description: string
  completed: boolean
} & DBEntity
