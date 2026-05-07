import { z } from 'zod'

export const createSavingsGoalSchema = z.object({
  name:          z.string().min(1),
  target_amount: z.number().positive(),
  deadline:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  notes:         z.string().nullable().optional(),
})

export const createContributionSchema = z.object({
  amount:         z.number().positive(),
  contributed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes:          z.string().nullable().optional(),
})

export type CreateSavingsGoalInput  = z.infer<typeof createSavingsGoalSchema>
export type CreateContributionInput = z.infer<typeof createContributionSchema>
