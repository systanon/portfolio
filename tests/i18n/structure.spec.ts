import { describe, it, expect } from 'vitest'
import en from '@/i18n/locales/en.json'
import uk from '@/i18n/locales/ua.json'
import pl from '@/i18n/locales/pl.json'
import {
  type NestedRecord,
  flattenKeys,
  getPlaceholders,
  getValueByPath,
  findDuplicateValues,
} from '@tests/utils/i18n'

const locales: Record<string, NestedRecord> = { uk, pl }
const enKeys = flattenKeys(en)

describe('i18n structure', () => {
  for (const [name, locale] of Object.entries(locales)) {
    const localeKeys = flattenKeys(locale)

    describe(name, () => {
      it('has no missing keys (compared to en)', () => {
        const missing = enKeys.filter((k) => !localeKeys.includes(k))
        expect(
          missing,
          `Missing keys in ${name}: ${missing.join(', ')}`,
        ).toEqual([])
      })

      it('has no extra keys not present in en', () => {
        const extra = localeKeys.filter((k) => !enKeys.includes(k))
        expect(extra, `Extra keys in ${name}: ${extra.join(', ')}`).toEqual([])
      })

      it('has no empty string values', () => {
        const empty = localeKeys.filter((k) => getValueByPath(locale, k) === '')
        expect(empty, `Empty values in ${name}: ${empty.join(', ')}`).toEqual(
          [],
        )
      })

      it('has matching placeholders (e.g. {folder}) compared to en', () => {
        const mismatches: string[] = []

        for (const key of enKeys) {
          const enVal = getValueByPath(en, key)
          const localeVal = getValueByPath(locale, key)

          if (typeof enVal !== 'string' || typeof localeVal !== 'string')
            continue

          const enPlaceholders = getPlaceholders(enVal).sort()
          const localePlaceholders = getPlaceholders(localeVal).sort()

          if (
            JSON.stringify(enPlaceholders) !==
            JSON.stringify(localePlaceholders)
          ) {
            mismatches.push(
              `${key}: en=${JSON.stringify(enPlaceholders)} ${name}=${JSON.stringify(localePlaceholders)}`,
            )
          }
        }

        expect(
          mismatches,
          `Placeholder mismatches in ${name}:\n${mismatches.join('\n')}`,
        ).toEqual([])
      })

      it.skip('has no duplicate values within the same namespace', () => {
        const duplicates = findDuplicateValues(locale)
        expect(
          duplicates,
          `Duplicate values in ${name}:\n${duplicates.join('\n')}`,
        ).toEqual([])
      })
    })
  }
})
