'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

interface PopularRoute {
  id: number
  route: string
  price: number
  duration: string
  image: string
}

export function PopularRoutes() {
  const router = useRouter()

  const popularRoutes: PopularRoute[] = useMemo(
    () => [
      { id: 1, route: 'Madrid - Barcelona', price: 25, duration: '7h 30min', image: '/beautiful-barcelona-cityscape-with-sagrada-familia.jpg' },
      { id: 2, route: 'Madrid - Sevilla', price: 30, duration: '6h 15min', image: '/stunning-sevilla-cathedral-and-historic-architectu.jpg' },
      { id: 3, route: 'Barcelona - Valencia', price: 20, duration: '3h 45min', image: '/valencia-city-of-arts-and-sciences.jpg' },
      { id: 4, route: 'Madrid - Bilbao', price: 35, duration: '5h 20min', image: '/bilbao-guggenheim-museum.jpg' },
      { id: 5, route: 'Valencia - Granada', price: 28, duration: '5h 10min', image: '/granada-alhambra-palace.jpg' },
      { id: 6, route: 'Barcelona - Zaragoza', price: 22, duration: '3h 30min', image: '/zaragoza-basilica-del-pilar.jpg' },
    ],
    []
  )

  const buildSearchUrl = (routeName: string) => {
    const [origin, destination] = routeName.split(' - ')
    const today = new Date()
    const date = today.toISOString().slice(0, 10)
    const searchParams = new URLSearchParams({
      origin: origin || '',
      destination: destination || '',
      date,
      passengers: '1',
    })
    return `/search?${searchParams.toString()}`
  }

  return (
    <section id="popular-routes" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-[#002A33] mb-4">Rutas Más Populares</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre los destinos favoritos de nuestros pasajeros con las mejores tarifas y horarios
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularRoutes.map((route) => {
            const searchUrl = buildSearchUrl(route.route)
            return (
              <div
                key={route.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(searchUrl)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={route.image || '/placeholder.svg'} alt={route.route} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-[#F5951F] text-white px-3 py-1 rounded-full font-bold text-sm">
                    Desde €{route.price}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-[#002A33] mb-2">{route.route}</h4>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-clock mr-2 text-[#F5951F]" />
                      <span className="text-sm">{route.duration}</span>
                    </div>
                    <div className="text-2xl font-bold text-[#F5951F]">€{route.price}</div>
                  </div>
                  <button
                    className="w-full bg-[#002A33] text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(searchUrl)
                    }}
                  >
                    Ver Horarios
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center mt-12">
          <button
            className="bg-[#F5951F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            onClick={() => router.push(buildSearchUrl(popularRoutes[0].route))}
          >
            Ver Todas las Rutas
          </button>
        </div>
      </div>
    </section>
  )
}
