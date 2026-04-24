export class TokenManager {
  private accessToken: string | null = null

  setToken(token: string) {
    this.accessToken = token
  }

  getToken(): string | null {
    return this.accessToken
  }

  clearToken() {
    this.accessToken = null
  }
}
