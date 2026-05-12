import { describe, expect, it, vi } from 'vitest'

import {
  getFromUrl,
  getFromStorage,
  getFromBrowser,
} from '@/i18n/localeDetectors'

describe('getFromUrl', () => {
  it('returns locale from ?lang=pl', () => {
    expect(getFromUrl('?lang=pl', vi.fn())).toBe('pl')
  })

  it('ignores unsupported locale', () => {
    expect(getFromUrl('?lang=xx', vi.fn())).toBeNull()
  })
})
describe('getFromStorage', () => {
  it('returns saved locale', () => {
    const storage = { getItem: () => 'ua' }
    expect(getFromStorage(storage)).toBe('ua')
  })
})
describe('getFromBrowser', () => {
  it('returns first matching language', () => {
    expect(getFromBrowser(['pl-PL', 'en-US'])).toBe('pl')
  })
})
