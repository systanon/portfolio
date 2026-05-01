import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  SUPPORT_LOCALES,
  type SupportedLocale,
  DEFAULT_LOCALE,
} from '@/types/i18n'

const loadedLocales = new Set<SupportedLocale>()

function getFromUrl(): SupportedLocale | null {
  const params = new URLSearchParams(window.location.search)
  const lang = params.get('lang')

  if (lang && SUPPORT_LOCALES.includes(lang as SupportedLocale)) {
    params.delete('lang')
    const newSearch = params.toString()
    window.history.replaceState(
      {},
      '',
      newSearch
        ? `${window.location.pathname}?${newSearch}`
        : window.location.pathname,
    )
    return lang as SupportedLocale
  }
  return null
}

function getFromStorage(): SupportedLocale | null {
  const saved = localStorage.getItem('locale') as SupportedLocale | null
  return saved && SUPPORT_LOCALES.includes(saved) ? saved : null
}

function getFromBrowser(): SupportedLocale | null {
  for (const lang of navigator.languages) {
    const short = lang.split('-')[0] as SupportedLocale
    if (SUPPORT_LOCALES.includes(short)) return short
  }
  return null
}

export function useLocale() {
  const { locale, setLocaleMessage } = useI18n()

  const currentLocale = computed(() => locale.value as SupportedLocale)

  async function loadLocale(lang: SupportedLocale): Promise<void> {
    if (loadedLocales.has(lang)) return

    const messages = await import(`@/i18n/locales/${lang}.json`)
    setLocaleMessage(lang, messages.default)
    loadedLocales.add(lang)
  }

  async function setLocale(lang: SupportedLocale): Promise<void> {
    await loadLocale(lang)
    locale.value = lang
    localStorage.setItem('locale', lang)
    document.documentElement.setAttribute('lang', lang)
  }

  async function resolveAndApply(): Promise<void> {
    const resolved =
      getFromUrl() ?? getFromStorage() ?? getFromBrowser() ?? DEFAULT_LOCALE

    await setLocale(resolved)
  }

  return {
    currentLocale,
    setLocale,
    resolveAndApply,
    supportedLocales: SUPPORT_LOCALES,
  }
}
