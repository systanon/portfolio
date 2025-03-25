import { HTTPClient } from "../lib/http.client";

import { TodoService } from "./services/todo.service";

export const httpClient = new HTTPClient({
  base: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})


export const todoService = new TodoService(httpClient);