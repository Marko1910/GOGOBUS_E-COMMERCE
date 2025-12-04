'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'
import Autoplay from "embla-carousel-autoplay"

const promotions = [
  {
    id: 1,
    title: "Viaja al Norte",
    description: "20% de descuento en rutas a Piura y Tumbes",
    image: "/placeholder.svg?height=400&width=800&text=Playas+del+Norte",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Cusco Mágico",
    description: "Acumula doble BusPoints en tu viaje a Cusco",
    image: "/placeholder.svg?height=400&width=800&text=Cusco+Magico",
    color: "bg-orange-500"
  },
  {
    id: 3,
    title: "Rutas del Sur",
    description: "Precios especiales para Arequipa y Tacna",
    image: "/placeholder.svg?height=400&width=800&text=Arequipa",
    color: "bg-red-500"
  }
]

export function PromoCarousel() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">Promociones Especiales</h2>
            <p className="text-muted-foreground">Aprovecha nuestras ofertas exclusivas</p>
          </div>
          <Button variant="link" className="text-secondary hover:text-secondary/80">
            Ver todas <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {promotions.map((promo) => (
              <CarouselItem key={promo.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden border-0 shadow-lg group cursor-pointer h-full">
                  <CardContent className="p-0 relative aspect-[4/3]">
                    <img 
                      src={promo.image || "/placeholder.svg"} 
                      alt={promo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                      <p className="text-white/90 mb-4">{promo.description}</p>
                      <Button className="w-fit bg-secondary hover:bg-secondary/90 text-white border-none">
                        Comprar Ahora
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-white text-primary hover:bg-secondary hover:text-white border-none shadow-lg" />
          <CarouselNext className="hidden md:flex -right-4 bg-white text-primary hover:bg-secondary hover:text-white border-none shadow-lg" />
        </Carousel>
      </div>
    </section>
  )
}
