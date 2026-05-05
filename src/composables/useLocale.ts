import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORT_LOCALES, DEFAULT_LOCALE } from '@/constants'
import type { SupportedLocale } from '@/types/i18n'
import {
  getFromUrl,
  getFromStorage,
  getFromBrowser,
} from '@/i18n/localeDetectors'

const loadedLocales = new Set<SupportedLocale>()

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

  async function initLocale(): Promise<void> {
    const resolved =
      getFromUrl() ?? getFromStorage() ?? getFromBrowser() ?? DEFAULT_LOCALE

    await setLocale(resolved)
  }

  return {
    currentLocale,
    setLocale,
    initLocale,
    supportedLocales: SUPPORT_LOCALES,
  }
}
