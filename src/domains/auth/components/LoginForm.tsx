'use client'

import { useState }                  from 'react'
import { useForm }                   from 'react-hook-form'
import { zodResolver }               from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import Link                          from 'next/link'
import { loginSchema, type LoginInput } from '@/domains/auth/schemas'
import { useLogin }                  from '@/domains/auth/hooks/useAuth'
import { ApiError }                  from '@/lib/api/client'

export function LoginForm() {
  const searchParams = useSearchParams()
  const [showPwd, setShowPwd] = useState(false)
  const login = useLogin()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    try {
      await login.mutateAsync(data)
      const from = searchParams.get('from') ?? '/'
      window.location.href = from
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al iniciar sesion'
      setError('root', { message: msg })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">
          Correo
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className="w-full px-3 py-2.5 text-sm bg-surface border border-line rounded-[var(--r-sm)] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"
        />
        {errors.email && (
          <p className="text-[11px] text-terra mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3">
            Contrasena
          </label>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPwd ? 'text' : 'password'}
            autoComplete="current-password"
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
        className="w-full flex items-center justify-center mt-2 py-3.5 px-4 bg-ink text-bg text-sm font-medium rounded-[var(--r-md)] hover:bg-ink-2 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-ink-4 my-1">
        <div className="flex-1 h-px bg-line" />
        o
        <div className="flex-1 h-px bg-line" />
      </div>

      {/* Register link */}
      <p className="text-center text-[13px] text-ink-3">
        Primera vez por aqui?{' '}
        <Link href="/register" className="text-ink font-medium hover:text-ink-2 transition-colors">
          Crea una cuenta
        </Link>
      </p>
    </form>
  )
}
