import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsService } from '@/services/bookings'
import { BookingRequest } from '@/types'

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BookingRequest) => bookingsService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
