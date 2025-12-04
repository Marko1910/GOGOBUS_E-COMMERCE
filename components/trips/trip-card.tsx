'use client'

import { Trip } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Wifi, Coffee, Tv, Battery, Clock, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  const router = useRouter()

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />
      case 'snack': return <Coffee className="w-4 h-4" />
      case 'tv': return <Tv className="w-4 h-4" />
      case 'usb': return <Battery className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Time & Route Info */}
          <div className="flex-1 p-6 flex flex-col justify-between gap-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-8 items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {format(new Date(trip.departureTime), 'HH:mm')}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{trip.origin}</div>
                </div>
                
                <div className="flex flex-col items-center gap-1 flex-1 min-w-[100px]">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.floor(trip.duration / 60)}h {trip.duration % 60}m
                  </div>
                  <div className="w-full h-[2px] bg-muted relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div className="text-xs text-secondary font-medium">Directo</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {format(new Date(trip.arrivalTime), 'HH:mm')}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{trip.destination}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-semibold text-primary bg-primary/5 px-2 py-1 rounded">
                {trip.company}
              </span>
              <span className="border-l pl-4">{trip.busType}</span>
              <div className="flex gap-2 border-l pl-4">
                {trip.amenities.map((amenity) => (
                  <div key={amenity} title={amenity} className="text-primary/60">
                    {getAmenityIcon(amenity)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price & Action */}
          <div className="md:w-64 bg-muted/30 p-6 flex flex-col justify-center items-center gap-4 border-t md:border-t-0 md:border-l border-dashed">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Precio desde</div>
              <div className="text-3xl font-bold text-primary">
                {trip.currency || '€'} {trip.price.toFixed(2)}
              </div>
              <div className="text-xs text-green-600 font-medium mt-1">
                {trip.availableSeats} asientos disponibles
              </div>
            </div>

            <Button 
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold shadow-md group-hover:shadow-lg transition-all"
              onClick={() => router.push(`/trips/${trip.id}`)}
            >
              Seleccionar
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
