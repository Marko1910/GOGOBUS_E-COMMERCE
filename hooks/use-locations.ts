import { useQuery } from '@tanstack/react-query'
import { tripsService } from '@/services/trips'
import type { Location } from '@/types'

export function useLocations(searchTerm: string, enabled: boolean = true) {
  return useQuery<Location[]>({
    queryKey: ['locations', searchTerm],
    queryFn: () => tripsService.searchLocations(searchTerm),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
