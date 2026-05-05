import { SUPPORT_LOCALES } from '@/constants'
import type { SupportedLocale } from '@/types/i18n'

export function getFromUrl(
  search = window.location.search,
  replaceState = window.history.replaceState.bind(window.history),
  pathname = window.location.pathname,
): SupportedLocale | null {
  const params = new URLSearchParams(search)
  const lang = params.get('lang')

  if (lang && SUPPORT_LOCALES.includes(lang as SupportedLocale)) {
    params.delete('lang')
    const newSearch = params.toString()
    replaceState({}, '', newSearch ? `${pathname}?${newSearch}` : pathname)
    return lang as SupportedLocale
  }
  return null
}

export function getFromStorage(
  storage: Pick<Storage, 'getItem'> = localStorage,
): SupportedLocale | null {
  const saved = storage.getItem('locale') as SupportedLocale | null
  return saved && SUPPORT_LOCALES.includes(saved) ? saved : null
}

export function getFromBrowser(
  languages: readonly string[] = navigator.languages,
): SupportedLocale | null {
  for (const lang of languages) {
    const short = lang.split('-')[0] as SupportedLocale
    if (SUPPORT_LOCALES.includes(short)) return short
  }
  return null
}
