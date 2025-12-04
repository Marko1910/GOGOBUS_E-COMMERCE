import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard, ArrowRight, ShieldCheck, Smartphone, Banknote } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { PaymentStatus } from '@/types'
import { paymentsService } from '@/services/payments'

interface PaymentButtonProps {
  bookingId: string
  amount: number
  paymentUrl?: string
  onPaymentStart: () => void
  onCheckStatus?: () => void
  status?: PaymentStatus
  currency?: string
  mpAccessToken?: string
}

export function PaymentButton({
  bookingId,
  amount,
  paymentUrl,
  onPaymentStart,
  onCheckStatus,
  status,
  currency,
  mpAccessToken,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState<string | undefined>(paymentUrl)
  const { toast } = useToast()

  useEffect(() => {
    if (status === 'COMPLETED' || status === 'FAILED') {
      setIsLoading(false)
    }
  }, [status])

  const handlePayment = async () => {
    setIsLoading(true)
    onPaymentStart()

    try {
      // Si ya tenemos un paymentUrl, lo usamos; si no, intentamos crear uno en MP
      let redirect = url
      if (!redirect) {
        try {
          redirect = await paymentsService.createMercadoPagoPreference({
            bookingId,
            amount,
            currency: currency || 'PEN',
            title: `GOGOBUS - Reserva ${bookingId}`,
          })
        } catch (backendError) {
          // Fallback directo a Mercado Pago si no hay backend
          redirect = await paymentsService.createMercadoPagoPreferenceClient({
            bookingId,
            amount,
            currency: currency || 'PEN',
            accessToken: mpAccessToken,
            title: `GOGOBUS - Reserva ${bookingId}`,
          })
        }
        setUrl(redirect)
      }

      if (redirect) {
        window.open(redirect, '_blank')
      }

      toast({
        title: 'Procesando pago',
        description: 'Completa el pago en la pasarela y luego revisa el estado.',
      })

      setTimeout(() => setIsLoading(false), 1200)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo iniciar el pago. Intente nuevamente.',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-slate-50 p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <ShieldCheck className="w-5 h-5" />
          Pago seguro con Mercado Pago
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-700">
          <div className="flex items-center gap-2 rounded-lg bg-white border px-3 py-2">
            <Smartphone className="w-4 h-4 text-primary" />
            <span>Wallet / QR</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white border px-3 py-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Tarjeta debito/credito</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white border px-3 py-2">
            <Banknote className="w-4 h-4 text-primary" />
            <span>Cuotas y pagos rapidos</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Importe a pagar</span>
          <span className="text-lg font-bold text-primary">S/ {amount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full h-14 text-lg font-bold bg-[#009ee3] hover:bg-[#008cc8] text-white shadow-lg hover:shadow-xl transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Conectando con Mercado Pago...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pagar con Mercado Pago
          </>
        )}
      </Button>

      <Button
        variant="ghost"
        className="w-full"
        disabled={isLoading || !bookingId}
        onClick={() => {
          onPaymentStart()
          onCheckStatus?.()
          toast({
            title: 'Verificando pago',
            description: 'Actualizando el estado de tu transaccion.',
          })
        }}
      >
        Ya pague, verificar estado
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
