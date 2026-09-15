import { z } from 'zod'

export const createSavingsGoalSchema = z.object({
  name:          z.string().min(1, 'Requerido'),
  target_amount: z.number().positive('Debe ser mayor a 0'),
  // The date input submits "" when left empty, not null/undefined — normalize
  // it before validating so an optional field doesn't fail the date regex.
  deadline: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  ),
  notes:         z.string().nullable().optional(),
})

export const createContributionSchema = z.object({
  amount:         z.number().positive('Debe ser mayor a 0'),
  contributed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes:          z.string().nullable().optional(),
})

export type CreateSavingsGoalInput  = z.infer<typeof createSavingsGoalSchema>
export type CreateContributionInput = z.infer<typeof createContributionSchema>
