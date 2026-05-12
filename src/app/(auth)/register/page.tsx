import { RegisterForm } from '@/domains/auth/components/RegisterForm'

const features = [
  { emoji: '💚', text: 'Transacciones ilimitadas' },
  { emoji: '📊', text: 'Presupuesto mensual por categoria' },
  { emoji: '🎯', text: 'Hasta 3 metas de ahorro' },
  { emoji: '👥', text: 'Workspace compartido (proximamente)' },
]

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg">
      {/* Decorative panel */}
      <div className="hidden lg:flex flex-col relative bg-ink text-bg px-14 py-12 overflow-hidden">
        <div className="absolute -right-44 -top-44 w-[520px] h-[520px] rounded-full border border-gold/20" />
        <div className="absolute -right-28 -top-28 w-[400px] h-[400px] rounded-full border border-gold/25" />
        <div className="absolute -right-14 -top-14 w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.18),transparent_70%)]" />

        <div className="relative">
          <span className="font-serif text-3xl tracking-tight">finapp</span>
          <p className="text-[11px] tracking-[0.12em] uppercase text-bg/55 mt-1">
            Tu dinero, en orden.
          </p>
        </div>

        <div className="relative mt-auto">
          <blockquote className="font-serif text-[32px] leading-[1.2] tracking-tight -ml-0.5">
            Empieza con la version<br /> gratuita &mdash;<br /> sin tarjeta.
          </blockquote>
          <ul className="mt-8 space-y-3.5">
            {features.map(({ emoji, text }) => (
              <li key={text} className="flex items-center gap-3 text-[13px] text-bg/75">
                <span className="text-base">{emoji}</span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form column */}
      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <p className="text-[12px] tracking-[0.1em] uppercase text-ink-3 mb-2">
            Crea tu cuenta
          </p>
          <h1 className="font-serif text-[38px] leading-[1.05] tracking-tight mb-1">
            Toma el control de tu dinero.
          </h1>
          <p className="text-ink-3 text-sm mb-7">Tres minutos y estas dentro.</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
