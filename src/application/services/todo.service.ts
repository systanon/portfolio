import { HTTPClient } from "../../lib/http.client"
import type { CreateTodoDTO, Todo } from "../../types/todo"
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

}