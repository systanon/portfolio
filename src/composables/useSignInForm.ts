import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useValidationRules } from '@/composables/useValidationRules'
import { useAuth } from './useAuth'

export function useSignInForm() {
  const email = ref('')
  const password = ref('')
  const { singIn } = useAuth()

  const { emailRules, passwordRules } = useValidationRules()

  const rules = {
    email: emailRules,
    password: passwordRules,
  }

  const v$ = useVuelidate(rules, { email, password })

  async function submit(): Promise<void> {
    const isValid = await v$.value.$validate()
    if (!isValid) return

    singIn({
      email: email.value,
      password: password.value,
    })
  }

  return {
    email,
    password,
    v$,
    submit,
  }
}
