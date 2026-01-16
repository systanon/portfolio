type WSHandler<T = any> = (data: T) => void

export class WSService {
  private readonly handlers = new Map<string, Set<WSHandler>>()
  private ws: WebSocket

  constructor(ws: WebSocket) {
    this.ws = ws
    this.ws.addEventListener('message', this.handler.bind(this))
  }

  private handler(message: MessageEvent) {
    let payload: any

    try {
      payload = JSON.parse(message.data)
    } catch {
      console.warn('WS: invalid JSON', message.data)
      return
    }

    const { event, data } = payload
    if (!event) return

    const handlers = this.handlers.get(event)
    if (!handlers) return

    handlers.forEach(handler => handler(data))
  }

  subscribe(event: string, handler: WSHandler) {
    const handlers = this.handlers.get(event) ?? new Set()
    handlers.add(handler)
    this.handlers.set(event, handlers)

    return () => this.unsubscribe(event, handler)
  }

  unsubscribe(event: string, handler: WSHandler) {
    const handlers = this.handlers.get(event)
    if (!handlers) return

    handlers.delete(handler)
    if (handlers.size === 0) {
      this.handlers.delete(event)
    }
  }
}