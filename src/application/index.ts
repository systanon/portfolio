import { HTTPClient } from '../lib/http.client'
import { WSService } from '@/application/services/ws.service'

import { TodoService } from './services/todo.service'
import { NoteService } from './services/note.service'
import { NotificationModule } from './modules/notification.module'

import { Application } from './application'
import { AuthService } from './services/auth.service'
import { StatisticService } from './services/statistic.service'
import { TokenManager } from '../lib/token.manager'
import { AuthApplication } from './auth.application'
import { UserService } from './services/user.service'
import { UserApplication } from './user.application'
import { TodoApplication } from './todo.application'
import { NoteApplication } from './note.application'
import { StatisticApplication } from './statistic.application'
import { createAuthRequest, createAuthResponse } from './interceptors'

export const httpClient = new HTTPClient({
  base: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const URL_EXCLUDE = ['/refresh', '/sign-up', '/sign_in']

export const wSService = new WSService(import.meta.env.VITE_APP_WS_API)
export const tokenManager = new TokenManager()

export const notificationModule = new NotificationModule()
export const todoService = new TodoService(httpClient)
export const authService = new AuthService(httpClient)
export const userService = new UserService(httpClient)
export const noteService = new NoteService(httpClient)
export const statisticService = new StatisticService(httpClient)

export const userApplication = new UserApplication(
  userService,
  wSService,
  notificationModule,
)
export const authApplication = new AuthApplication(
  authService,
  tokenManager,
  notificationModule,
)
export const todoApplication = new TodoApplication(
  todoService,
  notificationModule,
)
export const noteApplication = new NoteApplication(
  noteService,
  notificationModule,
)

export const statisticApplication = new StatisticApplication(
  statisticService,
  notificationModule,
)

httpClient.interceptors.request.use(
  createAuthRequest(tokenManager),
  async (reason) => {
    return Promise.reject(reason)
  },
  { runWhen: () => true },
)

httpClient.interceptors.response.use(
  createAuthResponse(authApplication, httpClient, URL_EXCLUDE),
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
  statisticApplication,
  wSService,
)
