import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsService } from '@/services/bookings'
import { BookingRequest } from '@/types'

export function useBookings() {
  const queryClient = useQueryClient()

  const bookingsQuery = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsService.getUserBookings,
  })

  const createBookingMutation = useMutation({
    mutationFn: (data: BookingRequest) => bookingsService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })

  const cancelBookingMutation = useMutation({
    mutationFn: (id: string) => bookingsService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })

  return {
    data: {
      bookings: bookingsQuery.data,
    },
    isLoading: bookingsQuery.isLoading,
    error: bookingsQuery.error,
    createBooking: createBookingMutation.mutateAsync,
    cancelBooking: cancelBookingMutation.mutateAsync,
    isCreating: createBookingMutation.isPending,
    isCancelling: cancelBookingMutation.isPending,
  }
}
