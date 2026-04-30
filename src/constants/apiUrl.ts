export const API_URL = {
  auth: {
    sign_up: 'auth/sign-up',
    sign_in: 'auth/sign-in',
    profile: 'auth/profile',
    refresh: 'auth/refresh',
    confirm: 'auth/confirm',
    logout: 'auth/logout',
    resendEmail: 'auth/resend-verification',
    forgotPass: 'auth/forgot-password',
    resetPass: 'auth/reset-password',
  },
  notes: 'notes',
  todos: 'todos',
  statistic: 'cv/download',
}

export const URL_EXCLUDE = [
  API_URL.auth.refresh,
  API_URL.auth.sign_up,
  API_URL.auth.sign_in,
]
