import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SyncModule } from './sync.module'
import { SyncEvent } from '@/types/sync'

const createMockPort = () => ({
  postMessage: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  start: vi.fn(),
})

const createMockWorker = () => {
  const port = createMockPort()
  return { port }
}

const getMessageHandler = (worker: ReturnType<typeof createMockWorker>) => {
  const call = worker.port.addEventListener.mock.calls.find(
    (args: any[]) => args[0] === 'message',
  )
  return call?.[1] as (ev: MessageEvent) => void
}

const sendFromWorker = (handler: (ev: MessageEvent) => void, data: unknown) => {
  handler({ data } as MessageEvent)
}

const syncMessage = (type: SyncEvent, data: unknown) => ({
  event: SyncEvent.SYNC,
  data: { type, data },
})

const findPostedMessage = (
  worker: ReturnType<typeof createMockWorker>,
  predicate: (msg: any) => boolean,
) => {
  return worker.port.postMessage.mock.calls.find((args: any[]) =>
    predicate(args[0]),
  )?.[0]
}

const findSyncMessage = (
  worker: ReturnType<typeof createMockWorker>,
  type: SyncEvent,
) =>
  findPostedMessage(
    worker,
    (msg) => msg.event === SyncEvent.SYNC && msg.data?.type === type,
  )

describe('SyncModule', () => {
  let worker: ReturnType<typeof createMockWorker>
  let module: SyncModule
  let onMessage: (ev: MessageEvent) => void

  beforeEach(() => {
    vi.useFakeTimers()
    worker = createMockWorker()
    module = new SyncModule(worker as unknown as SharedWorker)
    onMessage = getMessageHandler(worker)
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('subscribes to message and calls start when created', () => {
      expect(worker.port.addEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function),
      )
      expect(worker.port.start).toHaveBeenCalled()
    })

    it('considers himself a master by default until he receives MASTER', () => {
      expect(module.master).toBe(true)
    })

    it('by default, clientID is null until CONNECT is received', () => {
      expect(module.id).toBeNull()
    })
  })

  describe('CONNECT', () => {
    it('sets clientID', () => {
      sendFromWorker(onMessage, syncMessage(SyncEvent.CONNECT, { clientID: 5 }))
      expect(module.id).toBe(5)
    })

    it('correctly handles clientID equal to 0', () => {
      sendFromWorker(onMessage, syncMessage(SyncEvent.CONNECT, { clientID: 0 }))
      expect(module.id).toBe(0)
    })
  })

  describe('MASTER', () => {
    it('updates the status to false', () => {
      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.MASTER, { master: false }),
      )
      expect(module.master).toBe(false)
    })

    it('updates the status to true', () => {
      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.MASTER, { master: false }),
      )
      sendFromWorker(onMessage, syncMessage(SyncEvent.MASTER, { master: true }))
      expect(module.master).toBe(true)
    })

    it('does not change the status if the value is the same', () => {
      const spy = vi.spyOn(module as any, 'handleMaster')
      sendFromWorker(onMessage, syncMessage(SyncEvent.MASTER, { master: true }))
      expect(module.master).toBe(true)
      spy.mockRestore()
    })
  })

  describe('PING / PONG', () => {
    it('PONG responds with the same id and timestamp', () => {
      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.PING, { id: 1, timestamp: 1000 }),
      )

      const pong = findSyncMessage(worker, SyncEvent.PONG)
      expect(pong).toBeDefined()
      expect(pong.data.data).toEqual({ id: 1, timestamp: 1000 })
    })

    it('updates testConnectTimestamp - slave does not become master until pings are received', () => {
      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.MASTER, { master: false }),
      )

      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(1000)
        sendFromWorker(
          onMessage,
          syncMessage(SyncEvent.PING, { id: 0, timestamp: Date.now() }),
        )
      }

      expect(module.master).toBe(false)
    })
  })

  describe('waitForWorker', () => {
    it('won`t resolve until the first PING', async () => {
      const resolved = vi.fn()
      module.waitForWorker().then(resolved)

      await Promise.resolve()
      expect(resolved).not.toHaveBeenCalled()
    })

    it('resolves after the first PING', async () => {
      const resolved = vi.fn()
      module.waitForWorker().then(resolved)

      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.PING, { id: 0, timestamp: Date.now() }),
      )

      await Promise.resolve()
      expect(resolved).toHaveBeenCalledOnce()
    })

    it('resolves immediately if the worker is already ready', async () => {
      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.PING, { id: 0, timestamp: Date.now() }),
      )

      const resolved = vi.fn()
      module.waitForWorker().then(resolved)

      await Promise.resolve()
      expect(resolved).toHaveBeenCalledOnce()
    })

    it('multiple pending promises will all resolve', async () => {
      const resolvers = [vi.fn(), vi.fn(), vi.fn()]
      resolvers.forEach((r) => module.waitForWorker().then(r))

      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.PING, { id: 0, timestamp: Date.now() }),
      )

      await Promise.resolve()
      resolvers.forEach((r) => expect(r).toHaveBeenCalledOnce())
    })
  })

  describe('pingWatcher', () => {
    beforeEach(() => {
      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.MASTER, { master: false }),
      )
      expect(module.master).toBe(false)
    })

    it('becomes master if the worker does not ping for longer than offlineInterval', () => {
      // offlineInterval=5000, pingPongInterval=2000
      vi.advanceTimersByTime(5000 + 2000 + 1)
      expect(module.master).toBe(true)
    })

    it('does not become a master again if you already have one', () => {
      vi.advanceTimersByTime(5000 + 2000 + 1)
      expect(module.master).toBe(true)

      vi.advanceTimersByTime(2000)
      expect(module.master).toBe(true)
    })

    it('does not become master if pings arrive on time', () => {
      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(1000)
        sendFromWorker(
          onMessage,
          syncMessage(SyncEvent.PING, { id: 0, timestamp: Date.now() }),
        )
      }

      expect(module.master).toBe(false)
    })
  })

  describe('emit', () => {
    it('ensures the worker receives the correct event and parameters', () => {
      module.emit('user:profile', { id: 1 })

      const msg = findPostedMessage(worker, (m) => m.event === 'user:profile')
      expect(msg).toBeDefined()
      expect(msg.params).toEqual([{ id: 1 }])
    })

    it('dispatches a message with multiple params', () => {
      module.emit('user:update', { id: 1 }, { name: 'test' })

      const msg = findPostedMessage(worker, (m) => m.event === 'user:update')
      expect(msg.params).toEqual([{ id: 1 }, { name: 'test' }])
    })

    it('skips dispatching the SyncEvent.SYNC event', () => {
      worker.port.postMessage.mockClear()
      module.emit(SyncEvent.SYNC)
      expect(worker.port.postMessage).not.toHaveBeenCalled()
    })
  })

  describe('on / off', () => {
    it('calls the handler on an incoming event', () => {
      const handler = vi.fn()
      module.on('user:logout' as any, handler)

      sendFromWorker(onMessage, { event: 'user:logout', params: [] })

      expect(handler).toHaveBeenCalledOnce()
    })

    it('passes params to the handler', () => {
      const handler = vi.fn()
      module.on('user:logout' as any, handler)

      sendFromWorker(onMessage, {
        event: 'user:logout',
        params: [{ reason: 'expired' }],
      })

      expect(handler).toHaveBeenCalledWith({ reason: 'expired' })
    })

    it('does not call the handler after off', () => {
      const handler = vi.fn()
      module.on('user:logout' as any, handler)
      module.off('user:logout' as any, handler)

      sendFromWorker(onMessage, { event: 'user:logout', params: [] })

      expect(handler).not.toHaveBeenCalled()
    })

    it('does not call the handler for a different event', () => {
      const handler = vi.fn()
      module.on('user:logout' as any, handler)

      sendFromWorker(onMessage, { event: 'user:login', params: [] })

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('register / unregister', () => {
    const makeRpcRequest = (
      overrides?: Partial<{
        clientID: number
        requestID: string
        procedureName: string
        params: unknown[]
      }>,
    ) => ({
      clientID: 2,
      requestID: '2-0',
      procedureName: 'getCount',
      params: [],
      ...overrides,
    })

    it('executes a synchronous procedure and responds with resolve', async () => {
      module.register('getCount', () => 42)

      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.RPC_REQUEST, makeRpcRequest()),
      )
      await Promise.resolve()

      const response = findSyncMessage(worker, SyncEvent.RPC_RESPONSE)
      expect(response.data.data.result).toBe(42)
      expect(response.data.data.state).toBe('resolve')
    })

    it('executes an async procedure and responds with resolve', async () => {
      module.register('getCount', async () => 42)

      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.RPC_REQUEST, makeRpcRequest()),
      )
      await Promise.resolve()

      const response = findSyncMessage(worker, SyncEvent.RPC_RESPONSE)
      expect(response.data.data.result).toBe(42)
      expect(response.data.data.state).toBe('resolve')
    })

    it('returns state: reject if a synchronous procedure throws an error', async () => {
      module.register('boom', () => {
        throw new Error('sync fail')
      })

      sendFromWorker(
        onMessage,
        syncMessage(
          SyncEvent.RPC_REQUEST,
          makeRpcRequest({ procedureName: 'boom', requestID: '2-1' }),
        ),
      )
      await Promise.resolve()

      const response = findPostedMessage(
        worker,
        (m) =>
          m.event === SyncEvent.SYNC &&
          m.data?.type === SyncEvent.RPC_RESPONSE &&
          m.data?.data?.requestID === '2-1',
      )
      expect(response.data.data.state).toBe('reject')
    })

    it('returns state: reject if an async procedure rejects', async () => {
      module.register('boom', async () => {
        throw new Error('async fail')
      })

      sendFromWorker(
        onMessage,
        syncMessage(
          SyncEvent.RPC_REQUEST,
          makeRpcRequest({ procedureName: 'boom', requestID: '2-2' }),
        ),
      )
      await Promise.resolve()
      await Promise.resolve() // extra flush for async

      const response = findPostedMessage(
        worker,
        (m) =>
          m.event === SyncEvent.SYNC &&
          m.data?.type === SyncEvent.RPC_RESPONSE &&
          m.data?.data?.requestID === '2-2',
      )
      expect(response.data.data.state).toBe('reject')
    })

    it('sends a response with the correct clientID and requestID', async () => {
      module.register('getCount', () => 99)

      sendFromWorker(
        onMessage,
        syncMessage(
          SyncEvent.RPC_REQUEST,
          makeRpcRequest({ clientID: 7, requestID: '7-42' }),
        ),
      )
      await Promise.resolve()

      const response = findSyncMessage(worker, SyncEvent.RPC_RESPONSE)
      expect(response.data.data.clientID).toBe(7)
      expect(response.data.data.requestID).toBe('7-42')
    })

    it('responds with resolve and undefined if the procedure is not found', async () => {
      sendFromWorker(
        onMessage,
        syncMessage(
          SyncEvent.RPC_REQUEST,
          makeRpcRequest({ procedureName: 'unknown' }),
        ),
      )
      await Promise.resolve()

      const response = findSyncMessage(worker, SyncEvent.RPC_RESPONSE)
      expect(response.data.data.state).toBe('resolve')
      expect(response.data.data.result).toBeUndefined()
    })

    it('removes the procedure when the returned unregister function is called', async () => {
      const fn = vi.fn(() => 1)
      const unregister = module.register('temp', fn)
      unregister()

      sendFromWorker(
        onMessage,
        syncMessage(
          SyncEvent.RPC_REQUEST,
          makeRpcRequest({ procedureName: 'temp' }),
        ),
      )
      await Promise.resolve()

      expect(fn).not.toHaveBeenCalled()
    })

    it('does not remove other procedures with the same name during unregistration', () => {
      const fn1 = vi.fn(() => 1)
      const fn2 = vi.fn(() => 2)
      module.register('shared', fn1)
      module.unregister('shared', fn2) // fn2 is not the right function

      // fn1 should remain
      sendFromWorker(
        onMessage,
        syncMessage(
          SyncEvent.RPC_REQUEST,
          makeRpcRequest({ procedureName: 'shared' }),
        ),
      )

      expect(fn1).toHaveBeenCalled()
    })
  })

  describe('call', () => {
    beforeEach(() => {
      sendFromWorker(onMessage, syncMessage(SyncEvent.CONNECT, { clientID: 3 }))
      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.MASTER, { master: false }),
      )
    })

    it('rejects immediately if the tab is the master', () => {
      const masterWorker = createMockWorker()
      const masterModule = new SyncModule(
        masterWorker as unknown as SharedWorker,
      )

      return expect(masterModule.call('getToken')).rejects.toBe(
        'this is master tab',
      )
    })

    it('sends RPC_REQUEST with correct fields', () => {
      worker.port.postMessage.mockClear()
      module.call('getToken', 'arg1', 'arg2')

      const msg = worker.port.postMessage.mock.calls[0]?.[0]
      expect(msg.event).toBe(SyncEvent.SYNC)
      expect(msg.data.type).toBe(SyncEvent.RPC_REQUEST)
      expect(msg.data.data).toMatchObject({
        clientID: 3,
        procedureName: 'getToken',
        params: ['arg1', 'arg2'],
      })
    })

    it('generates a unique requestID for each call', () => {
      worker.port.postMessage.mockClear()
      module.call('getToken')
      module.call('getToken')

      const ids = worker.port.postMessage.mock.calls.map(
        (args: any[]) => args[0].data.data.requestID,
      )
      expect(ids[0]).not.toBe(ids[1])
    })

    it('resolves when RPC_RESPONSE is received with state: resolve', async () => {
      const promise = module.call('getToken')

      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.RPC_RESPONSE, {
          clientID: 3,
          requestID: '3-0',
          state: 'resolve',
          result: 'abc123',
        }),
      )

      await expect(promise).resolves.toBe('abc123')
    })

    it('rejects when RPC_RESPONSE is received with state: reject', async () => {
      const promise = module.call('getToken')

      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.RPC_RESPONSE, {
          clientID: 3,
          requestID: '3-0',
          state: 'reject',
          result: 'error message',
        }),
      )

      await expect(promise).rejects.toBe('error message')
    })

    it('rejects on timeout after 2000ms', async () => {
      const promise = module.call('getToken')
      vi.advanceTimersByTime(2001)
      await expect(promise).rejects.toMatch('was too long')
    })

    it('does not throw if a response arrives after a timeout', async () => {
      const promise = module.call('getToken')
      vi.advanceTimersByTime(2001)
      await promise.catch(() => {})

      expect(() =>
        sendFromWorker(
          onMessage,
          syncMessage(SyncEvent.RPC_RESPONSE, {
            clientID: 3,
            requestID: '3-0',
            state: 'resolve',
            result: 'late',
          }),
        ),
      ).not.toThrow()
    })

    it('ignores RPC_RESPONSE with a mismatched clientID', async () => {
      const promise = module.call('getToken')

      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.RPC_RESPONSE, {
          clientID: 99,
          requestID: '3-0',
          state: 'resolve',
          result: 'abc',
        }),
      )

      // promise should not resolve
      const settled = await Promise.race([
        promise.then(() => 'resolved').catch(() => 'rejected'),
        Promise.resolve('pending'),
      ])
      expect(settled).toBe('pending')

      // cleanup
      vi.advanceTimersByTime(2001)
      await promise.catch(() => {})
    })

    it('resolves multiple parallel calls independently', async () => {
      const p1 = module.call('getToken')
      const p2 = module.call('getUser')

      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.RPC_RESPONSE, {
          clientID: 3,
          requestID: '3-1',
          state: 'resolve',
          result: 'user-data',
        }),
      )

      sendFromWorker(
        onMessage,
        syncMessage(SyncEvent.RPC_RESPONSE, {
          clientID: 3,
          requestID: '3-0',
          state: 'resolve',
          result: 'token-data',
        }),
      )

      await expect(p1).resolves.toBe('token-data')
      await expect(p2).resolves.toBe('user-data')
    })
  })
})
