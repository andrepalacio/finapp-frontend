import { describe, it, expect } from 'vitest'
import { createTransactionSchema } from './schemas'

const valid = {
  type:        'expense' as const,
  amount:      50000,
  category_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  description: 'Mercado',
  date:        '2026-03-15',
}

describe('createTransactionSchema', () => {
  it('accepts a valid transaction', () => {
    expect(createTransactionSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a non-positive amount', () => {
    const result = createTransactionSchema.safeParse({ ...valid, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid type', () => {
    const result = createTransactionSchema.safeParse({ ...valid, type: 'refund' })
    expect(result.success).toBe(false)
  })

  it('rejects a malformed date', () => {
    const result = createTransactionSchema.safeParse({ ...valid, date: '15-03-2026' })
    expect(result.success).toBe(false)
  })

  it('treats an empty category_id as absent instead of failing uuid validation', () => {
    const result = createTransactionSchema.safeParse({ ...valid, category_id: '' })
    expect(result.success).toBe(true)
  })

  it('rejects a non-uuid category_id', () => {
    const result = createTransactionSchema.safeParse({ ...valid, category_id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('allows a null description', () => {
    const result = createTransactionSchema.safeParse({ ...valid, description: null })
    expect(result.success).toBe(true)
  })
})
