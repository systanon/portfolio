import type { ResponseWithRequest } from '@/lib/http.client'
import type { AuthApplication } from '@/application/auth.application'
import { AppSuccess } from '@/types/app.types'

export function createAuthResponse(
  authApplication: AuthApplication,
  httpClient: { do: (...args: any[]) => Promise<ResponseWithRequest> },
  excludeUrls: string[] = [],
) {
  return async (
    response: ResponseWithRequest,
  ): Promise<ResponseWithRequest> => {
    if (response.status !== 401) return response

    const originalRequest = response.request
    const url = originalRequest.url.toString()

    if (excludeUrls.some((excludeUrl) => url.includes(excludeUrl)))
      return response

    const alreadyTried = (originalRequest as any).data?.retry
    if (alreadyTried) return response

    const res = await authApplication.refresh()
    if (!(res instanceof AppSuccess)) return response
    ;(originalRequest as any).data.retry = true

    return httpClient.do(originalRequest.url, {
      ...originalRequest,
      params: undefined,
    })
  }
}
