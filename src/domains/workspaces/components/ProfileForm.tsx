'use client'

import { useForm }      from 'react-hook-form'
import { zodResolver }  from '@hookform/resolvers/zod'
import { z }            from 'zod'
import { useMutation }  from '@tanstack/react-query'
import { auth }         from '@/lib/api'
import { ApiError }     from '@/lib/api/client'
import { toast }        from 'sonner'
import type { User }    from '@/types/domain'

const schema = z.object({
  name:  z.string().min(2, 'Minimo 2 caracteres'),
  email: z.string().email('Email invalido'),
})
type FormInput = z.infer<typeof schema>

interface Props {
  user: User
}

export function ProfileForm({ user }: Props) {
  const update = useMutation({
    mutationFn: (data: FormInput) => auth.profile(data),
    onSuccess: () => toast.success('Perfil actualizado'),
    onError:   (err) => toast.error(err instanceof ApiError ? err.message : 'Error al actualizar'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormInput>({
    resolver:      zodResolver(schema),
    defaultValues: { name: user.name, email: user.email },
  })

  const inputCls = "w-full px-3 py-2.5 text-sm bg-bg border border-line rounded-[var(--r-sm)] text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 transition-colors"

  return (
    <form onSubmit={handleSubmit((d) => update.mutate(d))} noValidate className="space-y-4">
      <div>
        <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">Nombre</label>
        <input type="text" {...register('name')} className={inputCls} />
        {errors.name && <p className="text-[11px] text-terra mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ink-3 mb-1.5">Correo</label>
        <input type="email" {...register('email')} className={inputCls} />
        {errors.email && <p className="text-[11px] text-terra mt-1">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="px-4 py-2.5 text-sm font-medium bg-ink text-bg rounded-[var(--r-sm)] hover:bg-ink-2 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  )
}
