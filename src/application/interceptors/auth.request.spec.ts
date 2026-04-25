import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAuthRequest } from './auth.request'

const mockTokenManager = { getToken: vi.fn() }

describe('createAuthRequest', () => {
  beforeEach(() => vi.clearAllMocks())

  it('does not modify requests without credentials: include', () => {
    const interceptor = createAuthRequest(mockTokenManager as any)
    const request = { credentials: 'omit', headers: new Headers() } as any
    const result = interceptor(request)
    expect(result.headers!.has('Authorization')).toBe(false)
  })

  it('does not add the header if the token is missing', () => {
    mockTokenManager.getToken.mockReturnValue(null)
    const interceptor = createAuthRequest(mockTokenManager as any)
    const request = { credentials: 'include', headers: new Headers() } as any
    const result = interceptor(request)
    expect(result.headers!.has('Authorization')).toBe(false)
  })

  it('adds Authorization header if a token is present', () => {
    mockTokenManager.getToken.mockReturnValue('Bearer token123')
    const interceptor = createAuthRequest(mockTokenManager as any)
    const request = { credentials: 'include', headers: new Headers() } as any
    const result = interceptor(request)
    expect((result as any).headers.get('Authorization')).toBe('Bearer token123')
  })
})
