import { z } from 'zod'

export const createCategorySchema = z.object({
  name:  z.string().min(1),
  icon:  z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  type:  z.enum(['expense', 'income', 'both']),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
