import { Logger } from '@/lib/logger'

const MAX_RECONNECT_DELAY_MS = 30_000
const BASE_RECONNECT_DELAY_MS = 1_000

export type WSMessage<T = unknown> = {
  event?: string
  topic?: string
  data: T
  user_id?: number
}

export type WSHandler<T = unknown> = (message: WSMessage<T>) => void

export interface WSServiceLike {
  connect(): void
  onOpen(callback: () => void): () => void
  auth(user_id: number): void
  unauth(): void
  subscribe<T = unknown>(topic: string, handler: WSHandler<T>): () => void
  destroy(): void
}

export class WSService implements WSServiceLike {
  private readonly handlers = new Map<string, Set<WSHandler>>()
  private readonly openCallbacks = new Set<() => void>()
  private readonly url: string
  private readonly logger = new Logger('WebSocketService')

  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private isDestroyed = false

  constructor(url: string) {
    this.url = url
    window.addEventListener('beforeunload', this.destroy.bind(this))
  }

  connect(): void {
    if (this.isDestroyed) return

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (
      this.ws?.readyState === WebSocket.CONNECTING ||
      this.ws?.readyState === WebSocket.OPEN
    ) {
      return
    }

    this.logger.log(`Connecting to ${this.url}...`)
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.logger.log('Connected')
      this.reconnectAttempts = 0
      this.openCallbacks.forEach((cb) => cb())
    }

    this.ws.onmessage = (event) => this.handleMessage(event)

    this.ws.onclose = (event) => {
      this.cleanupSocket()

      if (this.isDestroyed) return

      const delay = Math.min(
        BASE_RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts),
        MAX_RECONNECT_DELAY_MS,
      )

      this.logger.warn(
        `Closed (code ${event.code}). Reconnecting in ${delay}ms`,
        event.reason,
      )

      this.reconnectAttempts++
      this.reconnectTimer = setTimeout(() => this.connect(), delay)
    }

    this.ws.onerror = (err) => {
      this.logger.error('Socket error', err)
      this.ws?.close()
    }
  }

  onOpen(callback: () => void): () => void {
    this.openCallbacks.add(callback)

    if (this.ws?.readyState === WebSocket.OPEN) {
      callback()
    }

    return () => this.openCallbacks.delete(callback)
  }

  auth(user_id: number): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendAuth(user_id)
    }
  }

  unauth(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.logger.log('Unauth send')
      this.emit('unauth', {})
    }
  }

  emit<T = unknown>(event: string, data: T): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      this.logger.warn(`Cannot emit "${event}", socket not open`)
      return
    }
    this.ws.send(JSON.stringify({ event, data }))
  }

  subscribe<T = unknown>(topic: string, handler: WSHandler<T>): () => void {
    const set = this.handlers.get(topic) ?? new Set<WSHandler>()
    set.add(handler as WSHandler)
    this.handlers.set(topic, set)
    this.logger.log(`Subscribed to "${topic}" (total: ${set.size})`)
    return () => this.unsubscribe(topic, handler)
  }

  destroy(): void {
    this.logger.log('Destroying connection')
    this.isDestroyed = true
    this.reconnectAttempts = 0

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.handlers.clear()
    this.openCallbacks.clear()

    if (this.ws) {
      this.ws.close(1000, 'client destroyed')
      this.cleanupSocket()
    }
  }

  private sendAuth(user_id: number): void {
    this.logger.log('Auth sent for user', user_id)
    this.ws!.send(JSON.stringify({ event: 'auth', user_id }))
  }

  private handleMessage(message: MessageEvent): void {
    let payload: WSMessage

    try {
      payload = JSON.parse(message.data)
    } catch {
      this.logger.error('Ignored non-JSON message', message.data)
      return
    }

    this.logger.log(
      `Received "${payload.topic ?? payload.event}"`,
      payload.data,
    )

    const called = new Set<WSHandler>()

    if (payload.topic) {
      this.handlers.get(payload.topic)?.forEach((h) => {
        called.add(h)
        this.safeCall(h, payload, payload.topic!)
      })
    }

    if (payload.event) {
      this.handlers.get(payload.event)?.forEach((h) => {
        if (called.has(h)) return
        this.safeCall(h, payload, payload.event!)
      })
    }
  }

  private safeCall(handler: WSHandler, payload: WSMessage, key: string): void {
    try {
      handler(payload)
    } catch (err) {
      this.logger.error(`Handler error [${key}]`, err)
    }
  }

  private cleanupSocket(): void {
    if (!this.ws) return
    this.ws.onopen = null
    this.ws.onmessage = null
    this.ws.onclose = null
    this.ws.onerror = null
    this.ws = null
  }

  private unsubscribe<T = unknown>(topic: string, handler: WSHandler<T>): void {
    const set = this.handlers.get(topic)
    if (!set) return
    set.delete(handler as WSHandler)
    this.logger.log(`Unsubscribed from "${topic}" (remaining: ${set.size})`)
    if (set.size === 0) this.handlers.delete(topic)
  }
}
