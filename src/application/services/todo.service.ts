import { HTTPClient } from '../../lib/http.client';
import type { CreateTodoDTO, Todo, ReplaceTodoDTO, UpdateTodoDTO } from '../../types/todo';
import { AppError } from '../../types/app-errors';
import type { ID } from '../../types/general';


function errorMsg(error: unknown): string {
  return (
    (error as { data?: { msg?: string } })?.data?.msg ||
    (error as { message?: string })?.message ||
    'Unknown error'
  );
}

export class TodoService {
  private readonly httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  async create(dto: CreateTodoDTO): Promise<ID | AppError> {
    const url = '/api/todos';
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, {
        method: 'POST',
        body,
        resource: url,
        url
      });
      const id = Number(result.id);

      return id;
    } catch (error) {
      return new AppError(errorMsg(error));
    }
  }

  async getAll(params: any): Promise<Array<Todo>> {
    const url = '/api/todos';
    const result = await this.httpClient.jsonDo<Array<Todo>>(url, params);
    return result;
  }

  async getOne(id: ID): Promise<Todo | AppError> {
    const url = `/api/todos/${id}`;
    try {
      const result = await this.httpClient.jsonDo<Todo>(url);
      return result;
    } catch (error) {
      return new AppError(errorMsg(error));
    }
  }

  async replace(id: ID, dto: ReplaceTodoDTO): Promise<Todo | AppError> {
    const url = `/api/todos/${id}`;
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, {
        method: 'PUT', body, resource: url,
        url
      });
      return result;
    } catch (error) {
      return new AppError(errorMsg(error));
    }
  }

  async update(id: ID, dto: UpdateTodoDTO): Promise<Todo | AppError> {
    const url = `/api/todos/${id}`;
    const body = JSON.stringify(dto)
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, {
        method: 'PATCH', body, resource: url,
        url
      });
      return result;
    } catch (error) {
      return new AppError(errorMsg(error));
    }
  }

  async delete(id: ID): Promise<Todo | AppError> {
    const url = `/api/todos/${id}`;
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, {
        method: 'DELETE', resource: url,
        url
      });
      return result;
    } catch (error) {
      return new AppError(errorMsg(error));
    }
  }
}
