type Mode = 'production' | 'development'

const mode = import.meta.env.MODE as Mode

export const API_URL = {
  production: {
    auth: {
      sign_up: '/api/v1/auth/sign-up',
      sign_in: '/api/v1/auth/sign-in',
      profile: '/api/v1/auth/profile',
      refresh: '/api/v1/auth/refresh',
      confirm: '/api/v1/auth/confirm',
      logout: '/api/v1/auth/logout',
    },
    notes: '/api/v1/notes',
    todos: '/api/v1/todos',
  },
  development: {
    auth: {
      sign_up: '/api/auth/sign-up',
      sign_in: '/api/auth/sign-in',
      profile: '/api/auth/profile',
      refresh: '/api/auth/refresh',
      confirm: '/api/auth/confirm',
      logout: '/api/auth/logout',
    },
    notes: '/api/notes',
    todos: '/api/todos',
  },
}[mode]
