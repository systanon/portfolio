import { HTTPClient } from "../lib/http.client";

import { TodoService } from "./services/todo.service";

import { Application } from "./application";
import { AuthService } from "./services/auth.service";

export const httpClient = new HTTPClient({
  base: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})


export const todoService = new TodoService(httpClient);
export const authService = new AuthService(httpClient);

export const createApplication = (): Application => new Application(todoService, authService);


// Here only for Pinia
export const application = createApplication()