'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useBookings } from '@/hooks/use-bookings'
import type { Booking, Trip } from '@/types'

type EstadoViaje = 'Confirmado' | 'Pendiente' | 'Completado' | 'Cancelado'

interface Viaje {
  id: string
  origen: string
  destino: string
  fecha: string
  hora: string
  horaLlegada: string
  empresa: string
  precio: number
  puntos: number
  estado: EstadoViaje
  asientos: string[]
  tipoViaje: 'ida' | 'ida-vuelta'
  duracion: string
  servicios: string[]
}

const mapBookingToViaje = (booking: Booking): Viaje => {
  const trip = booking.trip || ({} as Trip)
  const salida = trip.departureTime ? new Date(trip.departureTime) : null
  const llegada = trip.arrivalTime ? new Date(trip.arrivalTime) : null
  const estado: EstadoViaje =
    booking.paymentStatus === 'paid'
      ? 'Confirmado'
      : booking.paymentStatus === 'failed'
      ? 'Cancelado'
      : 'Pendiente'

  return {
    id: booking.bookingCode || booking.id,
    origen: trip.origin || 'Origen',
    destino: trip.destination || 'Destino',
    fecha: salida ? salida.toISOString().slice(0, 10) : 'Pendiente',
    hora: salida ? salida.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
    horaLlegada: llegada ? llegada.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
    empresa: trip.company || 'GOGOBUS',
    precio: booking.total,
    puntos: Math.round(booking.total),
    estado,
    asientos: booking.seats?.map((s) => s.number) || [],
    tipoViaje: 'ida',
    duracion:
      typeof trip.duration === 'number'
        ? `${Math.floor(trip.duration / 60)}h ${trip.duration % 60}m`
        : 'N/D',
    servicios: trip.amenities || [],
  }
}

export function MyTripsView() {
  const { data, isLoading } = useBookings()
  const [storedBooking, setStoredBooking] = useState<Viaje | null>(null)
  const [viajesTab, setViajesTab] = useState<'proximos' | 'historial'>('proximos')

  useEffect(() => {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return
    try {
      const raw = sessionStorage.getItem('gogobus_last_booking')
      if (raw) {
        const parsed = JSON.parse(raw)
        const viaje: Viaje = {
          id: parsed.bookingCode || parsed.bookingId,
          origen: parsed.trip?.origin || 'Origen',
          destino: parsed.trip?.destination || 'Destino',
          fecha: parsed.trip?.departureTime
            ? new Date(parsed.trip.departureTime).toISOString().slice(0, 10)
            : 'Pendiente',
          hora: parsed.trip?.departureTime
            ? new Date(parsed.trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '--:--',
          horaLlegada: parsed.trip?.arrivalTime
            ? new Date(parsed.trip.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '--:--',
          empresa: 'GOGOBUS',
          precio: parsed.totalAmount || parsed.trip?.price || 0,
          puntos: Math.round(parsed.totalAmount || parsed.trip?.price || 0),
          estado: 'Confirmado',
          asientos: parsed.seats || [],
          tipoViaje: 'ida',
          duracion: parsed.trip?.arrivalTime && parsed.trip?.departureTime ? 'En camino' : 'N/D',
          servicios: [],
        }
        setStoredBooking(viaje)
      }
    } catch {
      setStoredBooking(null)
    }
  }, [])

  const viajesFromApi = useMemo(() => {
    const bookings = data?.bookings || []
    return bookings.map(mapBookingToViaje)
  }, [data?.bookings])

  const proximos = viajesFromApi.filter((v) => v.estado !== 'Completado' && v.estado !== 'Cancelado')
  const historico = viajesFromApi.filter((v) => v.estado === 'Completado')

  const listado =
    viajesTab === 'proximos'
      ? proximos.length
        ? proximos
        : storedBooking
        ? [storedBooking]
        : []
      : historico

  return (
    <section className="py-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mis Viajes</h2>
          <p className="text-lg text-gray-600">Gestiona tus reservas y viajes</p>
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setViajesTab('proximos')}
                className={cn(
                  'border-b-2 py-2 px-1 font-medium text-sm cursor-pointer transition-colors',
                  viajesTab === 'proximos' ? 'border-[#F5951F] text-[#F5951F]' : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                Proximos Viajes ({viajesTab === 'proximos' ? listado.length : proximos.length})
              </button>
              <button
                onClick={() => setViajesTab('historial')}
                className={cn(
                  'border-b-2 py-2 px-1 font-medium text-sm cursor-pointer transition-colors',
                  viajesTab === 'historial' ? 'border-[#F5951F] text-[#F5951F]' : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                Historial ({historico.length})
              </button>
            </nav>
          </div>
        </div>

        {isLoading && <p className="text-gray-500 mb-4">Cargando tus viajes...</p>}

        <div className="space-y-6">
          {listado.map((viaje) => (
            <div key={viaje.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {viaje.origen} {'->'} {viaje.destino}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {viaje.id}</p>
                    </div>
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        viaje.estado === 'Confirmado'
                          ? 'bg-green-100 text-green-800'
                          : viaje.estado === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : viaje.estado === 'Completado'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      )}
                    >
                      {viaje.estado}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Fecha</p>
                      <p className="font-medium">{viaje.fecha}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hora salida</p>
                      <p className="font-medium">{viaje.hora}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Empresa</p>
                      <p className="font-medium">{viaje.empresa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Asiento</p>
                      <p className="font-medium">{viaje.asientos.length ? viaje.asientos.join(', ') : 'Asignado en terminal'}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {viaje.servicios.map((servicio) => (
                      <span
                        key={servicio}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                      >
                        <i className="fas fa-check text-green-500 mr-1 text-xs" />
                        {servicio}
                      </span>
                    ))}
                    {!viaje.servicios.length && (
                      <span className="text-xs text-gray-400">Servicios se confirmaran al embarcar.</span>
                    )}
                  </div>
                </div>
                <div className="md:ml-6 flex flex-col justify-between items-end">
                  <div className="text-right mb-4">
                    <p className="text-xl font-bold text-gray-900">S/ {viaje.precio}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-coins text-[#F5951F] mr-1" />
                      +{viaje.puntos} BusPoints
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 w-full md:w-auto">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                      Ver Detalles
                    </button>
                    {viajesTab === 'proximos' && viaje.estado !== 'Cancelado' && (
                      <>
                        <button className="bg-[#F5951F] hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                          Modificar
                        </button>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                          Cancelar
                        </button>
                      </>
                    )}
                    {viajesTab === 'historial' && (
                      <button className="bg-[#F5951F] hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                        Re-reservar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {listado.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-bus text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">
                {viajesTab === 'proximos' ? 'No tienes viajes proximos' : 'No tienes historial de viajes'}
              </h3>
              <p className="text-gray-400 mb-6">
                {viajesTab === 'proximos'
                  ? 'Reserva tu primer viaje y comienza a acumular BusPoints'
                  : 'Cuando completes viajes apareceran aqui'}
              </p>
              <Link
                href="/"
                className="inline-block bg-[#F5951F] hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
              >
                Buscar Viajes
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
