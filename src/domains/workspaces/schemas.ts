import { z } from 'zod'

export const createWorkspaceSchema = z.object({
  name:     z.string().min(1),
  currency: z.string().length(3, 'Codigo ISO 4217 de 3 letras'),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
