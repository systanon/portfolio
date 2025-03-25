export type DBEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTodoDTO = {
  title?: string;
  description: string;
  completed?: boolean;
};

export type UpdateTodoDTO = Partial<CreateTodoDTO>;
export type ReplaceTodoDTO = Required<CreateTodoDTO>;

export type Todo = DBEntity & CreateTodoDTO;