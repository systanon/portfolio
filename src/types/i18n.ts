import type { SUPPORT_LOCALES } from '@/constants'
import en from '@/i18n/locales/en.json'

export type MessageSchema = typeof en
export type SupportedLocale = (typeof SUPPORT_LOCALES)[number]
export type LocaleOption = {
  value: SupportedLocale
  label: Uppercase<SupportedLocale>
}
