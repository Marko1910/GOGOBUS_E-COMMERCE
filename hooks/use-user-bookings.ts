import { useQuery } from '@tanstack/react-query'
import { bookingsService } from '@/services/bookings'

export function useUserBookings() {
  return useQuery({
    queryKey: ['bookings', 'user'],
    queryFn: () => bookingsService.getUserBookings(),
  })
}
