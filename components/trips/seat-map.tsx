'use client'

import { useState } from 'react'
import { Seat, SeatMap as SeatMapType } from '@/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FerrisWheel as SteeringWheel } from 'lucide-react'

interface SeatMapProps {
  seatMap: SeatMapType
  selectedSeats: string[]
  onSeatSelect: (seatId: string) => void
}

export function SeatMap({ seatMap, selectedSeats, onSeatSelect }: SeatMapProps) {
  const [floor, setFloor] = useState<1 | 2>(1)
  
  // Filter seats by floor (assuming row numbers indicate floor, e.g., 1-10 floor 1, 11-20 floor 2)
  // This logic might need adjustment based on actual API data structure
  const floor1Seats = seatMap.seats.filter(s => s.row <= 10)
  const floor2Seats = seatMap.seats.filter(s => s.row > 10)
  const hasSecondFloor = floor2Seats.length > 0

  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id)
    const isOccupied = seat.status === 'occupied'
    const isBlocked = seat.status === 'blocked'
    
    return (
      <button
        key={seat.id}
        disabled={isOccupied || isBlocked}
        onClick={() => onSeatSelect(seat.id)}
        className={cn(
          "w-10 h-10 m-1 rounded-t-lg rounded-b-md border-2 flex items-center justify-center text-xs font-bold transition-all relative group",
          isOccupied ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed" :
          isBlocked ? "bg-orange-100 border-orange-300 text-orange-400 cursor-not-allowed" :
          isSelected ? "bg-primary border-primary text-white shadow-md scale-105" :
          "bg-white border-primary/30 text-primary hover:border-secondary hover:text-secondary"
        )}
      >
        {seat.number}
        
        {/* Seat Type Indicator */}
        {seat.type === 'vip' && !isSelected && !isOccupied && (
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full border border-white shadow-sm" title="VIP" />
        )}
      </button>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-primary">Selecciona tus asientos</h3>
        
        {hasSecondFloor && (
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => setFloor(1)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                floor === 1 ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              Piso 1
            </button>
            <button
              onClick={() => setFloor(2)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                floor === 2 ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              Piso 2
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8 text-sm justify-center bg-muted/30 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-primary/30 bg-white" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-primary bg-primary" />
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-gray-400 bg-gray-300" />
          <span>Ocupado</span>
        </div>
      </div>

      {/* Bus Layout */}
      <div className="relative max-w-[300px] mx-auto bg-gray-50 rounded-3xl p-8 border-2 border-gray-200">
        {/* Driver Area */}
        <div className="absolute top-4 right-8 text-gray-400">
          <SteeringWheel className="w-8 h-8" />
        </div>

        <div className="mt-12 space-y-4">
          {/* Render seats based on layout grid logic */}
          {/* This is a simplified grid rendering, real implementation would use the layout matrix */}
          <div className="grid grid-cols-4 gap-x-8 gap-y-2">
            {(floor === 1 ? floor1Seats : floor2Seats).map(seat => (
              <div key={seat.id} className={cn(
                seat.column === 2 ? "mr-8" : "" // Aisle gap
              )}>
                {renderSeat(seat)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
