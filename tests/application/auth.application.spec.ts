import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthApplication } from '@/application/auth.application'
import { AppSuccess } from '@/types/app.types'
import { AppError } from '@/types/app-errors'

const mockAuthService = {
  authorization: vi.fn(),
  registration: vi.fn(),
  confirmEmail: vi.fn(),
  resendConfirmEmail: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  refresh: vi.fn(),
  logout: vi.fn(),
}
const mockTokenManager = {
  setToken: vi.fn(),
  getToken: vi.fn(),
  clearToken: vi.fn(),
}
const mockNotificationModule = { notify: vi.fn() }

const makeAuthApplication = () =>
  new AuthApplication(
    mockAuthService as any,
    mockTokenManager as any,
    mockNotificationModule as any,
  )

describe('AuthApplication', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('refresh', () => {
    it('sets the token and returns the response on success', async () => {
      mockAuthService.refresh.mockResolvedValue(
        new AppSuccess({ access_token: 'new-token' }),
      )
      const auth = makeAuthApplication()

      const result = await auth.refresh()

      expect(result).toBeInstanceOf(AppSuccess)
      expect(mockTokenManager.setToken).toHaveBeenCalledExactlyOnceWith(
        'new-token',
      )
    })

    it('does not set a token when refresh fails', async () => {
      mockAuthService.refresh.mockResolvedValue(
        new AppError('Unauthorized', '401'),
      )
      const auth = makeAuthApplication()

      const result = await auth.refresh()

      expect(result).toBeInstanceOf(AppError)
      expect(mockTokenManager.setToken).not.toHaveBeenCalled()
    })

    it('deduplicates concurrent calls into a single authService request', async () => {
      let resolveRefresh!: (value: AppSuccess) => void
      mockAuthService.refresh.mockReturnValue(
        new Promise((resolve) => {
          resolveRefresh = resolve
        }),
      )
      const auth = makeAuthApplication()

      const first = auth.refresh()
      const second = auth.refresh()
      const third = auth.refresh()

      resolveRefresh(new AppSuccess({ access_token: 'shared-token' }))
      const [r1, r2, r3] = await Promise.all([first, second, third])

      expect(mockAuthService.refresh).toHaveBeenCalledOnce()
      expect(r1).toBe(r2)
      expect(r2).toBe(r3)
      expect(mockTokenManager.setToken).toHaveBeenCalledExactlyOnceWith(
        'shared-token',
      )
    })

    it('issues a new request once the in-flight refresh has settled', async () => {
      mockAuthService.refresh
        .mockResolvedValueOnce(new AppSuccess({ access_token: 'token-1' }))
        .mockResolvedValueOnce(new AppSuccess({ access_token: 'token-2' }))
      const auth = makeAuthApplication()

      await auth.refresh()
      await auth.refresh()

      expect(mockAuthService.refresh).toHaveBeenCalledTimes(2)
      expect(mockTokenManager.setToken).toHaveBeenNthCalledWith(1, 'token-1')
      expect(mockTokenManager.setToken).toHaveBeenNthCalledWith(2, 'token-2')
    })

    it('allows a fresh request after a failed refresh settles', async () => {
      mockAuthService.refresh
        .mockResolvedValueOnce(new AppError('Unauthorized', '401'))
        .mockResolvedValueOnce(new AppSuccess({ access_token: 'token-2' }))
      const auth = makeAuthApplication()

      const failed = await auth.refresh()
      const succeeded = await auth.refresh()

      expect(failed).toBeInstanceOf(AppError)
      expect(succeeded).toBeInstanceOf(AppSuccess)
      expect(mockAuthService.refresh).toHaveBeenCalledTimes(2)
    })
  })

  describe('signIn', () => {
    it('sets the token on success', async () => {
      mockAuthService.authorization.mockResolvedValue(
        new AppSuccess({ access_token: 'token' }),
      )
      const auth = makeAuthApplication()

      await auth.signIn({ email: 'a@b.com', password: 'secret' })

      expect(mockTokenManager.setToken).toHaveBeenCalledExactlyOnceWith(
        'token',
      )
      expect(mockNotificationModule.notify).not.toHaveBeenCalled()
    })

    it('notifies on error and does not set a token', async () => {
      mockAuthService.authorization.mockResolvedValue(
        new AppError('Invalid credentials', '400'),
      )
      const auth = makeAuthApplication()

      await auth.signIn({ email: 'a@b.com', password: 'wrong' })

      expect(mockTokenManager.setToken).not.toHaveBeenCalled()
      expect(mockNotificationModule.notify).toHaveBeenCalledExactlyOnceWith(
        'error',
        'Invalid credentials',
      )
    })
  })

  describe('logout', () => {
    it('clears the token on success', async () => {
      mockAuthService.logout.mockResolvedValue(new AppSuccess(null))
      const auth = makeAuthApplication()

      await auth.logout()

      expect(mockTokenManager.clearToken).toHaveBeenCalledOnce()
    })

    it('notifies on error and does not clear the token', async () => {
      mockAuthService.logout.mockResolvedValue(new AppError('Failed', '500'))
      const auth = makeAuthApplication()

      await auth.logout()

      expect(mockTokenManager.clearToken).not.toHaveBeenCalled()
      expect(mockNotificationModule.notify).toHaveBeenCalledExactlyOnceWith(
        'error',
        'Failed',
      )
    })
  })
})
