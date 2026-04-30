import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAuthResponse } from './auth.response'
import { AppSuccess } from '@/types/app.types'
import { AppError } from '@/types/app-errors'
import { URL_EXCLUDE } from '@/constants'

const mockAuthApplication = { refresh: vi.fn() }
const mockHttpClient = { do: vi.fn() }

describe('createAuthResponse', () => {
  beforeEach(() => vi.clearAllMocks())

  const makeResponse = (status: number, resource: string, retry = false) =>
    ({
      status,
      request: {
        resource,
        url: resource,
        data: { retry },
      },
    }) as any

  it('skips the response if the status is not 401.', async () => {
    const interceptor = createAuthResponse(
      mockAuthApplication as any,
      mockHttpClient as any,
    )
    const response = makeResponse(200, '/api/data')
    const result = await interceptor(response)
    expect(result).toBe(response)
    expect(mockAuthApplication.refresh).not.toHaveBeenCalled()
  })

  it('does not retry if a retry attempt has already been made', async () => {
    const interceptor = createAuthResponse(
      mockAuthApplication as any,
      mockHttpClient as any,
    )
    const response = makeResponse(401, '/api/data', true)
    const result = await interceptor(response)
    expect(result).toBe(response)
    expect(mockAuthApplication.refresh).not.toHaveBeenCalled()
  })

  it('skips retry for /refresh requests', async () => {
    const interceptor = createAuthResponse(
      mockAuthApplication as any,
      mockHttpClient as any,
      URL_EXCLUDE,
    )
    const response = makeResponse(401, `/${URL_EXCLUDE[0]}`)
    const result = await interceptor(response)
    expect(result).toBe(response)
    expect(mockAuthApplication.refresh).not.toHaveBeenCalled()
  })

  it('retries the request after a successful refresh', async () => {
    mockAuthApplication.refresh.mockResolvedValue(new AppSuccess(null))
    mockHttpClient.do.mockResolvedValue({ status: 200 })

    const interceptor = createAuthResponse(
      mockAuthApplication as any,
      mockHttpClient as any,
    )
    const response = makeResponse(401, '/api/data')
    const result = await interceptor(response)

    expect(mockAuthApplication.refresh).toHaveBeenCalledOnce()
    expect(mockHttpClient.do).toHaveBeenCalledOnce()
    expect(result).toEqual({ status: 200 })
  })

  it('returns the original response if refresh fails', async () => {
    mockAuthApplication.refresh.mockResolvedValue(
      new AppError('Unauthorized', '401'),
    )

    const interceptor = createAuthResponse(
      mockAuthApplication as any,
      mockHttpClient as any,
    )
    const response = makeResponse(401, '/api/data')
    const result = await interceptor(response)

    expect(mockHttpClient.do).not.toHaveBeenCalled()
    expect(result).toBe(response)
  })
})
