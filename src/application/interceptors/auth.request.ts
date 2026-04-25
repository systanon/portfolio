import type { HTTPRequest } from '@/lib/http.client'
import type { TokenManager } from '@/lib/token.manager'

export function createAuthRequest(tokenManager: TokenManager) {
  return (request: HTTPRequest): HTTPRequest => {
    if (request.credentials !== 'include') return request

    const token = tokenManager.getToken()
    if (!token) return request

    const headers = new Headers(request.headers)
    headers.set('Authorization', token)
    ;(request as any).headers = headers

    return request
  }
}
