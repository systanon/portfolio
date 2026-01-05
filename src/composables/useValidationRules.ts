import { helpers, required, minLength, maxLength, email as emailValidation, sameAs } from '@vuelidate/validators'
import type { Ref } from 'vue'

export function useValidationRules() {
  const emailRules = {
    required: helpers.withMessage('Email is required', required),
    maxLength: helpers.withMessage('To much characters', maxLength(100)),
    email: helpers.withMessage('invalid email', emailValidation),
  }

  const passwordRules = {
    required: helpers.withMessage('Password is required', required),
    minLength: helpers.withMessage('Minimum 8 characters', minLength(8)),
    maxLength: helpers.withMessage('Maximum 50 charecters', maxLength(50))
  }

  const companyNameRules = {
    maxLength: helpers.withMessage('To much characters', maxLength(100)),
    minLength: helpers.withMessage('Minimum 3 characters', minLength(3)),
    required: helpers.withMessage('Company name is required', required),
  }

  const contactNameRules = {
    maxLength: helpers.withMessage('To much characters', maxLength(100)),
    minLength: helpers.withMessage('Minimum 3 characters', minLength(3)),
    required: helpers.withMessage('Contact name is required', required),
  }

  const titleRules = {
    required: helpers.withMessage('Title is required', required),
    maxLength: helpers.withMessage('To much characters', maxLength(100)),
    minLength: helpers.withMessage('Minimum 3 characters', minLength(3)),
  }

  const descriptionRules = {
    required: helpers.withMessage('Description is required', required),
    maxLength: helpers.withMessage('To much characters', maxLength(100)),
    minLength: helpers.withMessage('Minimum 3 characters', minLength(3)),
  }

  const confirmPasswordRules = (password: Ref<string>) => ({
    required: helpers.withMessage('Confirm password is required', required),
    sameAsPassword: helpers.withMessage(
      'Passwords do not match',
      sameAs(password)
    ),
  })

  return {
    emailRules,
    passwordRules,
    companyNameRules,
    contactNameRules,
    titleRules,
    descriptionRules,
    confirmPasswordRules
  }
}