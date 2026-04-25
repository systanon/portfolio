import { describe, it, expect } from 'vitest'
import { LogLevel, LEVELS } from './logger'

describe('LogLevel', () => {
  it('all levels are enabled by default.', () => {
    const logLevel = new LogLevel()
    expect(logLevel.isAllowed('error')).toBe(true)
    expect(logLevel.isAllowed('log')).toBe(true)
  })

  it('offAll disables all levels', () => {
    const logLevel = new LogLevel()
    logLevel.offAll()
    LEVELS.forEach((level) => expect(logLevel.isAllowed(level)).toBe(false))
  })

  it('set ignores invalid levels', () => {
    const logLevel = new LogLevel()
    logLevel.set(['error', 'unknown' as any])
    expect(logLevel.levels).toEqual(['error'])
  })
})
