import { z } from 'zod'

export const upsertBudgetSchema = z.object({
  year:        z.number().int().min(2000).max(2100),
  month:       z.number().int().min(1).max(12),
  total_limit: z.number().positive(),
  categories:  z.array(z.object({
    category_id:  z.string().uuid(),
    limit_amount: z.number().positive(),
  })),
})

export type UpsertBudgetInput = z.infer<typeof upsertBudgetSchema>
