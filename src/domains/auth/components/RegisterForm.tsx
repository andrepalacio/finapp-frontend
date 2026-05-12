'use client'

import { useState }    from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter }   from 'next/navigation'
import Link            from 'next/link'
import { registerSchema, type RegisterInput } from '@/domains/auth/schemas'
import { useRegister } from '@/domains/auth/hooks/useAuth'
import { ApiError }    from '@/lib/api/client'

function passwordStrength(pwd: string): { score: number; label: string } {
  if (!pwd) return { score: 0, label: '' }
  let score = 0
  if (pwd.length >= 8)            score++
  if (/[0-9]/.test(pwd))          score++
  if (/[A-Z]/.test(pwd))          score++
  if (/[^A-Za-z0-9]/.test(pwd))   score++
  const labels = ['', 'Debil', 'Regular', 'Buena', 'Fuerte']
  return { score, label: labels[score] ?? '' }
}

function barColor(score: number, index: number): string {
  if (index >= score) return 'bg-line'
  if (score <= 2)     return 'bg-gold'
  if (score === 3)    return 'bg-emerald/70'
  return 'bg-emerald'
}

export function RegisterForm() {
  const router     = useRouter()
  const [showPwd, setShowPwd] = useState(false)
  const doRegister = useRegister()

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const pwd = useWatch({ control, name: 'password', defaultValue: '' })
  const { score, label } = passwordStrength(pwd ?? '')

  async function onSubmit(data: RegisterInput) {
    try {
      await doRegister.mutateAsync(data)
      router.push('/')
      router.refresh()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al crear la cuenta'
      setError('root', { message: msg })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
          Nombre completo
        </label>
        <input
          type="text"
          autoComplete="name"
          placeholder="Mariana Rivera"
          {...register('name')}
          className="w-full px-3 py-2.5 text-sm bg-surface border border-line rounded-[var(--r-sm)] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"
        />
        {errors.name && (
          <p className="text-[11px] text-terra mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
          Correo
        </label>
        <input
          type="email"
          autoComplete="email"
          {...register('email')}
          className="w-full px-3 py-2.5 text-sm bg-surface border border-line rounded-[var(--r-sm)] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"
        />
        {errors.email && (
          <p className="text-[11px] text-terra mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password + strength */}
      <div>
        <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
          Contrasena
        </label>
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
            {...register('password')}
            className="w-full px-3 py-2.5 pr-16 text-sm bg-surface border border-line rounded-[var(--r-sm)] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] uppercase tracking-[0.08em] font-medium text-ink-3 hover:text-ink transition-colors"
          >
            {showPwd ? 'Ocultar' : 'Ver'}
          </button>
        </div>

        {/* Strength bars */}
        {pwd && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-colors ${barColor(score, i)}`}
                />
              ))}
            </div>
            {label && (
              <p className="text-[11px] text-ink-3">{label}</p>
            )}
          </div>
        )}

        {errors.password && (
          <p className="text-[11px] text-terra mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Root error */}
      {errors.root && (
        <p className="text-[13px] text-terra bg-terra-bg/50 border border-terra-bg rounded-[var(--r-sm)] px-3 py-2">
          {errors.root.message}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center mt-1 py-3.5 px-4 bg-ink text-bg text-sm font-medium rounded-[var(--r-md)] hover:bg-ink-2 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta gratis'}
      </button>

      {/* Login link */}
      <p className="text-center text-[13px] text-ink-3">
        Ya tienes cuenta?{' '}
        <Link href="/login" className="text-ink font-medium hover:text-ink-2 transition-colors">
          Entra
        </Link>
      </p>
    </form>
  )
}
