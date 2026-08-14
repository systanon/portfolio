export class TokenManager {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  getToken(): string | null {
    return this.token
  }

  clearToken() {
    this.token = null
  }
}
