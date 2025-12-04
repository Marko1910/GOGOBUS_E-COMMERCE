import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/user'

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => userService.getCurrentUser(),
    enabled: userService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
