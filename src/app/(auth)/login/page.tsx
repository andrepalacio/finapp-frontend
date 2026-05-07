export default function LoginPage() {
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

        <blockquote className="relative mt-auto font-serif text-[32px] leading-[1.15] tracking-tight -ml-0.5">
          &ldquo;Cada peso que registras<br />
          es un peso que entiendes.&rdquo;
        </blockquote>
      </div>

      {/* Form column — placeholder */}
      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="font-serif text-3xl text-ink">Bienvenido</h2>
            <p className="text-ink-3 text-sm mt-1">Inicia sesion en tu cuenta</p>
          </div>
          <p className="text-ink-3 text-sm">[LoginForm va aqui]</p>
        </div>
      </div>
    </div>
  )
}
