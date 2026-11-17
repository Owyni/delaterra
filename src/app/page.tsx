import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#f6f5ed] text-[#183b2b]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#dce6d2] blur-3xl" />
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          dela<span className="text-[#6f874d]">terra</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/login" className="rounded-full px-4 py-2 font-medium transition hover:bg-[#e8eadf]">Iniciar sesión</Link>
          <Link href="/register" className="rounded-full bg-[#244d36] px-5 py-2.5 font-medium text-white transition hover:bg-[#173b29]">Crear cuenta</Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cbd6c1] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#597247]">
            <span className="h-2 w-2 rounded-full bg-[#789456]" />
            Del campo a tu negocio
          </p>
          <h1 className="text-5xl font-semibold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
            El origen importa. <span className="text-[#71864f]">Conecta directo.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#5d6c5e]">
            Encuentra productores agrícolas de Michoacán, descubre qué ofrecen
            y construye relaciones comerciales más cercanas y transparentes.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-full bg-[#244d36] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#173b29]">Explorar Delaterra</Link>
            <Link href="/register" className="rounded-full border border-[#bac7b2] bg-white/60 px-7 py-3.5 text-sm font-semibold text-[#244d36] transition hover:bg-white">Soy productor</Link>
          </div>
          <div className="mt-14 grid max-w-lg grid-cols-3 gap-5 border-t border-[#d8ddcf] pt-6">
            <div><p className="text-2xl font-semibold">Directo</p><p className="mt-1 text-xs text-[#718071]">Productor a negocio</p></div>
            <div><p className="text-2xl font-semibold">Local</p><p className="mt-1 text-xs text-[#718071]">En Michoacán</p></div>
            <div><p className="text-2xl font-semibold">Cercano</p><p className="mt-1 text-xs text-[#718071]">Con búsqueda geográfica</p></div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-5 top-12 h-32 w-32 rounded-full bg-[#e2e8d8]" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#dce6d2] p-3 shadow-[0_28px_80px_-35px_rgba(24,59,43,0.35)]">
            <div className="relative flex aspect-[4/4.4] flex-col justify-between overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#a7bb8e] via-[#6f8d5b] to-[#315b3c] p-6 text-white sm:p-8">
              <div className="absolute inset-0 opacity-25">
                <div className="absolute -left-1/4 top-1/3 h-40 w-[150%] rotate-[-18deg] border-y border-white/70" />
                <div className="absolute -left-1/4 top-1/2 h-40 w-[150%] rotate-[-18deg] border-y border-white/60" />
                <div className="absolute -left-1/4 top-2/3 h-40 w-[150%] rotate-[-18deg] border-y border-white/50" />
              </div>
              <div className="relative flex items-start justify-between">
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">Red agrícola regional</span>
                <span className="text-2xl">✳</span>
              </div>
              <div className="relative">
                <p className="text-sm text-white/75">Una relación más justa</p>
                <p className="mt-2 max-w-sm text-3xl font-semibold leading-tight sm:text-4xl">Más cerca del origen de tus productos.</p>
              </div>
              <div className="relative flex items-center justify-between rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
                <div><p className="text-xs text-white/75">Conectando</p><p className="mt-1 font-medium">Agricultores y negocios</p></div>
                <span className="text-2xl">⌁</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-7 rounded-2xl border border-[#e4e7dc] bg-white px-5 py-4 shadow-lg">
            <p className="text-xs text-[#798575]">Enfoque inicial</p>
            <p className="mt-1 font-semibold text-[#244d36]">Michoacán, México</p>
          </div>
        </div>
      </section>
      <footer className="relative z-10 border-t border-[#dce0d4] px-6 py-5 text-center text-xs text-[#7b8677]">
        Delaterra · Plataforma académica de comercialización agrícola directa
      </footer>
    </main>
  );
}
