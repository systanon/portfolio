import en from '@/i18n/locales/en.json'

export type MessageSchema = typeof en
export type SupportedLocale = 'en' | 'pl' | 'ua'

export const SUPPORT_LOCALES: SupportedLocale[] = ['en', 'pl', 'ua']
export const DEFAULT_LOCALE: SupportedLocale = 'en'
export type PartialMessages = { [K in SupportedLocale]: MessageSchema }
