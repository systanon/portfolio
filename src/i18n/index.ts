import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import type { MessageSchema } from '@/types/i18n'
import { DEFAULT_LOCALE } from '@/constants'

export const i18n = createI18n<[MessageSchema], typeof DEFAULT_LOCALE>({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
  },
})
