import type { LocaleOption } from '@/types/i18n'

export const SUPPORT_LOCALES = ['en', 'pl', 'ua'] as const
export const DEFAULT_LOCALE = 'en' as const

export const LOCALES_OPTIONS: LocaleOption[] = [
  { value: 'en', label: 'EN' },
  { value: 'pl', label: 'PL' },
  { value: 'ua', label: 'UA' },
]
