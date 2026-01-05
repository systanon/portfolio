import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockEmailRules = {
  required: 'email-required',
  maxLength: 'email-max',
  email: 'email-invalid'
}

const mockPasswordRules = {
  required: 'password-required',
  minLength: 'password-min',
  maxLength: 'password-max'
}

vi.mock('@/application', () => ({
  application: {
    signIn: vi.fn()
  }
}))

vi.mock('@/composables/useValidationRules', () => ({
  useValidationRules: () => ({
    emailRules: mockEmailRules,
    passwordRules: mockPasswordRules
  })
}))

const useVuelidateMock = vi.fn()
vi.mock('@vuelidate/core', () => ({
  default: (...args: any[]) => useVuelidateMock(...args)
}))


import { application } from '@/application'
import { useSignInForm } from './useSignInForm'

describe('useSignInForm (ESM)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with empty fields', () => {
    const { email, password } = useSignInForm()
    expect(email.value).toBe('')
    expect(password.value).toBe('')
  })

  it('passes emailRules and passwordRules to Vuelidate', () => {
    useSignInForm()

    expect(useVuelidateMock).toHaveBeenCalledWith(
      {
        email: mockEmailRules,
        password: mockPasswordRules
      },
      expect.any(Object)
    )
  })

  it('does NOT call signIn when validation fails', async () => {
    useVuelidateMock.mockReturnValue({
      value: { $validate: vi.fn().mockResolvedValue(false) }
    })

    const { submit } = useSignInForm()
    await submit()

    expect(application.signIn).not.toHaveBeenCalled()
  })

  it('calls signIn when validation passes', async () => {
    useVuelidateMock.mockReturnValue({
      value: { $validate: vi.fn().mockResolvedValue(true) }
    })

    const { email, password, submit } = useSignInForm()

    email.value = 'test@mail.com'
    password.value = '123456'

    await submit()

    expect(application.signIn).toHaveBeenCalledWith({
      email: 'test@mail.com',
      password: '123456'
    })
  })
})
