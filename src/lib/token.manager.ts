export class TokenManager {
  setToken(token: string) {
    localStorage.setItem('access_token', token)
  }

  getToken(): string | null {
    return localStorage.getItem('access_token')
  }

  clearToken() {
    localStorage.removeItem('access_token')
  }
}
