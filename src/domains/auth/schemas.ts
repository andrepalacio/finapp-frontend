import { z } from 'zod'

export const loginSchema = z.object({
  email:    z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
})

export const registerSchema = z.object({
  name:     z.string().min(2, 'Minimo 2 caracteres'),
  email:    z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
})

export type LoginInput    = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
