type WSHandler<T = any> = (data: T) => void

export type WSMessage<T = any> = {
  event: string
  topic?: string
  data: T
}


export class WSService {
  private readonly handlers = new Map<string, Set<WSHandler>>()
  private readonly onMessage = this.handleMessage.bind(this)
  private ws: WebSocket

  constructor(ws: WebSocket) {
    this.ws = ws
    this.ws.addEventListener('message', this.onMessage)
  }


  private handleMessage(message: MessageEvent) {
    let payload: WSMessage

    try {
      payload = JSON.parse(message.data)
    } catch {
      console.warn('WS: invalid JSON', message.data)
      return
    }

    if (typeof payload?.topic !== 'string') return

    const handlers = this.handlers.get(payload.topic)
    if (!handlers || handlers.size === 0) return

    handlers.forEach(handler => {
      try {
        handler(payload)
      } catch (err) {
        console.error(`WS handler error [${payload.topic}]`, err)
      }
    })
  }

  emit<T = any>(event: string, data: T) {
    if (this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WS: connection is not open')
      return
    }

    const message: WSMessage<T> = { event, data }
    this.ws.send(JSON.stringify(message))
  }


  auth(event: string, user_id: number) {
    if (this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WS: connection is not open')
      return
    }

    const message = { event, user_id }
    this.ws.send(JSON.stringify(message))
  }

  subscribe<T = any>(topic: string, handler: WSHandler<T>) {
    const handlers = this.handlers.get(topic) ?? new Set()
    handlers.add(handler as WSHandler)
    this.handlers.set(topic, handlers)

    return () => this.unsubscribe(topic, handler)
  }

  unsubscribe<T = any>(topic: string, handler: WSHandler<T>) {
    const handlers = this.handlers.get(topic)
    if (!handlers) return

    handlers.delete(handler as WSHandler)

    if (handlers.size === 0) {
      this.handlers.delete(topic)
    }
  }

  destroy() {
    this.handlers.clear()
    this.ws.removeEventListener('message', this.onMessage)
    this.ws.close()
  }
}