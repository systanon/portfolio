import {
  helpers,
  required,
  minLength,
  maxLength,
  email as emailValidation,
  sameAs,
} from '@vuelidate/validators'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useValidationRules() {
  const { t } = useI18n()
  const emailRules = {
    required: helpers.withMessage(
      () => t('validation.email_required'),
      required,
    ),
    maxLength: helpers.withMessage(
      () => t('validation.too_much_characters'),
      maxLength(100),
    ),
    email: helpers.withMessage(
      () => t('validation.invalid_email'),
      emailValidation,
    ),
    $autoDirty: true,
  }

  const passwordRules = {
    required: helpers.withMessage(
      () => t('validation.password_required'),
      required,
    ),
    minLength: helpers.withMessage(
      () => t('validation.minimum_8_characters'),
      minLength(8),
    ),
    maxLength: helpers.withMessage(
      () => t('validation.maximum_50_characters'),
      maxLength(50),
    ),
    $autoDirty: true,
  }

  const companyNameRules = {
    maxLength: helpers.withMessage(
      () => t('validation.too_much_characters'),
      maxLength(100),
    ),
    minLength: helpers.withMessage(
      () => t('validation.minimum_3_characters'),
      minLength(3),
    ),
    required: helpers.withMessage(
      () => t('validation.company_name_required'),
      required,
    ),
    $autoDirty: true,
  }

  const contactNameRules = {
    maxLength: helpers.withMessage(
      () => t('validation.too_much_characters'),
      maxLength(100),
    ),
    minLength: helpers.withMessage(
      () => t('validation.minimum_3_characters'),
      minLength(3),
    ),
    required: helpers.withMessage(
      () => t('validation.contact_name_required'),
      required,
    ),
    $autoDirty: true,
  }

  const titleRules = {
    required: helpers.withMessage(
      () => t('validation.title_required'),
      required,
    ),
    maxLength: helpers.withMessage(
      () => t('validation.too_much_characters'),
      maxLength(100),
    ),
    minLength: helpers.withMessage(
      () => t('validation.minimum_3_characters'),
      minLength(3),
    ),
    $autoDirty: true,
  }

  const descriptionRules = {
    required: helpers.withMessage(
      () => t('validation.description_required'),
      required,
    ),
    maxLength: helpers.withMessage(
      () => t('validation.too_much_characters'),
      maxLength(100),
    ),
    minLength: helpers.withMessage(
      () => t('validation.minimum_3_characters'),
      minLength(3),
    ),
    $autoDirty: true,
  }

  const confirmPasswordRules = (password: Ref<string>) => ({
    required: helpers.withMessage(
      () => t('validation.confirm_password_required'),
      required,
    ),
    sameAsPassword: helpers.withMessage(
      () => t('validation.passwords_do_not_match'),
      sameAs(password),
    ),
    $autoDirty: true,
  })

  return {
    emailRules,
    passwordRules,
    companyNameRules,
    contactNameRules,
    titleRules,
    descriptionRules,
    confirmPasswordRules,
  }
}
