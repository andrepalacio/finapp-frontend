import { z } from 'zod'

export const createDebtSchema = z.object({
  name:               z.string().min(1),
  lender:             z.string().nullable().optional(),
  principal:          z.number().positive(),
  rate:               z.number().positive(),
  rate_type:          z.enum(['effective_annual', 'nominal_annual', 'monthly']),
  installments:       z.number().int().positive(),
  first_payment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes:              z.string().nullable().optional(),
  insurance_rate:     z.preprocess((v) => (typeof v === 'number' && isNaN(v) ? 0 : v), z.number().min(0)).default(0),
  insurance_type:     z.union([z.literal(''), z.literal('fixed_monthly'), z.literal('on_balance')]).default(''),
})

export type CreateDebtInput = z.infer<typeof createDebtSchema>
