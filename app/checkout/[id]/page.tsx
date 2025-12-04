'use client'

// Evita que plataformas de static export intenten prerenderizar este flujo dinámico
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Ticket, ShieldCheck } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { PaymentButton } from '@/components/checkout/payment-button'
import { useTripDetail } from '@/hooks/use-trip-detail'
import { useCreateBooking } from '@/hooks/use-create-booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import type { Passenger } from '@/types'

const mpAccessToken =
  process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN || 'TEST-8bc5ff8c-ff17-421a-a177-12201efea369'

export default function CheckoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
   const { toast } = useToast()
   const tripId = params.id as string
  const seats = searchParams.get('seats')?.split(',').filter(Boolean) || []
 
   const { data: trip, isLoading } = useTripDetail(tripId)
   const createBooking = useCreateBooking()
 
   const [step, setStep] = useState<'details' | 'payment'>('details')
   const [bookingId, setBookingId] = useState<string>('')
   const [paymentUrl, setPaymentUrl] = useState<string | undefined>(undefined)
 
  const paymentStatus = 'PENDING'

  useEffect(() => {
    if (!seats.length) {
      router.replace(`/trips/${tripId}`)
    }
  }, [router, seats.length, tripId])

  // Estado de pago fijo en modo demo; no se consulta backend para evitar 401
 
   const handlePassengerSubmit = async (passengers: Passenger[]) => {
     if (!seats.length) {
       router.replace(`/trips/${tripId}`)
       return
     }
     try {
       const totalAmount = trip.price * seats.length
       const booking = await createBooking.mutateAsync({
         tripId,
         seatIds: seats,
         passengers,
         totalAmount,
       })
       if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
         sessionStorage.removeItem('gogobus_passengers')
         const qrCode =
           booking.qrCode ||
           `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
             booking.bookingCode || booking.id
           )}`
         const bookingSummary = {
           bookingId: booking.id,
           bookingCode: booking.bookingCode || booking.id,
           seats,
           totalAmount,
           passengers,
           trip: {
             origin: trip.origin,
             destination: trip.destination,
             departureTime: trip.departureTime,
             arrivalTime: trip.arrivalTime,
             price: trip.price,
             currency: trip.currency,
           },
           qrCode,
           paymentUrl: booking.paymentUrl,
           createdAt: new Date().toISOString(),
         }
         sessionStorage.setItem('gogobus_last_booking', JSON.stringify(bookingSummary))
       }
       setBookingId(booking.id)
       setPaymentUrl(booking.paymentUrl)
       setStep('payment')
     } catch (error) {
       toast({
         variant: 'destructive',
         title: 'Error',
         description:
           error instanceof Error ? error.message : 'No pudimos crear tu reserva. Intenta de nuevo.',
       })
     }
   }
 
   if (isLoading || !trip) {
     return (
       <div className="min-h-screen flex flex-col">
         <Header />
         <main className="flex-1 container mx-auto px-4 py-24">
           <Skeleton className="h-96 w-full rounded-xl" />
         </main>
       </div>
     )
   }
 
   const totalAmount = trip.price * seats.length
 
   return (
     <div className="min-h-screen flex flex-col bg-muted/10">
       <div className="bg-primary pb-20 pt-24">
         <Header />
         <div className="container mx-auto px-4 text-white text-center">
           <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
           <p className="opacity-80">Completa tus datos para asegurar tus asientos</p>
         </div>
       </div>
 
       <main className="container mx-auto px-4 -mt-12 mb-20 flex-1">
         <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
           <div className="space-y-6">
             {step === 'details' ? (
               <CheckoutForm seats={seats} onSubmit={handlePassengerSubmit} />
             ) : (
               <Card className="border-none shadow-lg">
                 <CardHeader className="text-center pb-2">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                     <ShieldCheck className="w-8 h-8" />
                   </div>
                   <CardTitle className="text-2xl text-primary">Confirmar Pago</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                   <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Reserva ID</span>
                       <span className="font-mono font-bold">{bookingId || 'Pendiente'}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Total a pagar</span>
                       <span className="font-bold text-lg text-primary">
                         {trip.currency || 'S/'} {totalAmount.toFixed(2)}
                       </span>
                     </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estado de pago</span>
                      <span className="font-semibold text-primary">{paymentStatus}</span>
                    </div>
                  </div>

                  <PaymentButton
                    bookingId={bookingId}
                    amount={totalAmount}
                    paymentUrl={paymentUrl}
                    status={paymentStatus}
                    currency={trip.currency}
                    mpAccessToken={mpAccessToken}
                    onPaymentStart={() => {}}
                    onCheckStatus={() => {}}
                  />
                 </CardContent>
               </Card>
             )}
           </div>
 
           {/* Order Summary */}
           <div className="space-y-6">
             <Card className="sticky top-24 border-none shadow-lg">
               <CardHeader className="bg-primary text-white rounded-t-xl py-4">
                 <CardTitle className="text-lg flex items-center gap-2">
                   <Ticket className="w-5 h-5" />
                   Resumen de Compra
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                 <div className="pb-4 border-b space-y-2">
                   <div className="font-bold text-lg text-primary">
                     {trip.origin} - {trip.destination}
                   </div>
                   <div className="text-sm text-muted-foreground">
                     {format(new Date(trip.departureTime), 'PPP')}
                   </div>
                 </div>
 
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Precio por boleto</span>
                     <span>
                       {trip.currency || 'S/'} {trip.price.toFixed(2)}
                     </span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Cantidad</span>
                     <span>x {seats.length}</span>
                   </div>
                   <div className="flex justify-between text-xs text-muted-foreground pl-4">
                     <span>Asientos: {seats.join(', ')}</span>
                   </div>
                 </div>
 
                 <div className="pt-4 border-t flex justify-between items-center">
                   <span className="font-bold text-lg">Total</span>
                   <span className="font-bold text-2xl text-secondary">
                     {trip.currency || 'S/'} {totalAmount.toFixed(2)}
                   </span>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </main>
       <Footer />
     </div>
   )
 }
