import { useQuery } from '@tanstack/react-query'
import { tripsService } from '@/services/trips'

export function useSeatMap(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'seats'],
    queryFn: () => tripsService.getSeatMap(tripId),
    enabled: !!tripId,
  })
}
