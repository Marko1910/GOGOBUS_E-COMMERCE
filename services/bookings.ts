import api, { handleApiError } from '@/lib/api'
import { Booking, BookingRequest } from '@/types'
import { userService } from './user'

const unwrapPayload = (payload: any) => payload?.data ?? payload

export const bookingsService = {
  // Create a new booking
  createBooking: async (data: BookingRequest): Promise<Booking> => {
    try {
      // En entornos sin backend estable usamos cliente ligero
      const user = userService.getStoredUser()
      let booking: any
      const hasToken =
        typeof window !== 'undefined' && typeof localStorage !== 'undefined'
          ? !!localStorage.getItem('gogobus_token')
          : true

      if (hasToken) {
        try {
          const response = await api.post(`/bookings/`, {
            trip_id: data.tripId,
            user_id: user?.id,
            passengers: data.passengers.map((p, idx) => ({
              name: `${p.firstName} ${p.lastName}`,
              dni: p.documentNumber,
              seat_number: Number(data.seatIds[idx]),
              email: p.email,
              phone: p.phone,
            })),
            seat_numbers: data.seatIds.map((s) => Number(s)),
            total_amount: data.totalAmount,
          })
          booking = unwrapPayload(response.data)
        } catch (err) {
          // fallback local para demo / sin backend
        }
      }

      if (!booking) {
        const bookingCode = `BK-${Date.now()}`
        booking = {
          id: bookingCode,
          bookingId: bookingCode,
          booking_code: bookingCode,
          total_amount: data.totalAmount || 0,
          payment_url: undefined,
          qr_code_url: undefined,
          status: 'pending',
          trip: {
            id: data.tripId,
          },
        }
      }

      return {
        id: String(booking.bookingId || booking.id),
        tripId: data.tripId,
        trip: booking.trip || ({} as any),
        seats: [],
        passengers: data.passengers,
        subtotal: booking.total || booking.total_amount || 0,
        discount: 0,
        busPointsUsed: 0,
        total: booking.total || booking.total_amount || 0,
        status: booking.status || 'pending',
        paymentStatus: 'pending',
        paymentUrl: booking.payment_url,
        qrCode: booking.qr_code_url,
        bookingCode: booking.booking_code || booking.bookingId || booking.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<Booking> => {
    try {
      const response = await api.get(`/bookings/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get user bookings
  getUserBookings: async (): Promise<Booking[]> => {
    try {
      const response = await api.get('/bookings/my-bookings')
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Cancel booking
  cancelBooking: async (id: string): Promise<void> => {
    try {
      await api.post(`/bookings/${id}/cancel`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
