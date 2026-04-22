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
  const singIn = async (dto: SignInDto) => {
    const result = await application.authApplication.signIn(dto)
    if (result instanceof AppSuccess) {
      const profile = await application.userApplication.getProfile()
      if (profile instanceof AppSuccess) {
        router.push({ name: 'Profile' })
      }
    }
  }

  const logout = async () => {
    return application.authApplication.logout()
  }

  const signUp = async (dto: SignUpDto) => {
    return application.authApplication.signUp(dto)
  }

  const confirmEmail = (params: ConfirmQuery) => {
    return application.authApplication.confirmEmail(params)
  }

  const resendConfirmEmail = async (dto: ResendConfirmEmailDto) => {
    return application.authApplication.resendConfirmEmail(dto)
  }

  const forgotPassword = async (dto: ForgotPasswordDto) => {
    return application.authApplication.forgotPassword(dto)
  }

  const resetPassword = async (dto: ResetPasswordDto) => {
    return application.authApplication.resetPassword(dto)
  }

  return {
    singIn,
    logout,
    signUp,
    confirmEmail,
    resendConfirmEmail,
    forgotPassword,
    resetPassword,
  }
}
