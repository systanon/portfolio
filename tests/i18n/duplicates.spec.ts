import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function findDuplicateKeys(jsonText: string): string[] {
  const duplicates: string[] = []
  const keyStack: string[][] = []
  let currentKeys: string[] = []

  const allMatches: Array<
    | { type: 'key'; key: string; index: number }
    | { type: 'brace'; char: string; index: number }
  > = []

  for (const m of jsonText.matchAll(/"((?:[^"\\]|\\.)*)"\s*:/g)) {
    allMatches.push({ type: 'key', key: m[1], index: m.index! })
  }
  for (const m of jsonText.matchAll(/[{}]/g)) {
    allMatches.push({ type: 'brace', char: m[0], index: m.index! })
  }

  allMatches.sort((a, b) => a.index - b.index)

  for (const match of allMatches) {
    if (match.type === 'brace') {
      if (match.char === '{') {
        keyStack.push(currentKeys)
        currentKeys = []
      } else {
        currentKeys = keyStack.pop() ?? []
      }
    } else {
      if (currentKeys.includes(match.key)) {
        duplicates.push(match.key)
      } else {
        currentKeys.push(match.key)
      }
    }
  }

  return duplicates
}

const localeFiles = ['en', 'ua', 'pl']

describe('i18n duplicate keys', () => {
  for (const locale of localeFiles) {
    it(`${locale}.json has no duplicate keys`, () => {
      const filePath = resolve(
        __dirname,
        `../../src/i18n/locales/${locale}.json`,
      )
      const text = readFileSync(filePath, 'utf-8')
      const duplicates = findDuplicateKeys(text)
      expect(
        duplicates,
        `Duplicate keys in ${locale}.json: ${duplicates.join(', ')}`,
      ).toEqual([])
    })
  }
})
