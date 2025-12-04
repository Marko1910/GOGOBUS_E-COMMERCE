import api, { handleApiError } from '@/lib/api'
import type { PaymentStatus } from '@/types'

const DEFAULT_MP_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN || 'TEST-8bc5ff8c-ff17-421a-a177-12201efea369'

export const paymentsService = {
  getPaymentStatus: async (bookingId: string): Promise<PaymentStatus> => {
    // En modo demo devolvemos siempre PENDING y evitamos llamadas al backend
    return 'PENDING'
  },

  // Crea una preferencia de Mercado Pago y retorna la URL de checkout
  createMercadoPagoPreference: async (params: {
    bookingId: string
    amount: number
    currency?: string
  }): Promise<string | undefined> => {
    // Intento de backend; si no existe, lanzará y se usará el fallback client-side
    const response = await api.post('/payments/mercadopago/preferences', {
      booking_id: params.bookingId,
      amount: params.amount,
      currency: params.currency || 'PEN',
    })
    return response.data?.init_point || response.data?.sandbox_init_point || response.data?.url
  },

  // Fallback directo a la API de Mercado Pago (client-side) cuando no existe backend
  createMercadoPagoPreferenceClient: async (params: {
    bookingId: string
    amount: number
    currency?: string
    title?: string
    accessToken?: string
  }): Promise<string | undefined> => {
    const token = params.accessToken || DEFAULT_MP_ACCESS_TOKEN
    const payload = {
      items: [
        {
          title: params.title || `GOGOBUS - Reserva ${params.bookingId}`,
          quantity: 1,
          currency_id: params.currency || 'PEN',
          unit_price: Number(params.amount),
        },
      ],
      metadata: { bookingId: params.bookingId },
      back_urls: {
        success: `${typeof window !== 'undefined' ? window.location.origin : ''}/checkout/success?bookingId=${params.bookingId}`,
        failure: `${typeof window !== 'undefined' ? window.location.origin : ''}/checkout/${params.bookingId}`,
        pending: `${typeof window !== 'undefined' ? window.location.origin : ''}/checkout/${params.bookingId}`,
      },
      auto_return: 'approved',
    }

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Mercado Pago error ${res.status}: ${text}`)
    }

    const data = await res.json()
    return data.init_point || data.sandbox_init_point || data.url
  },
}
