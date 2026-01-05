import { ref } from 'vue'
import type { BaseValidation } from '@vuelidate/core'

export function createValidationMock(initialErrors: string[] = []) {
  const $error = ref(initialErrors.length > 0)
  const $errors = ref(
    initialErrors.map(msg => ({ $message: ref(msg) }))
  )

  return {
    validation: {
      get $error() {
        return $error.value
      },
      get $errors() {
        return $errors.value
      }
    } as unknown as BaseValidation,

    setErrors(messages: string[]) {
      $errors.value = messages.map(msg => ({ $message: ref(msg) }))
      $error.value = messages.length > 0
    },

    clear() {
      $errors.value = []
      $error.value = false
    }
  }
}
