import { describe, it, expect } from 'vitest'
import { formatCurrency, formatAmount } from './currency'

describe('formatCurrency', () => {
  it('formats COP with no decimals by default', () => {
    expect(formatCurrency(50000)).toBe('$ 50.000')
  })

  it('formats other ISO currencies', () => {
    expect(formatCurrency(50, 'USD')).toContain('50')
    expect(formatCurrency(50, 'USD')).toMatch(/US\$|USD/)
  })

  it('rounds to whole units', () => {
    expect(formatCurrency(1234.56)).toBe(formatCurrency(1235))
  })
})

describe('formatAmount', () => {
  it('prefixes negative amounts with a minus sign', () => {
    expect(formatAmount(-50000)).toMatch(/^-/)
  })

  it('shows a plus sign for positive amounts when showSign is set', () => {
    expect(formatAmount(50000, 'COP', { showSign: true })).toMatch(/^\+/)
  })

  it('does not add a sign for positive amounts by default', () => {
    expect(formatAmount(50000)).not.toMatch(/^\+/)
    expect(formatAmount(50000)).not.toMatch(/^-/)
  })

  it('treats zero as non-negative', () => {
    expect(formatAmount(0)).not.toMatch(/^-/)
  })
})
