import { HTTPClient } from "../../lib/http.client"
import type { CreateTodoDTO, Todo, ReplaceTodoDTO, UpdateTodoDTO } from "../../types/todo"
import type { ID } from "../../types/general"

function buildRequestUrl(baseUrl: string, params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  );

  return `${baseUrl}?${searchParams.toString()}`;
}


export class TodoService {
  private readonly httpClient: HTTPClient
  
  constructor(httpClient: HTTPClient){
    this.httpClient = httpClient
  } 

  async create(dto: CreateTodoDTO): Promise<ID> {
    const url = "/todos"
    const result = await this.httpClient.jsonDo<Todo>(url, {
      method: "POST",
      body: dto
    })
    const id = Number(result.body.id)

    return id
  }

  async getAll(params: any): Promise<Array<Todo>> {
    const url = "/todos"
    const result = await this.httpClient.jsonDo<Array<Todo>>(buildRequestUrl(url, params))
    return result.body
  }

  async getOne(id: ID): Promise<Todo> {
    const url = `/todos/${id}`
    const result = await this.httpClient.jsonDo<Todo>(url)
    return result.body
  }

  async replace(id: ID, dto: ReplaceTodoDTO): Promise<Todo> {
    const url = `/todos/${id}`
    const result = await this.httpClient.jsonDo<Todo>(url, { method:"PUT", body: dto})
    return result.body
  }

  async update(id: ID, dto: UpdateTodoDTO): Promise<Todo> {
    const url = `/todos/${id}`
    const result = await this.httpClient.jsonDo<Todo>(url, { method:"PATCH", body: dto})
    return result.body
  }

  async delete(id: ID): Promise<Todo> {
    const url = `/todos/${id}`
    const result = await this.httpClient.jsonDo<Todo>(url, { method:"DELETE" })
    return result.body
  }
}