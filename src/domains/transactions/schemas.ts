import { z } from 'zod'

export const createTransactionSchema = z.object({
  type:        z.enum(['expense', 'income', 'transfer']),
  amount:      z.number().positive('El monto debe ser positivo'),
  category_id: z.string().uuid().nullable().optional(),
  description: z.string().max(255).nullable().optional(),
  date:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
