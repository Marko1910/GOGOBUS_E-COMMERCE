'use client'

export const dynamic = 'force-dynamic'

import { useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Filter, ArrowUpDown, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { TripCard } from '@/components/trips/trip-card'
import { useSearchTrips } from '@/hooks/use-search-trips'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AutoCompleteCity } from '@/components/search/location-autocomplete'

export const dynamic = 'force-dynamic'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const originId = searchParams.get('originId') || ''
  const destinationId = searchParams.get('destinationId') || ''
  const originName = searchParams.get('originName') || ''
  const destinationName = searchParams.get('destinationName') || ''
  const date = searchParams.get('date') || ''
  const passengers = Number(searchParams.get('passengers') || 1)

  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState<string[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc' | undefined>(undefined)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const originLocation = originId ? { id: originId, name: originName || originId } : null
  const destinationLocation = destinationId ? { id: destinationId, name: destinationName || destinationId } : null

  const updateQuery = (updates: Partial<Record<string, string | number>>) => {
    const params = new URLSearchParams()
    const state = {
      originId,
      destinationId,
      originName,
      destinationName,
      date,
      passengers,
      ...updates,
    }

    Object.entries(state).forEach(([key, value]) => {
      if (value) params.set(key, String(value))
    })

    router.replace(`/search?${params.toString()}`)
  }

  const handleSortChange = () => {
    setSortOrder((prev) => {
      if (prev === 'price-asc') return 'price-desc'
      if (prev === 'price-desc') return undefined
      return 'price-asc'
    })
  }

  const {
    data: trips,
    isLoading,
    error,
  } = useSearchTrips({
    originId,
    destinationId,
    date,
    departureTimes: selectedDepartureTimes,
    companies: selectedCompanies,
    services: selectedServices,
    sortOrder,
    passengers,
  })

  const resultsLabel = useMemo(() => {
    if (isLoading) return 'Buscando viajes...'
    const count = trips?.length || 0
    return `${count} ${count === 1 ? 'viaje encontrado' : 'viajes encontrados'}`
  }, [isLoading, trips])

  let sortLabel = ''
  if (sortOrder === 'price-asc') {
    sortLabel = '(asc)'
  } else if (sortOrder === 'price-desc') {
    sortLabel = '(desc)'
  }

  const displayOrigin = originLocation?.name || 'Origen'
  const displayDestination = destinationLocation?.name || 'Destino'

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <div className="bg-primary pb-20 pt-24">
        <Header />
        <div className="container mx-auto px-4 text-white">
          <h1 className="text-3xl font-bold mb-2">
            {displayOrigin} <span className="text-secondary">-&gt;</span> {displayDestination}
          </h1>
          <p className="opacity-80">{date ? `Resultados para el ${date}` : 'Selecciona una fecha'}</p>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-12 mb-20 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
              <AutoCompleteCity
                label="Origen"
                value={originLocation}
                onChange={(v) =>
                  updateQuery({
                    originId: v?.id || '',
                    originName: v?.name || '',
                  })
                }
              />
              <AutoCompleteCity
                label="Destino"
                value={destinationLocation}
                onChange={(v) =>
                  updateQuery({
                    destinationId: v?.id || '',
                    destinationName: v?.name || '',
                  })
                }
              />
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => updateQuery({ date: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </aside>

          {/* Results List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
              <span className="font-medium text-primary">{resultsLabel}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSortChange}
                  className="text-muted-foreground hover:text-primary"
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Ordenar por precio {sortLabel}
                </Button>
                <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setIsFilterModalOpen(true)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Cambiar b�squeda
                </Button>
              </div>
            </div>

            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-xl border">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">No pudimos cargar los viajes</h3>
                <p className="text-muted-foreground">
                  {error instanceof Error ? error.message : 'Intenta nuevamente en unos momentos.'}
                </p>
              </div>
            ) : trips?.length ? (
              trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">No se encontraron viajes</h3>
                <p className="text-muted-foreground">Intenta cambiar la fecha o los filtros de b�squeda.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Filter Modal for Mobile */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-t-xl lg:rounded-xl shadow-lg w-full max-w-lg h-3/4 lg:h-auto overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">Editar b�squeda</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <AutoCompleteCity
                label="Origen"
                value={originLocation}
                onChange={(v) =>
                  updateQuery({
                    originId: v?.id || '',
                    originName: v?.name || '',
                  })
                }
              />
              <AutoCompleteCity
                label="Destino"
                value={destinationLocation}
                onChange={(v) =>
                  updateQuery({
                    destinationId: v?.id || '',
                    destinationName: v?.name || '',
                  })
                }
              />
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => updateQuery({ date: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsFilterModalOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={() => setIsFilterModalOpen(false)}>Aplicar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
