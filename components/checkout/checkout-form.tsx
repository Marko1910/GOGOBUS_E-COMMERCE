'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Passenger } from '@/types'
import { useToast } from '@/hooks/use-toast'

const passengerSchema = z.object({
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  documentType: z.enum(['dni', 'passport', 'other']),
  documentNumber: z.string().min(8, 'Documento inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
})

interface CheckoutFormProps {
  seats: string[]
  onSubmit: (passengers: Passenger[]) => void
}

export function CheckoutForm({ seats, onSubmit }: CheckoutFormProps) {
  const { toast } = useToast()
  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      try {
        const raw = sessionStorage.getItem('gogobus_passengers')
        const stored = raw ? (JSON.parse(raw) as Record<string, Passenger>) : {}
        return seats.map((seatId, index) => {
          const base: Passenger = {
            firstName: '',
            lastName: '',
            documentType: 'dni',
            documentNumber: '',
            email: '',
            phone: '',
          }
          if (stored[seatId]) {
            const { firstName, lastName, documentType, documentNumber, email, phone } = stored[seatId]
            return { ...base, firstName, lastName, documentType, documentNumber, email, phone }
          }
          // Primer pasajero puede heredar email/phone si existe en otro asiento guardado
          if (index === 0) {
            const firstStored = Object.values(stored)[0]
            if (firstStored) {
              return { ...base, email: firstStored.email || '', phone: firstStored.phone || '' }
            }
          }
          return base
        })
      } catch {
        // si falla el parse, iniciamos limpio
      }
    }
    return seats.map(() => ({
      firstName: '',
      lastName: '',
      documentType: 'dni',
      documentNumber: '',
      email: '',
      phone: '',
    }))
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const hasEmpty = passengers.some(
      (p) =>
        !p.firstName ||
        !p.lastName ||
        !p.documentNumber ||
        !p.email ||
        !p.phone ||
        !p.documentType
    )
    if (hasEmpty) {
      toast({
        variant: 'destructive',
        title: 'Datos incompletos',
        description: 'Completa todos los campos de los pasajeros antes de continuar.',
      })
      return
    }
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const bySeat: Record<string, Passenger> = {}
      seats.forEach((seatId, idx) => {
        bySeat[seatId] = passengers[idx]
      })
      sessionStorage.setItem('gogobus_passengers', JSON.stringify(bySeat))
    }
    onSubmit(passengers)
  }

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const newPassengers = [...passengers]
    newPassengers[index] = { ...newPassengers[index], [field]: value }
    setPassengers(newPassengers)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {seats.map((seatId, index) => (
        <Card key={seatId} className="border-l-4 border-l-secondary">
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Pasajero {index + 1}</span>
              <span className="text-sm font-normal bg-primary/10 px-3 py-1 rounded-full text-primary">
                Asiento {seatId}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombres</Label>
              <Input
                required
                value={passengers[index].firstName}
                onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                placeholder="Como figura en el documento"
              />
            </div>
            <div className="space-y-2">
              <Label>Apellidos</Label>
              <Input
                required
                value={passengers[index].lastName}
                onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                placeholder="Como figura en el documento"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Documento</Label>
              <Select
                value={passengers[index].documentType}
                onValueChange={(value: any) => updatePassenger(index, 'documentType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dni">DNI</SelectItem>
                  <SelectItem value="passport">Pasaporte</SelectItem>
                  <SelectItem value="other">Carnet de Extranjería</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Número de Documento</Label>
              <Input
                required
                value={passengers[index].documentNumber}
                onChange={(e) => updatePassenger(index, 'documentNumber', e.target.value)}
              />
            </div>
            {index === 0 && (
              <>
                <div className="space-y-2">
                  <Label>Email de contacto</Label>
                  <Input
                    required
                    type="email"
                    value={passengers[index].email}
                    onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                    placeholder="Para enviar los boletos"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    required
                    type="tel"
                    value={passengers[index].phone}
                    onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg">
        Continuar al Pago
      </Button>
    </form>
  )
}
