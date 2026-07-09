import { z } from 'zod'

export const createWorkspaceSchema = z.object({
  name:     z.string().min(1),
  currency: z.string().length(3, 'Codigo ISO 4217 de 3 letras'),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>

export const inviteMemberSchema = z.object({
  email: z.string().email('Email invalido'),
  role:  z.enum(['member', 'admin']),
})

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
