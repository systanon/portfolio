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

export function useAuth() {
  const { authApplication, userApplication } = application
  const signIn = async (dto: SignInDto) => {
    const result = await authApplication.signIn(dto)
    if (result instanceof AppSuccess) {
      const profile = await userApplication.getProfile()
      if (profile instanceof AppSuccess) {
        router.push({ name: 'Profile' })
      }
    }
  }

  const logout = async () => {
    const res = await authApplication.logout()
    if (res instanceof AppSuccess) {
      userApplication.clearProfile()
      router.checkAccessCurrentRoute()
    }
  }

  const signUp = async (dto: SignUpDto) => {
    return authApplication.signUp(dto)
  }

  const confirmEmail = (params: ConfirmQuery) => {
    return authApplication.confirmEmail(params)
  }

  const resendConfirmEmail = async (dto: ResendConfirmEmailDto) => {
    return authApplication.resendConfirmEmail(dto)
  }

  const forgotPassword = async (dto: ForgotPasswordDto) => {
    return authApplication.forgotPassword(dto)
  }

  const resetPassword = async (dto: ResetPasswordDto) => {
    return authApplication.resetPassword(dto)
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
