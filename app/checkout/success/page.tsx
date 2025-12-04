'use client'

'use client'

// Evita la prerenderización estática en plataformas que intentan exportar el sitio
export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Ticket, ArrowRight, Download } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

interface TicketData {
  bookingId: string
  bookingCode?: string
  seats: string[]
  totalAmount?: number
  passengers?: { firstName: string; lastName: string }[]
  trip?: {
    origin?: string
    destination?: string
    departureTime?: string
    arrivalTime?: string
    price?: number
    currency?: string
  }
  qrCode?: string
  createdAt?: string
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId') || '—'
  const [ticket, setTicket] = useState<TicketData | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('gogobus_passengers')
      const stored = sessionStorage.getItem('gogobus_last_booking')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setTicket(parsed)
        } catch {
          setTicket(null)
        }
      }
    }
  }, [])

  const qrSrc = useMemo(() => {
    const code = ticket?.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
      ticket?.bookingCode || bookingId
    )}`
    return code
  }, [bookingId, ticket?.bookingCode, ticket?.qrCode])

  const handleDownloadPdf = () => {
    if (typeof window === 'undefined') return
    const tripLine = `${ticket?.trip?.origin || ''} → ${ticket?.trip?.destination || ''}`
    const dateLine = ticket?.trip?.departureTime
      ? new Date(ticket.trip.departureTime).toLocaleString()
      : 'Fecha pendiente'
    const seats = ticket?.seats?.join(', ') || '—'
    const amount = ticket?.totalAmount ? `${ticket.trip?.currency || 'S/'} ${ticket.totalAmount.toFixed(2)}` : '—'

    const html = `
      <html>
        <head>
          <title>GOGOBUS Ticket ${ticket?.bookingCode || bookingId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            .ticket { border: 2px dashed #e5e7eb; border-radius: 16px; padding: 20px; max-width: 720px; margin: auto; }
            .header { display: flex; justify-content: space-between; align-items: center; }
            .qr { width: 160px; height: 160px; border: 8px solid #f1f5f9; border-radius: 12px; }
            .row { display: flex; justify-content: space-between; margin-top: 12px; }
            .label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
            .value { font-size: 16px; font-weight: 700; }
            .chip { background: #fef2e8; color: #f97316; padding: 6px 10px; border-radius: 999px; font-weight: 700; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div>
                <div class="label">Reserva</div>
                <div class="value">${ticket?.bookingCode || bookingId}</div>
              </div>
              <div class="chip">GOGOBUS</div>
            </div>
            <div class="row">
              <div>
                <div class="label">Ruta</div>
                <div class="value">${tripLine}</div>
              </div>
              <div>
                <div class="label">Fecha / Hora</div>
                <div class="value">${dateLine}</div>
              </div>
            </div>
            <div class="row">
              <div>
                <div class="label">Asientos</div>
                <div class="value">${seats}</div>
              </div>
              <div>
                <div class="label">Total</div>
                <div class="value">${amount}</div>
              </div>
            </div>
            <div class="row" style="margin-top:20px; align-items:center;">
              <div>
                <div class="label">Pasajeros</div>
                <div class="value">${ticket?.passengers?.map((p: any) => `${p.firstName} ${p.lastName}`).join(', ') || '—'}</div>
              </div>
              <img class="qr" src="${qrSrc}" />
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(html)
      win.document.close()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl border overflow-hidden">
          <div className="bg-green-600 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Pago exitoso</h1>
            <p className="text-white/80">Tu reserva quedó confirmada.</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Código de reserva</p>
                <p className="text-xl font-mono font-bold">{ticket?.bookingCode || bookingId}</p>
              </div>
              <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-full text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Pagado
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-center">
              <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-3 text-primary">
                  <Ticket className="w-5 h-5" />
                  <p className="font-semibold">Boleto digital listo</p>
                </div>
                <p>Guarda el QR y descarga el ticket en PDF. También lo encontrarás en “Mis viajes”.</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Ruta</p>
                    <p className="font-semibold">
                      {ticket?.trip?.origin} → {ticket?.trip?.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Salida</p>
                    <p className="font-semibold">
                      {ticket?.trip?.departureTime
                        ? new Date(ticket.trip.departureTime).toLocaleString()
                        : 'Pendiente'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Asientos</p>
                    <p className="font-semibold">{ticket?.seats?.join(', ') || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold">
                      {ticket?.totalAmount
                        ? `${ticket?.trip?.currency || 'S/'} ${ticket.totalAmount.toFixed(2)}`
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <img src={qrSrc} alt="QR de la reserva" className="w-48 h-48 bg-muted rounded-xl p-2 border" />
                <p className="text-xs text-muted-foreground text-center">
                  Escanea para mostrar tu ticket en la terminal.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" onClick={() => router.push('/my-trips')}>
                Ver mis viajes
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => router.push('/')}>
                Volver al inicio
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="secondary" className="flex-1" onClick={handleDownloadPdf}>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
