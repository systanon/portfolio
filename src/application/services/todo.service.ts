import { HTTPClient } from '../../lib/http.client';
import type { CreateTodoDTO, Todo, ReplaceTodoDTO, UpdateTodoDTO } from '../../types/todo';
import { AppError } from '../../types/app-errors';
import type { ID } from '../../types/general';

function buildRequestUrl(baseUrl: string, params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );

  return `${baseUrl}?${searchParams.toString()}`;
}

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
    const url = '/todos';
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, {
        method: 'POST',
        body: dto,
      });
      const id = Number(result.body.id);

      return id;
    } catch (error) {
      return new AppError(errorMsg(error));
    }
  }

  async getAll(params: any): Promise<Array<Todo>> {
    const url = '/todos';
    const result = await this.httpClient.jsonDo<Array<Todo>>(buildRequestUrl(url, params));
    return result.body;
  }

  async getOne(id: ID): Promise<Todo | AppError> {
    const url = `/todos/${id}`;
    try {
      const result = await this.httpClient.jsonDo<Todo>(url);
      return result.body;
    } catch (error) {
      return new AppError(errorMsg(error));
    }
  }

  async replace(id: ID, dto: ReplaceTodoDTO): Promise<Todo | AppError> {
    const url = `/todos/${id}`;
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, { method: 'PUT', body: dto });
      return result.body;
    } catch (error) {
      return new AppError(errorMsg(error));
    }
  }

  async update(id: ID, dto: UpdateTodoDTO): Promise<Todo | AppError> {
    const url = `/todos/${id}`;
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, { method: 'PATCH', body: dto });
      return result.body;
    } catch (error) {
      return new AppError(errorMsg(error));
    }
  }

  async delete(id: ID): Promise<Todo | AppError> {
    const url = `/todos/${id}`;
    try {
      const result = await this.httpClient.jsonDo<Todo>(url, { method: 'DELETE' });
      return result.body;
    } catch (error) {
      return new AppError(errorMsg(error));
    }
  }
}
