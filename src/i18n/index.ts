import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import type {
  MessageSchema,
  SupportedLocale,
  PartialMessages,
} from '@/types/i18n'

export const i18n = createI18n<[MessageSchema], SupportedLocale>({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    pl: {} as MessageSchema,
    ua: {} as MessageSchema,
  } as PartialMessages,
})
