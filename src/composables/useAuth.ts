import type {
  ConfirmQuery,
  ForgotPasswordDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from '@/types/auth'
import { application } from '@/application'
import { AppSuccess } from '@/types/app.types'
import { router } from '@/plugins/router'
import type { RouteName } from '@/types/router'

export function useAuth() {
  const { authApplication, userApplication } = application

  const signIn = async (dto: SignInDto) => {
    const response = await authApplication.signIn(dto)
    if (response instanceof AppSuccess) {
      const profile = await userApplication.getProfile()
      if (profile instanceof AppSuccess) {
        router.push({ name: 'Profile' satisfies RouteName })
      }
    }
    return response
  }

  const logout = async () => {
    const response = await authApplication.logout()
    if (response instanceof AppSuccess) {
      userApplication.clearProfile()
      router.checkAccessCurrentRoute()
    }
    return response
  }

  const signUp = async (dto: SignUpDto) => {
    const response = await authApplication.signUp(dto)
    if (response instanceof AppSuccess) {
      router.push({ name: 'RegistrationSuccess' satisfies RouteName })
    }
    return response
  }

  const confirmEmail = async (params: ConfirmQuery) => {
    const response = await authApplication.confirmEmail(params)

    if (response instanceof AppSuccess) {
      const profile = await userApplication.getProfile()
      if (profile instanceof AppSuccess) {
        router.push({ name: 'Profile' satisfies RouteName })
      }
    }
    return response
  }

  const resendConfirmEmail = async (dto: ResendConfirmEmailDto) => {
    const response = await authApplication.resendConfirmEmail(dto)
    if (response instanceof AppSuccess) {
      router.push({ name: 'RegistrationSuccess' satisfies RouteName })
    }
    return response
  }

  const forgotPassword = async (dto: ForgotPasswordDto) => {
    const response = await authApplication.forgotPassword(dto)
    if (response instanceof AppSuccess) {
      router.push({ name: 'ForgotPasswordSuccess' satisfies RouteName })
    }
    return response
  }

  const resetPassword = async (dto: ResetPasswordDto) => {
    const response = await authApplication.resetPassword(dto)
    if (response instanceof AppSuccess) {
      router.push({ name: 'SignIn' satisfies RouteName })
    }
    return response
  }

  return {
    signIn,
    logout,
    signUp,
    confirmEmail,
    resendConfirmEmail,
    forgotPassword,
    resetPassword,
  }
}
