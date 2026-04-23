import { HTTPClient, type ResponseWithRequest } from '../lib/http.client'
import { WSService } from '@/application/services/ws.service'

import { TodoService } from './services/todo.service'
import { NoteService } from './services/note.service'
import { NotificationService } from './services/notification.service'

import { Application } from './application'
import { AuthService } from './services/auth.service'
import { StatisticService } from './services/statistic.service'
import { TokenManager } from './tokenManager'
import { AuthApplication } from './auth.application'
import { UserService } from './services/user.service'
import { UserApplication } from './user.application'
import { AppSuccess } from '@/types/app.types'
import { TodoApplication } from './todo.application'
import { NoteApplication } from './note.application'

export const httpClient = new HTTPClient({
  base: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const wSService = new WSService(import.meta.env.VITE_APP_WS_API)
export const tokenManager = new TokenManager()

export const notificationService = new NotificationService()
export const todoService = new TodoService(httpClient)
export const authService = new AuthService(httpClient)
export const userService = new UserService(httpClient)
export const noteService = new NoteService(httpClient)
export const statisticService = new StatisticService(httpClient)

export const userApplication = new UserApplication(userService, wSService)
export const authApplication = new AuthApplication(authService, tokenManager)
export const todoApplication = new TodoApplication(todoService)
export const noteApplication = new NoteApplication(noteService)

httpClient.interceptors.request.use(
  (request) => {
    if (request.credentials === 'include') {
      const newToken = tokenManager.getToken()
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
  { runWhen: () => true },
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

    const res = await authApplication.refresh()
    if (res instanceof AppSuccess) {
      ;(originalRequest as any).data.retry = true

      return await httpClient.do(originalRequest.url, {
        ...originalRequest,
        params: undefined,
      })
    }
    return response
  },
  async (reason) => {
    return Promise.reject(reason)
  },
  { runWhen: () => true },
)

export const application = new Application(
  authApplication,
  userApplication,
  todoApplication,
  noteApplication,
  notificationService,
  statisticService,
)
