import { useQuery } from '@tanstack/react-query'
import { tripsService } from '@/services/trips'

export function useTripDetail(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId],
    queryFn: () => tripsService.getTripById(tripId),
    enabled: !!tripId,
  })
}
