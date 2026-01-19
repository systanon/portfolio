type WSHandler<T = any> = (data: T) => void

export type WSMessage<T = any> = {
  event: string
  topic?: string
  data: T
  user_id?: number
}

export class WSService {
  private readonly handlers = new Map<string, Set<WSHandler>>()
  private ws: WebSocket | null = null
  private url: string
  private userId: number | null = null
  private reconnectAttempts = 0
  private isDestroyed = false

  resolveConnecting: (() => void) | null = null
  wsConnecting: Promise<void> = Promise.resolve()

  constructor(url: string) {
    this.url = url
    this.connect()
  }

  private connect() {
    if (this.isDestroyed) return
    this.wsConnecting = new Promise(
      (resolve) => (this.resolveConnecting = resolve),
    )
    console.log(`WS: Connecting to ${this.url}...`)
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log('WS: Connected')
      this.reconnectAttempts = 0

      if (this.userId) {
        this.auth(this.userId)
      }
      this.resolveConnecting?.()
    }

    this.ws.onmessage = (event) => this.handleMessage(event)

    this.ws.onclose = (e) => {
      if (this.isDestroyed) return

      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      console.warn(
        `WS: Connection closed. Reconnecting in ${delay}ms...`,
        e.reason,
      )

      this.reconnectAttempts++
      setTimeout(() => this.connect(), delay)
    }

    this.ws.onerror = (err) => {
      console.error('WS: Socket error', err)
      this.ws?.close()
    }
  }

  private handleMessage(message: MessageEvent) {
    let payload: WSMessage
    try {
      payload = JSON.parse(message.data)
    } catch {
      console.warn('WS: invalid JSON', message.data)
      return
    }

    if (typeof payload?.topic === 'string') {
      const handlers = this.handlers.get(payload.topic)
      handlers?.forEach((handler) => {
        try {
          handler(payload)
        } catch (err) {
          console.error(`WS handler error [${payload.topic}]`, err)
        }
      })
    }
  }

  emit<T = any>(event: string, data: T) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('WS: cannot emit, connection not open')
      return
    }
    this.ws.send(JSON.stringify({ event, data }))
  }

  auth(user_id: number) {
    this.userId = user_id
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event: 'auth', user_id }))
      console.log('WS: Auth sent for user', user_id)
    }
  }
  unauth() {
    if (this.userId) {
      this.userId = null

      if (this.ws?.readyState === WebSocket.OPEN) {
        this.emit('unauth', {})
      }
    }
  }

  subscribe<T = any>(topic: string, handler: WSHandler<T>) {
    const handlers = this.handlers.get(topic) ?? new Set()
    handlers.add(handler as WSHandler)
    this.handlers.set(topic, handlers)
    return () => this.unsubscribe(topic, handler)
  }

  unsubscribe<T = any>(topic: string, handler: WSHandler<T>) {
    const handlers = this.handlers.get(topic)
    if (handlers) {
      handlers.delete(handler as WSHandler)
      if (handlers.size === 0) this.handlers.delete(topic)
    }
  }

  destroy() {
    this.isDestroyed = true
    this.handlers.clear()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
