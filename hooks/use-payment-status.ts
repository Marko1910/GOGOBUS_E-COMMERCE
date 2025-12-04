import { useQuery } from '@tanstack/react-query'
import { paymentsService } from '@/services/payments'
import type { PaymentStatus } from '@/types'

export function usePaymentStatus(bookingId: string, enabled: boolean = true) {
  return useQuery<PaymentStatus>({
    queryKey: ['payments', bookingId],
    queryFn: () => paymentsService.getPaymentStatus(bookingId),
    enabled: false, // solo manual para evitar llamadas al backend en modo demo
    refetchInterval: false,
    retry: false,
    initialData: 'PENDING',
  })
}
