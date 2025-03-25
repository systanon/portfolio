export type Config = {
  base: string
  headers?: Record<string, string>
}

export type HTTPRequest = {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: Record<string, any>
  headers?: Record<string, string>
}

export type HTTPResponse<T> = {
  status: number
  body: T
  headers?: Record<string, string>
}

export type HTTPError = {
  type: 'http-client-error'
  status: number
  message?: string
  data?: Record<string, string>
}

const allowedContentTypes = ['application/json', 'text/json', 'application/json; charset=utf-8']

export const RESPONSE_STATUS = {
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  RATE_LIMIT: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502
}

export class HTTPClient {
  private cfg: Config
  constructor(cfg: Config) {
    this.cfg = cfg
  }

  public async jsonDo<T = any>(
    path: string,
    { method, body, headers = {} }: HTTPRequest = <HTTPRequest>{}
  ): Promise<HTTPResponse<T>> {
    console.log('TCL: HTTPClient -> this.#cfg', this.cfg)
    const url = this.cfg.base + path

    try {
      const response = await fetch(url, {
        method,
        headers: { ...(this.cfg.headers ?? {}), ...headers },
        body: body ? JSON.stringify(body) : undefined
      })
      const contentType = response.headers.get('Content-Type')
      const isJson = contentType !== null && allowedContentTypes.includes(contentType)

      if (response.ok && isJson) {
        const body = await response.json()
        return {
          status: response.status,
          body,
          headers: Object.fromEntries(response.headers.entries())
        }
      }

      if (response.status === RESPONSE_STATUS.NO_CONTENT)
        return { status: RESPONSE_STATUS.NO_CONTENT, body: <T>{} }

      return Promise.reject({
        type: 'http-client-error',
        status: response.status,
        data: isJson ? await response.json() : {}
      })
    } catch (error: any) {
      return Promise.reject({
        type: 'http-client-error',
        status: error.status ?? RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
        message: error.message ?? 'network error'
      })
    }
  }
}