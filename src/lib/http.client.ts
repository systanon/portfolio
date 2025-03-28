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

type ResponseWithRequest = Response & { request: HTTPRequest };


type Nullable<T> = T | null

type Interceptor<T> = {
  onfulfilled?: (value: T) => T | Promise<T>
  onrejected?: (reason: any) => any
  runWhen?: (config: T) => boolean
}

class InterceptorManager<T> {
  private interceptors: Array<Nullable<Interceptor<T>>> = []

  use(
    onfulfilled?: (value: T) => T | Promise<T>,
    onrejected?: (reason: any) => any,
    options: { runWhen?: (config: T) => boolean } = {}
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

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }

  clear(): void {
    this.interceptors = []
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
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
}

export class HTTPClient {
  interceptors = {
    request: new InterceptorManager<RequestInit>(),
    response: new InterceptorManager<Response>()
  }
  private readonly config: HTTPClientConfig
  constructor(
    config: HTTPClientConfig
  ) { 
    this.config = config

  }

  async dispatchRequest (req: HTTPRequest): Promise<ResponseWithRequest> {
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
    params?: URLSearchParams | Record<string, any>
  }): Promise<Response> {
    let url: URL

    if (typeof resource === "string" || resource instanceof URL) {
      url = new URL(resource, this.config.base)
    } else if (resource instanceof Request) {
      url = new URL(resource.url, this.config.base)
    } else {
      return Promise.reject(new TypeError("resource: Request | string | URL"))
    }
    
    fillParams(url, options?.params)
    
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
    }
    
    let req = httpRequest
    
    this.interceptors.request.forEach(async interceptor => {
      if (interceptor.runWhen?.(req) ?? true) {
        req = await Promise.resolve(interceptor.onfulfilled ? interceptor.onfulfilled(req) : req) as HTTPRequest
      }
    })
    
    let resp: Response

    try {
      resp = await this.dispatchRequest(req)
    } catch (error) {
      return Promise.reject(error)
    }

    this.interceptors.response.forEach(async interceptor => {
      resp = await Promise.resolve(interceptor.onfulfilled ? interceptor.onfulfilled(resp) : resp)
    })
    
    return resp

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
  
        return Promise.reject(response)
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

const fillParams = (url: URL, params?: URLSearchParams | Record<string, any>): void => {
  if (!params) return

  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => url.searchParams.set(key, value))
  } else if (typeof params === "object") {
    for (let key in params) {
      url.searchParams.set(key, stringifyQueryValue(params[key]))
    }
  }
}

const stringifyQueryValue = (value: any): string => {
  // TODO: 
  return `${value}`
}
