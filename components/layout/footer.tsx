import Link from 'next/link'

const aboutLinks = [
  { label: 'Nuestra Historia', href: '#about-story' },
  { label: 'Misión y Visión', href: '#about-story' },
  { label: 'Equipo', href: '#about-story' },
]

const supportLinks = [
  { label: 'Centro de Ayuda', href: '/help' },
  { label: 'Preguntas Frecuentes', href: '/help#faq' },
  { label: 'Contacto', href: '/help#contacto' },
]

const legalLinks = [
  { label: 'Términos y Condiciones', href: '#' },
  { label: 'Política de Privacidad', href: '#' },
  { label: 'Política de Cookies', href: '#' },
]

export function Footer() {
  return (
    <>
      <section id="about-story" className="bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
              Sobre Nosotros
            </span>
            <h3 className="text-3xl font-bold text-slate-900 leading-tight">
              Conectamos ciudades con experiencias de viaje cómodas y seguras.
            </h3>
            <p className="text-slate-600 leading-relaxed">
              GOGOBUS nació para simplificar la reserva de buses en España y Latinoamérica. Unimos tecnología,
              servicio al cliente 24/7 y alianzas con las mejores empresas para que viajar sea tan fácil como un clic.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-lg border bg-slate-50">
                <div className="text-2xl font-bold text-primary">+120</div>
                <div className="text-slate-600">Rutas activas</div>
              </div>
              <div className="p-3 rounded-lg border bg-slate-50">
                <div className="text-2xl font-bold text-primary">+50</div>
                <div className="text-slate-600">Socios de transporte</div>
              </div>
              <div className="p-3 rounded-lg border bg-slate-50">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-slate-600">Soporte humano</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border space-y-4">
            <h4 className="text-xl font-semibold text-slate-900">¿Por qué elegirnos?</h4>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
                Reservas en segundos con pagos seguros.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
                Selección de asientos en tiempo real.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
                BusPoints y cupones para ahorrar en cada viaje.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
                Atención inmediata por chat, correo y teléfono.
              </li>
            </ul>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Conoce más en el Centro de Ayuda
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#002A33] text-white pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-secondary p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-white"
                >
                  <path d="M8 6v6" />
                  <path d="M15 6v6" />
                  <path d="M2 12h19.6" />
                  <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
                  <circle cx="7" cy="18" r="2" />
                  <path d="M9 18h5" />
                  <circle cx="16" cy="18" r="2" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                GOGO<span className="text-secondary">BUS</span>
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Viaja seguro, cómodo y a buen precio. Conecta tus destinos favoritos con un solo clic.
            </p>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Sobre Nosotros</h5>
            <ul className="space-y-2 text-gray-300">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#F5951F] cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Soporte</h5>
            <ul className="space-y-2 text-gray-300">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#F5951F] cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Legal</h5>
            <ul className="space-y-2 text-gray-300">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#F5951F] cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-4">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-400">
            <span>© {new Date().getFullYear()} GOGOBUS. Todos los derechos reservados.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">
                Facebook
              </a>
              <a href="#" className="hover:text-white">
                Instagram
              </a>
              <a href="#" className="hover:text-white">
                X
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
