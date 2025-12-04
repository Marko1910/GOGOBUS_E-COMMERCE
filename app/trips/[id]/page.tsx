'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SeatMap } from '@/components/trips/seat-map'
import { useTripDetail } from '@/hooks/use-trip-detail'
import { useSeatMap } from '@/hooks/use-seat-map'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, Bus, Wifi, ArrowRight, X } from 'lucide-react'
import { format } from 'date-fns'
import type { Passenger } from '@/types'

export default function TripDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.id as string
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [activeSeat, setActiveSeat] = useState<string | null>(null)
  const [passengerDrafts, setPassengerDrafts] = useState<Record<string, Passenger>>(() => {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return {}
    try {
      const raw = sessionStorage.getItem('gogobus_passengers')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [passengerForm, setPassengerForm] = useState<Passenger>({
    firstName: '',
    lastName: '',
    documentType: 'dni',
    documentNumber: '',
    email: '',
    phone: '',
  })

  const { data: trip, isLoading: isLoadingTrip } = useTripDetail(tripId)
  const { data: seatMap, isLoading: isLoadingSeats } = useSeatMap(tripId)

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        const next = prev.filter((id) => id !== seatId)
        const updatedDrafts = { ...passengerDrafts }
        delete updatedDrafts[seatId]
        setPassengerDrafts(updatedDrafts)
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('gogobus_passengers', JSON.stringify(updatedDrafts))
        }
        return next
      }
      return [...prev, seatId]
    })
    const draft = passengerDrafts[seatId]
    setPassengerForm(
      draft || {
        firstName: '',
        lastName: '',
        documentType: 'dni',
        documentNumber: '',
        email: '',
        phone: '',
      }
    )
    setActiveSeat(seatId)
    setErrorMessage(null)
  }

  const handleSavePassenger = () => {
    if (!activeSeat) return
    if (
      !passengerForm.firstName ||
      !passengerForm.lastName ||
      !passengerForm.documentNumber ||
      !passengerForm.email ||
      !passengerForm.phone
    ) {
      setErrorMessage('Completa todos los campos del pasajero antes de continuar.')
      return
    }
    const updated = { ...passengerDrafts, [activeSeat]: passengerForm }
    setPassengerDrafts(updated)
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('gogobus_passengers', JSON.stringify(updated))
    }
    setActiveSeat(null)
  }

  const handleContinue = () => {
    if (!selectedSeats.length) return

    const missing = selectedSeats.filter(
      (seatId) =>
        !passengerDrafts[seatId] ||
        !passengerDrafts[seatId].firstName ||
        !passengerDrafts[seatId].lastName ||
        !passengerDrafts[seatId].documentNumber ||
        !passengerDrafts[seatId].email ||
        !passengerDrafts[seatId].phone
    )

    if (missing.length) {
      setErrorMessage(
        `Falta completar datos para ${missing.length === 1 ? 'el asiento' : 'los asientos'}: ${missing.join(', ')}`
      )
      setActiveSeat(missing[0])
      return
    }

    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('gogobus_passengers', JSON.stringify(passengerDrafts))
    }
    router.push(`/checkout/${tripId}?seats=${selectedSeats.join(',')}`)
  }

  if (isLoadingTrip || isLoadingSeats) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24">
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96 lg:col-span-2 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </main>
      </div>
    )
  }

  if (!trip || !seatMap) return null

  const pendingSeats = useMemo(
    () => selectedSeats.filter((seatId) => !!passengerDrafts[seatId]),
    [selectedSeats, passengerDrafts]
  )

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <div className="bg-primary pb-20 pt-24">
        <Header />
        <div className="container mx-auto px-4 text-white">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <span>Inicio</span>
            <span>/</span>
            <span>Búsqueda</span>
            <span>/</span>
            <span className="text-white">Selección de Asientos</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {trip.origin} <span className="text-secondary">→</span> {trip.destination}
          </h1>
          <p className="opacity-80">
            {format(new Date(trip.departureTime), 'PPP')} • {format(new Date(trip.departureTime), 'HH:mm')}
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-12 mb-20 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          {/* Seat Selection */}
          <div className="space-y-6">
            <SeatMap 
              seatMap={seatMap}
              pendingSeats={pendingSeats}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
          </div>

          {/* Trip Summary & Checkout */}
          <div className="space-y-6">
            <Card className="sticky top-24 border-none shadow-lg">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-bold text-lg border-b pb-4">Resumen del Viaje</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Salida</div>
                      <div className="font-bold text-lg">{format(new Date(trip.departureTime), 'HH:mm')}</div>
                      <div className="text-sm font-medium">{trip.origin}</div>
                    </div>
                    <div className="text-center px-4 pt-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        {Math.floor(trip.duration / 60)}h {trip.duration % 60}m
                      </div>
                      <div className="w-16 h-[2px] bg-secondary mx-auto" />
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-sm text-muted-foreground">Llegada</div>
                      <div className="font-bold text-lg">{format(new Date(trip.arrivalTime), 'HH:mm')}</div>
                      <div className="text-sm font-medium">{trip.destination}</div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Bus className="w-4 h-4 text-primary" />
                      <span>{trip.company} - {trip.busType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-primary" />
                      <span>Servicios: {trip.amenities.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Asientos seleccionados</span>
                    <span className="font-medium">{selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {trip.currency} {(trip.price * selectedSeats.length).toFixed(2)}
                    </span>
                  </div>

                  {selectedSeats.length > 0 && (
                    <div className="space-y-3 mb-4">
                      <p className="text-sm font-semibold text-primary">Datos de pasajeros</p>
                      <div className="space-y-2">
                        {selectedSeats.map((seatId) => {
                          const passenger = passengerDrafts[seatId]
                          const completo =
                            passenger &&
                            passenger.firstName &&
                            passenger.lastName &&
                            passenger.documentNumber &&
                            passenger.email &&
                            passenger.phone
                          return (
                            <div
                              key={seatId}
                              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm bg-muted/40"
                            >
                              <div>
                                <p className="font-semibold text-primary">Asiento {seatId}</p>
                                <p className="text-muted-foreground">
                                  {completo
                                    ? `${passenger.firstName} ${passenger.lastName}`
                                    : 'Datos pendientes'}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant={completo ? 'outline' : 'default'}
                                onClick={() => handleSeatSelect(seatId)}
                              >
                                {completo ? 'Editar' : 'Completar'}
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full h-12 text-lg bg-secondary hover:bg-secondary/90 text-white"
                    disabled={selectedSeats.length === 0}
                    onClick={handleContinue}
                  >
                    Continuar
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  {errorMessage && (
                    <p className="text-sm text-destructive mt-2">{errorMessage}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {activeSeat && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
              onClick={() => setActiveSeat(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-primary mb-1">Datos del pasajero</h3>
            <p className="text-sm text-muted-foreground mb-4">Asiento {activeSeat}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nombres</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={passengerForm.firstName}
                  onChange={(e) => setPassengerForm((p) => ({ ...p, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Apellidos</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={passengerForm.lastName}
                  onChange={(e) => setPassengerForm((p) => ({ ...p, lastName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Documento</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={passengerForm.documentNumber}
                  onChange={(e) => setPassengerForm((p) => ({ ...p, documentNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={passengerForm.documentType}
                  onChange={(e) =>
                    setPassengerForm((p) => ({ ...p, documentType: e.target.value as Passenger['documentType'] }))
                  }
                >
                  <option value="dni">DNI</option>
                  <option value="passport">Pasaporte</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Correo</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  type="email"
                  value={passengerForm.email}
                  onChange={(e) => setPassengerForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={passengerForm.phone}
                  onChange={(e) => setPassengerForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setActiveSeat(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePassenger}>Guardar pasajero</Button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
