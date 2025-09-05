import { HTTPClient, type ResponseWithRequest } from '../lib/http.client'

import { TodoService } from './services/todo.service'
import { NotesService } from './services/notes.service'
import { NotificationService } from './services/notification.service'

import { Application } from './application'
import { AuthService } from './services/auth.service'

export const httpClient = new HTTPClient({
  base: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const todoService = new TodoService(httpClient)
export const authService = new AuthService(httpClient)
export const notesService = new NotesService(httpClient)
export const notificationService = new NotificationService()
httpClient.interceptors.request.use(
  (request) => {
    if (request.credentials === 'include') {
      const newToken = localStorage.getItem('access_token')
      const newHeaders = new Headers(request.headers)
      if (newToken) {
        newHeaders.set('Authorization', newToken)
      }
      ;(request as any).headers = newHeaders
      return request
    }
    return request
  },
  async (reason) => {
    return Promise.reject(reason)
  },
  { runWhen: () => true }
)
httpClient.interceptors.response.use(
  async (response) => {
    if (response.status !== 401) return response

    const originalRequest = (response as ResponseWithRequest).request

    const alreadyTried = (originalRequest as any).data.retry

    if (
      alreadyTried ||
      (typeof originalRequest.resource === 'string' &&
        originalRequest.resource.includes('/refresh')) ||
      (originalRequest.resource instanceof URL &&
        originalRequest.resource.pathname.includes('/refresh'))
    )
      return response

    try {
      await authService.refresh()
      ;(originalRequest as any).data.retry = true

      return await httpClient.do(originalRequest.resource, originalRequest)
    } catch (e) {
      return response
    }
  },
  async (reason) => {
    return Promise.reject(reason)
  },
  { runWhen: () => true }
)

export const createApplication = (): Application =>
  new Application(todoService, authService, notesService, notificationService)

// Here only for Pinia
export const application = createApplication()
