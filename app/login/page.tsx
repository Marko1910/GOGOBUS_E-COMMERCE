'use client'

export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = searchParams.get('redirect') || '/'

  const handleFakeLogin = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('gogobus_token', 'demo-token')
      localStorage.setItem(
        'gogobus_user',
        JSON.stringify({
          id: 'demo-user',
          email: 'demo@gogobus.com',
          firstName: 'Demo',
          lastName: 'User',
        })
      )
    }
    router.replace(redirect)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white border rounded-xl shadow-sm p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center text-primary">Inicia sesión</h1>
          <p className="text-sm text-muted-foreground text-center">
            Pantalla temporal para desarrollo. Simula un login rápido y vuelve al flujo.
          </p>
          <button
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            onClick={handleFakeLogin}
          >
            Continuar
          </button>
          <button
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            onClick={() => router.replace('/')}
          >
            Volver al inicio
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <LoginContent />
    </Suspense>
  )
}
