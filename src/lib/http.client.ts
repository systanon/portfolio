import { stringify } from 'qs'

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

type OnFulfilled<T> = (value: T) => T | Promise<T>
type OnRejected<T> = (reason: T) => T | Promise<T>

export type ResponseWithRequest = Response & { request: HTTPRequest };


type Nullable<T> = T | null

type Interceptor<R, E, C> = {
  onfulfilled?: OnFulfilled<R>
  onrejected?: OnRejected<E>
  runWhen?: (config: C) => boolean
}

class InterceptorManager<T, Err, Cfg> {
  private interceptors: Array<Nullable<Interceptor<T, Err, Cfg>>> = []

  public use(
    onfulfilled?: OnFulfilled<T>,
    onrejected?: OnRejected<Err>,
    options: { runWhen?: (config: Cfg) => boolean } = {}
  ): number {
    if (!onfulfilled && !onrejected) return -1

    return (
      this.interceptors.push({
        onfulfilled,
        onrejected,
        runWhen: options.runWhen ?? undefined
      }) - 1
    )
  }

  public eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }

  public clear(): void {
    this.interceptors = []
  }

  public forEach(fn: (interceptor: Interceptor<T, Err, Cfg>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor) fn(interceptor)
    })
  }
}

export type HTTPClientConfig = Pick<RequestInit, "cache" | "credentials" | "headers" | "mode" | "referrer" | "referrerPolicy"> & {
  base?: string | URL | undefined
  interceptors?: Array<(v: any) => any>
}

export type HTTPRequest = Pick<RequestInit, "body" | "cache" | "credentials" | "integrity" | "keepalive" | "method" | "mode" | "redirect" | "referrer" | "referrerPolicy" | "signal" | "window"> & {
  readonly config?: HTTPClientConfig
  readonly headers?: Headers
  readonly resource: RequestInfo | URL
  readonly url: URL | string
  readonly data?: Record<string, any>
}

export class HTTPClient {
  interceptors = {
    request: new InterceptorManager<HTTPRequest, Error, HTTPRequest>(),
    response: new InterceptorManager<ResponseWithRequest, Error, HTTPRequest>()
  }
  private readonly config: HTTPClientConfig
  constructor(
    config: HTTPClientConfig
  ) {
    this.config = config
  }

  async dispatchRequest(req: HTTPRequest): Promise<ResponseWithRequest> {
    try {
      const input = typeof req.resource === 'string' ? req.url : req.resource
      const response = await fetch(input, req)
      const responseWithRequest: ResponseWithRequest = response as ResponseWithRequest;
      responseWithRequest.request = req;
      return responseWithRequest;
    } catch (error) {
      return Promise.reject(error)
    }
  }


  public async do(resource: RequestInfo | URL, options?: RequestInit & {
    params?: URLSearchParams | Record<string, any>, data?: Record<string, any>
  }): Promise<ResponseWithRequest> {
    let url: URL

    if (typeof resource === "string" || resource instanceof URL) {
      url = new URL(resource, this.config.base)
    } else if (resource instanceof Request) {
      url = new URL(resource.url, this.config.base)
    } else {
      return Promise.reject(new TypeError("resource: Request | string | URL"))
    }

    fillParams(url.searchParams, options?.params)

    url = new URL(decodeURI(url.toString())) // for easier viewing of developer tools.

    const httpRequest: HTTPRequest = {
      body: options?.body,
      cache: options?.cache || this.config.cache,
      config: this.config,
      credentials: options?.credentials || this.config.credentials,
      headers: this.mergeHeaders(options?.headers),
      integrity: options?.integrity,
      keepalive: options?.keepalive,
      method: options?.method,
      mode: options?.mode || this.config.mode,
      redirect: options?.redirect,
      referrer: options?.referrer || this.config.referrer,
      referrerPolicy: options?.referrerPolicy || this.config.referrerPolicy,
      resource,
      signal: options?.signal,
      url,
      window: options?.window,
      data: options?.data ?? {}
    }


    const fallbackOnRequestFulfilled: OnFulfilled<HTTPRequest> = (request) => request
    const fallbackOnRequestRejected: OnRejected<Error> = (e) => e
    const requestInterceptorChain: Array<[OnFulfilled<HTTPRequest>, OnRejected<Error>]> = []
    this.interceptors.request.forEach(
      interceptor =>
        (interceptor.runWhen?.(httpRequest) ?? false) &&
        requestInterceptorChain.unshift([
          interceptor.onfulfilled ?? fallbackOnRequestFulfilled,
          interceptor.onrejected ?? fallbackOnRequestRejected
        ])
    )


    const fallbackOnResponseFulfilled: OnFulfilled<ResponseWithRequest> = (response) => response
    const fallbackOnResponseRejected: OnRejected<Error> = (error) => error
    const responseInterceptorChain: Array<[OnFulfilled<ResponseWithRequest>, OnRejected<Error>]> = []
    this.interceptors.response.forEach(interceptor =>
      responseInterceptorChain.push([
        interceptor.onfulfilled ?? fallbackOnResponseFulfilled,
        interceptor.onrejected ?? fallbackOnResponseRejected
      ])
    )
    return (async () => {
      let resp: Promise<ResponseWithRequest>
      let req = httpRequest

      for (let i = 0; i < requestInterceptorChain.length; i++) {
        const [onfulfilled, onrejected] = requestInterceptorChain[i]
        try {
          req = await onfulfilled(req)
        } catch (error) {
          onrejected(error as Error)
          break
        }
      }

      try {
        resp = this.dispatchRequest(req)
      } catch (error) {
        return Promise.reject(error)
      }

      for (let i = 0; i < responseInterceptorChain.length; i++) {
        const [onfulfilled, onrejected] = responseInterceptorChain[i]
        resp = resp.then(onfulfilled, (e: any) => Promise.reject(onrejected(e as Error)))
      }

      return resp
    })()

  }
  async jsonDo<T = any>(resource: string | URL | Request, options?: HTTPRequest): Promise<T> {
    const allowedContentTypes = [
      'application/json',
      'text/json',
      'application/javascript',
      'application/vnd.api+json',
      'application/json; charset=utf-8'
    ]

    try {
      const response = await this.do(resource, options)
      const contentType = response.headers.get('Content-Type') || ''

      if (response.ok && allowedContentTypes.includes(contentType)) {
        return await response.json()
      }

      if (response.status === RESPONSE_STATUS.NO_CONTENT) {
        return {} as T
      }

      return Promise.reject({
        _type: 'http-client-error',
        status: response.status,
        data: allowedContentTypes.includes(contentType) ? await response.json() : {}
      })
    } catch (error: any) {
      return Promise.reject({
        _type: 'http-client-error',
        status: error.status ?? 500,
        data: error.message ?? {}
      })
    }
  }

  async blobDo(resource: string | URL | Request, options?: RequestInit): Promise<Blob> {
    try {
      const response = await this.do(resource, options)
      if (response.ok) return response.blob()

      const failed = await response.json()

      return Promise.reject(failed)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async bufferDo(resource: string | URL | Request, options?: RequestInit): Promise<ArrayBuffer> {
    try {
      const response = await this.do(resource, options)
      if (response.ok) return response.arrayBuffer()

      return Promise.reject(response)
    } catch (error) {
      return Promise.reject(error)
    }
  }


  private mergeHeaders(optionsHeaders?: HeadersInit): Headers {
    const headers = new Headers()

    copyHeaders(headers, this.config.headers)
    copyHeaders(headers, optionsHeaders)

    return headers
  }
}


const copyHeaders = (target: Headers, source?: HeadersInit): void => {
  if (!source) return

  if (source instanceof Headers) {
    for (let [header, value] of source.entries()) {
      target.set(header, value)
    }
  } else if (Array.isArray(source)) {
    source.forEach(([header, value]) => target.set(header, value))
  } else if (typeof source === "object") {
    for (let header in source) {
      target.set(header, source[header])
    }
  }
}

const fillParams = (target: URLSearchParams, source: URLSearchParams | Record<string, any> | undefined) => {
  if (!source) return

  if (source instanceof URLSearchParams) {
    source.forEach((value, key) => target.append(key, value))
  } else if (typeof source === 'object') {
    fillParamsFromRecord(target, source)
  }
}

const fillParamsFromRecord = (params: URLSearchParams, record: URLSearchParams | Record<string, any> | undefined) => {
  const url = new URL(`http://temp-domain.com/path?${stringify(record)}`)
  url.searchParams.forEach((v, k) => params.append(k, v))
}