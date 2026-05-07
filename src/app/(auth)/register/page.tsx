export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg">
      <div className="hidden lg:flex flex-col relative bg-ink text-bg px-14 py-12 overflow-hidden">
        <div className="absolute -right-44 -top-44 w-[520px] h-[520px] rounded-full border border-gold/20" />
        <div className="absolute -right-28 -top-28 w-[400px] h-[400px] rounded-full border border-gold/25" />
        <span className="relative font-serif text-3xl tracking-tight">finapp</span>
      </div>

      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="font-serif text-3xl text-ink">Crear cuenta</h2>
            <p className="text-ink-3 text-sm mt-1">Empieza a ordenar tus finanzas</p>
          </div>
          <p className="text-ink-3 text-sm">[RegisterForm va aqui]</p>
        </div>
      </div>
    </div>
  )
}
