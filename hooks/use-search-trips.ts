import { useQuery } from '@tanstack/react-query'
import { tripsService } from '@/services/trips'
import { TripSearchParams } from '@/types'

export function useSearchTrips(params: TripSearchParams, enabled: boolean = true) {
  return useQuery({
    queryKey: ['trips', 'search', params],
    queryFn: () => tripsService.searchTrips(params),
    enabled: enabled && !!params.originId && !!params.destinationId && !!params.date,
  })
}
