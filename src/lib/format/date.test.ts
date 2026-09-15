import { describe, it, expect } from 'vitest'
import { formatDate, formatDateShort, formatMonthYear, toISODate, todayISO } from './date'

describe('formatDate', () => {
  it('formats an ISO date as day/month/year', () => {
    expect(formatDate('2026-03-15')).toMatch(/15/)
    expect(formatDate('2026-03-15')).toMatch(/2026/)
  })
})

describe('formatDateShort', () => {
  it('omits the year', () => {
    expect(formatDateShort('2026-03-15')).not.toContain('2026')
  })
})

describe('formatMonthYear', () => {
  it('formats month and year', () => {
    const result = formatMonthYear(2026, 3)
    expect(result).toMatch(/2026/)
    expect(result.toLowerCase()).toMatch(/marzo/)
  })
})

describe('toISODate', () => {
  it('formats a Date as YYYY-MM-DD using local calendar fields', () => {
    expect(toISODate(new Date(2026, 2, 15))).toBe('2026-03-15')
  })

  it('does not roll over to the next day in timezones behind UTC', () => {
    // 11pm local time is already the next day in UTC (e.g. America/Bogota, UTC-5).
    // toISODate must report the local date, not the UTC one.
    expect(toISODate(new Date(2026, 2, 15, 23, 0))).toBe('2026-03-15')
  })
})

describe('todayISO', () => {
  it('returns a YYYY-MM-DD string', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
