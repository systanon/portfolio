import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import { withSetup } from '@/tests/utils/withSetup'
import { SUPPORT_LOCALES, DEFAULT_LOCALE } from '@/constants'

vi.mock('@/i18n/locales/en.json', () => ({
  default: { header: { title: 'Hello' } },
}))
vi.mock('@/i18n/locales/pl.json', () => ({
  default: { header: { title: 'Cześć' } },
}))
vi.mock('@/i18n/locales/ua.json', () => ({
  default: { header: { title: 'Привіт' } },
}))

function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en: { header: { title: 'Hello' } }, pl: {}, ua: {} },
  })
}

describe('getFromUrl', () => {
  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
  })
  afterEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('returns locale from ?lang= and removes the parameter from URL', async () => {
    window.history.replaceState({}, '', '/?lang=pl')

    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { initLocale, currentLocale } = withSetup(() => useLocale(), [i18n])

    await initLocale()

    expect(currentLocale.value).toBe('pl')
    expect(window.location.search).toBe('')
  })

  it('ignores unsupported lang parameter', async () => {
    window.history.replaceState({}, '', '/?lang=de')

    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { initLocale, currentLocale } = withSetup(() => useLocale(), [i18n])

    await initLocale()

    expect(currentLocale.value).toBe(DEFAULT_LOCALE)
  })

  it('preserves other query parameters when removing lang', async () => {
    window.history.replaceState({}, '', '/?lang=pl&foo=bar')

    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { initLocale } = withSetup(() => useLocale(), [i18n])

    await initLocale()

    expect(window.location.search).toBe('?foo=bar')
  })
})

describe('getFromStorage', () => {
  beforeEach(() => localStorage.clear())

  it('returns locale from localStorage', async () => {
    localStorage.setItem('locale', 'ua')

    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { initLocale, currentLocale } = withSetup(() => useLocale(), [i18n])

    await initLocale()

    expect(currentLocale.value).toBe('ua')
  })

  it('ignores unsupported value in localStorage', async () => {
    localStorage.setItem('locale', 'de')

    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { initLocale, currentLocale } = withSetup(() => useLocale(), [i18n])

    await initLocale()

    expect(currentLocale.value).toBe(DEFAULT_LOCALE)
  })
})

describe('getFromBrowser', () => {
  beforeEach(() => localStorage.clear())

  it('gets locale from navigator.languages', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue([
      'pl-PL',
      'pl',
      'en',
    ])

    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { initLocale, currentLocale } = withSetup(() => useLocale(), [i18n])

    await initLocale()

    expect(currentLocale.value).toBe('pl')
    vi.restoreAllMocks()
  })

  it('falls back to DEFAULT_LOCALE if no languages are supported', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['de', 'fr'])

    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { initLocale, currentLocale } = withSetup(() => useLocale(), [i18n])

    await initLocale()

    expect(currentLocale.value).toBe(DEFAULT_LOCALE)
    vi.restoreAllMocks()
  })
})

describe('priority: url > storage > browser', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
    vi.restoreAllMocks()
  })

  it('URL has priority over storage and browser', async () => {
    window.history.replaceState({}, '', '/?lang=ua')
    localStorage.setItem('locale', 'pl')
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en'])

    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { initLocale, currentLocale } = withSetup(() => useLocale(), [i18n])

    await initLocale()

    expect(currentLocale.value).toBe('ua')
  })

  it('storage has priority over browser', async () => {
    localStorage.setItem('locale', 'pl')
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['ua'])

    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { initLocale, currentLocale } = withSetup(() => useLocale(), [i18n])

    await initLocale()

    expect(currentLocale.value).toBe('pl')
  })
})

describe('setLocale', () => {
  beforeEach(() => localStorage.clear())

  it('persists locale to localStorage', async () => {
    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { setLocale } = withSetup(() => useLocale(), [i18n])

    await setLocale('pl')

    expect(localStorage.getItem('locale')).toBe('pl')
  })

  it('sets the lang attribute on the <html> element', async () => {
    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { setLocale } = withSetup(() => useLocale(), [i18n])

    await setLocale('ua')

    expect(document.documentElement.getAttribute('lang')).toBe('ua')
  })

  it('does not reload the locale file if already cached', async () => {
    const importSpy = vi.spyOn(await import('./useLocale'), 'useLocale')

    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { setLocale } = withSetup(() => useLocale(), [i18n])

    await setLocale('pl')
    await setLocale('pl')

    expect(importSpy).toHaveBeenCalledTimes(1)
    importSpy.mockRestore()
  })
})

describe('supportedLocales', () => {
  it('returns a list of all supported locales', async () => {
    const i18n = createTestI18n()
    const { useLocale } = await import('./useLocale')
    const { supportedLocales } = withSetup(() => useLocale(), [i18n])

    expect(supportedLocales).toEqual(SUPPORT_LOCALES)
  })
})
