'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AutoCompleteCity } from '@/components/search/location-autocomplete'
import type { Location } from '@/types'

export function HeroSearch() {
  const router = useRouter()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [searchForm, setSearchForm] = useState<{
    origin: Location | null
    destination: Location | null
    departureDate: string
  }>({
    origin: null,
    destination: null,
    departureDate: '',
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchForm.origin?.id || !searchForm.destination?.id || !searchForm.departureDate) return

    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)

    const searchParams = new URLSearchParams({
      originId: searchForm.origin.id,
      originName: searchForm.origin.name,
      destinationId: searchForm.destination.id,
      destinationName: searchForm.destination.name,
      date: searchForm.departureDate,
      passengers: '1',
    })
    router.push(`/search?${searchParams.toString()}`)
  }

  const handleLocationChange = (field: 'origin' | 'destination', value: Location | null) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateChange = (value: string) => {
    setSearchForm((prev) => ({
      ...prev,
      departureDate: value,
    }))
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <section
        className="relative bg-gradient-to-r from-[#002A33] to-[#004A5A] py-20 overflow-hidden"
        style={{
          backgroundImage: `url('/modern-bus-travel-hero-background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#002A33]/95 to-[#004A5A]/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-white mb-6">Viaja por España con Comodidad y Seguridad</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Descubre los mejores destinos de España con GOGOBUS. Precios competitivos, horarios flexibles y la
                mejor experiencia de viaje.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="bg-[#F5951F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  onClick={() => scrollToSection('popular-routes')}
                >
                  <i className="fas fa-ticket-alt mr-2" />
                  Ver Promociones
                </button>
                <button
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#002A33] transition-colors"
                  onClick={() => scrollToSection('app-download')}
                >
                  <i className="fas fa-play mr-2" />
                  Ver Video
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-[#002A33] mb-6">Buscar Viajes</h3>
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AutoCompleteCity
                    label="Origen"
                    value={searchForm.origin}
                    onChange={(v) => handleLocationChange('origin', v)}
                    placeholder="Ciudad de origen"
                  />
                  <AutoCompleteCity
                    label="Destino"
                    value={searchForm.destination}
                    onChange={(v) => handleLocationChange('destination', v)}
                    placeholder="Ciudad de destino"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Ida</label>
                  <div className="relative">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={searchForm.departureDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5951F] focus:border-transparent text-sm"
                    />
                    <i className="fas fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#F5951F] text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors"
                >
                  <i className="fas fa-search mr-2" />
                  Buscar Viajes
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <i className="fas fa-check-circle mr-2" />
          ¡Búsqueda realizada correctamente!
        </div>
      )}
    </>
  )
}
