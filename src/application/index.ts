import { HTTPClient } from "../lib/http.client";

import { TodoService } from "./services/todo.service";

import { Application } from "./application";

export const httpClient = new HTTPClient({
  base: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})


export const todoService = new TodoService(httpClient);

export const createApplication = (): Application => new Application(todoService);


// Here only for Pinia
export const application = createApplication()

