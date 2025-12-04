import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArrowRight, Headset, Mail, MessageCircle, ShieldCheck, Zap, BookOpen } from 'lucide-react'

const faqs = [
  {
    question: '¿Cómo cambio o cancelo mi viaje?',
    answer:
      'Ingresa a “Mis Viajes”, selecciona la reserva y elige “Modificar” o “Cancelar”. Las políticas dependen de la empresa y horario.',
  },
  {
    question: 'No recibí mis boletos en el correo',
    answer:
      'Revisa spam o promociones. También puedes descargar tus boletos y el QR desde “Mis Viajes” con tu código de reserva.',
  },
  {
    question: '¿Puedo elegir asientos contiguos?',
    answer:
      'Sí. En la pantalla de asientos selecciona los que prefieras; si no hay disponibilidad, prueba otro horario cercano.',
  },
  {
    question: '¿Cómo uso cupones o BusPoints?',
    answer:
      'En el checkout agrega tu cupón. Los BusPoints aplican automáticamente si el saldo es suficiente para el viaje.',
  },
]

const quickActions = [
  { title: 'Chatea con soporte', icon: MessageCircle, cta: 'Abrir chat', href: '#' },
  { title: 'Enviar correo', icon: Mail, cta: 'Escribir', href: 'mailto:soporte@gogobus.com' },
  { title: 'Llamar a un agente', icon: Headset, cta: 'Llamar ahora', href: 'tel:+34123456789' },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <Header />

      <main className="pt-28 pb-16">
        <section className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl border p-8 md:p-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                Centro de ayuda GOGOBUS
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                ¿Necesitas ayuda con tu viaje?
              </h1>
              <p className="text-lg text-slate-600">
                Encuentra respuestas rápidas, guía paso a paso y soporte humano en menos de 2 minutos.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#faq"
                  className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                >
                  Ver preguntas frecuentes
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#contacto"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border border-primary/30 text-primary hover:bg-primary/5"
                >
                  Contactar soporte
                </a>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Zap className="w-4 h-4 text-secondary" /> Respuestas en tiempo real
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-secondary" /> Soporte 24/7
                </span>
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-secondary" /> Guías paso a paso
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 rounded-2xl p-6 border">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Acciones rápidas</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map(({ title, icon: Icon, cta, href }) => (
                  <a
                    key={title}
                    href={href}
                    className="group bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-2 hover:-translate-y-1 hover:shadow-md transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-slate-900">{title}</div>
                    <div className="text-sm text-primary flex items-center gap-1">
                      {cta} <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-4 text-sm text-slate-500">
                Tiempo medio de respuesta: <span className="font-semibold text-primary">2 min</span>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="container mx-auto px-4 mt-16">
          <div className="bg-white rounded-3xl shadow-xl border p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <p className="text-sm font-semibold text-secondary uppercase tracking-wide">FAQ</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">Preguntas frecuentes</h2>
                <p className="text-slate-600">Las dudas más comunes resueltas en menos de 30 segundos.</p>
              </div>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90"
              >
                No encontré mi respuesta
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="p-5 rounded-2xl border bg-slate-50/60 hover:bg-white transition">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="container mx-auto px-4 mt-16">
          <div className="bg-primary rounded-3xl shadow-xl p-8 md:p-12 text-white grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Soporte humano</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">Estamos aquí para ayudarte</h2>
              <p className="text-white/85 text-lg">
                Escríbenos por chat o correo. Si tu viaje sale en menos de 4 horas, marca prioridad en el asunto para
                agilizar la atención.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:soporte@gogobus.com?subject=Ayuda%20urgente%20-%20Mi%20viaje"
                  className="inline-flex items-center gap-2 bg-white text-primary px-5 py-3 rounded-xl font-semibold shadow-lg hover:-translate-y-0.5 transition"
                >
                  <Mail className="w-4 h-4" />
                  Enviar correo
                </a>
                <a
                  href="tel:+34123456789"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border border-white/40 text-white hover:bg-white/10"
                >
                  <Headset className="w-4 h-4" />
                  Llamar a soporte
                </a>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Consejos rápidos
              </h3>
              <ul className="space-y-3 text-white/90">
                <li>Ten a mano tu código de reserva y documento de identidad.</li>
                <li>Revisa tu carpeta de spam si esperas boletos o facturas.</li>
                <li>Para cambios urgentes, sugiere horarios alternativos en el mensaje.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
