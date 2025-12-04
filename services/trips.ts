import api, { handleApiError } from '@/lib/api'
import { Trip, TripSearchParams, SeatMap, Location } from '@/types'

const fallbackLocations: Location[] = [
  { id: '1', name: 'Lima', terminal: 'Javier Prado', address: 'Av. Javier Prado', region: 'Lima' },
  { id: '2', name: 'Cusco', terminal: 'Terminal Terrestre', address: 'Av. Industrial', region: 'Cusco' },
  { id: '3', name: 'Arequipa', terminal: 'Terrapuerto', address: 'Av. Arturo Ibañez', region: 'Arequipa' },
  { id: '4', name: 'Trujillo', terminal: 'Terrapuerto Trujillo', address: 'Panamericana Norte', region: 'La Libertad' },
  { id: '5', name: 'Piura', terminal: 'Terrapuerto Piura', address: 'Av. Bolognesi', region: 'Piura' },
]

const fallbackTrips: Trip[] = [
  {
    id: 'demo-1',
    origin: 'Lima',
    destination: 'Cusco',
    departureTime: new Date().toISOString(),
    arrivalTime: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
    duration: 16 * 60,
    price: 89,
    currency: 'S/',
    availableSeats: 22,
    busType: 'Bus Cama',
    amenities: ['wifi', 'snack', 'usb'],
    company: 'GOGOBUS',
    status: 'available',
  },
  {
    id: 'demo-2',
    origin: 'Lima',
    destination: 'Arequipa',
    departureTime: new Date().toISOString(),
    arrivalTime: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
    duration: 14 * 60,
    price: 75,
    currency: 'S/',
    availableSeats: 14,
    busType: 'Semi Cama',
    amenities: ['wifi', 'tv'],
    company: 'GOGOBUS',
    status: 'available',
  },
]

const unwrapPayload = (payload: any) => payload?.data ?? payload
const extractResults = (payload: any) => {
  const data = unwrapPayload(payload)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

export const tripsService = {
  // Search trips
  searchTrips: async (params: TripSearchParams): Promise<Trip[]> => {
    try {
      const { origin, destination, originId: originIdParam, destinationId: destinationIdParam, date } = params
      const originId = originIdParam || (origin && /^\d+$/.test(origin) ? origin : undefined)
      const destinationId = destinationIdParam || (destination && /^\d+$/.test(destination) ? destination : undefined)

      if (!originId || !destinationId) {
        return []
      }

      const response = await api.get('/trips/', {
        params: {
          origin: originId,
          destination: destinationId,
          start_date: date,
          end_date: date,
        },
      })
      const trips = extractResults(response.data)
      return trips.map(tripsService.normalizeTrip)
    } catch (error) {
      const msg = handleApiError(error)
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        // Fallback: devolvemos viajes demo compatibles con la búsqueda
        const filtered = fallbackTrips.filter(
          (t) =>
            (!origin || t.origin.toLowerCase().includes(origin.toLowerCase())) &&
            (!destination || t.destination.toLowerCase().includes(destination.toLowerCase()))
        )
        return filtered.map(tripsService.normalizeTrip)
      }
      throw new Error(msg)
    }
  },

  // Get trip by ID
  getTripById: async (id: string): Promise<Trip> => {
    try {
      const response = await api.get(`/trips/${id}/`)
      const rawTrip = unwrapPayload(response.data)
      return tripsService.normalizeTrip(rawTrip)
    } catch (error) {
      const msg = handleApiError(error)
      const demo = fallbackTrips.find((t) => t.id === id)
      if (demo) return demo
      throw new Error(msg)
    }
  },

  // Get seat map for a trip
  getSeatMap: async (tripId: string): Promise<SeatMap> => {
    try {
      const response = await api.get(`/trips/${tripId}/`)
      const rawTrip = unwrapPayload(response.data)
      const seatMatrix = rawTrip?.bus?.seats || {}
      const occupiedSeats = new Set((rawTrip?.occupied_seats || []).map((s: any) => String(s)))
      const availableSeats = new Set((rawTrip?.available_seats || []).map((s: any) => String(s)))

      const normalizedSeats = Object.entries(seatMatrix).flatMap(([rowKey, seats]: [string, any[]]) =>
        seats.map((seat, index) => {
          const seatNumber = seat.number || seat.seat_number || seat.id || `${rowKey}-${index + 1}`
          const seatColumn = seat.column || seat.position || index + 1
          const status = occupiedSeats.has(String(seatNumber))
            ? 'occupied'
            : availableSeats.size
              ? availableSeats.has(String(seatNumber))
                ? 'available'
                : 'blocked'
              : 'available'

          return {
            id: String(seatNumber),
            number: String(seatNumber),
            row: Number(rowKey) || 1,
            column: Number(seatColumn) || 1,
            type: (seat.type || 'standard') as any,
            status,
            price: seat.price_modifier ? Number(seat.price_modifier) : 0,
          }
        })
      )

      // Fallback when we only have available/occupied lists
      if (!normalizedSeats.length && (availableSeats.size || occupiedSeats.size)) {
        const seatNumbers = Array.from(new Set([...availableSeats, ...occupiedSeats]))
        seatNumbers.forEach((seatNumber, index) => {
          normalizedSeats.push({
            id: String(seatNumber),
            number: String(seatNumber),
            row: Math.ceil((index + 1) / 4),
            column: ((index + 1) % 4) || 4,
            type: 'standard',
            status: occupiedSeats.has(String(seatNumber)) ? 'occupied' : 'available',
            price: 0,
          })
        })
      }

      return {
        tripId,
        rows: normalizedSeats.length ? Math.max(...normalizedSeats.map((s) => s.row)) : Math.ceil(normalizedSeats.length / 4),
        columns: normalizedSeats.length ? Math.max(...normalizedSeats.map((s) => s.column)) : 4,
        seats: normalizedSeats,
        layout: rawTrip?.bus?.layout_config || [],
      }
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  searchLocations: async (name?: string): Promise<Location[]> => {
    try {
      const response = await api.get('/trips/locations/', {
        params: name ? { name } : {},
      })
      const locations = extractResults(response.data)
      return locations.map(tripsService.normalizeLocation)
    } catch (error) {
      const msg = handleApiError(error)
      if (msg.includes('401') || msg.includes('403')) {
        const term = (name || '').toLowerCase()
        return term
          ? fallbackLocations.filter((loc) => loc.name.toLowerCase().includes(term))
          : fallbackLocations
      }
      throw new Error(msg)
    }
  },

  normalizeTrip: (raw: any): Trip => {
    const originName = raw.origin?.name || raw.origin || 'Origen'
    const destinationName = raw.destination?.name || raw.destination || 'Destino'
    const departureTime = raw.departure_time || raw.departureTime || raw.date || ''
    const arrivalTime = raw.arrival_time || raw.arrivalTime || ''
    const durationMinutes =
      raw.duration_minutes ||
      (departureTime && arrivalTime
        ? Math.max(0, Math.round((new Date(arrivalTime).getTime() - new Date(departureTime).getTime()) / 60000))
        : 0)
    return {
      id: String(raw.id),
      origin: originName,
      destination: destinationName,
      departureTime,
      arrivalTime,
      duration: durationMinutes,
      price: Number(raw.price || 0),
      currency: raw.currency || 'S/',
      availableSeats:
        raw.available_seats_count ||
        raw.availableSeats ||
        (Array.isArray(raw.available_seats) ? raw.available_seats.length : 0),
      totalSeats: raw.total_seats_count || raw.totalSeats || raw.bus?.capacidad || undefined,
      busType: raw.bus?.modelo || raw.bus?.name || raw.busType || '',
      amenities: raw.bus?.amenities || raw.amenities || [],
      company: raw.bus?.company || raw.company || 'GOGOBUS',
      status: 'available',
    }
  },

  normalizeLocation: (raw: any): Location => ({
    id: String(raw.id),
    name: raw.name,
    terminal: raw.terminal,
    address: raw.address,
    region: raw.region,
  }),
}
