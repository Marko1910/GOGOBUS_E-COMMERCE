export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'María González',
      rating: 5,
      comment: 'Excelente servicio, muy puntual y cómodo. Los asientos son muy confortables y el WiFi funciona perfectamente.',
      image: '/professional-portrait-of-happy-middle-aged-spanish.jpg'
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      rating: 5,
      comment: 'He viajado varias veces con GOGOBUS y siempre quedo satisfecho. Precios justos y excelente atención al cliente.',
      image: '/professional-portrait-of-friendly-spanish-business.jpg'
    },
    {
      id: 3,
      name: 'Ana Martín',
      rating: 5,
      comment: 'La aplicación móvil es muy fácil de usar y el proceso de reserva es rápido. Recomiendo GOGOBUS sin dudarlo.',
      image: '/professional-portrait-of-young-spanish-woman-smili.jpg'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-[#002A33] mb-4">
            Lo Que Dicen Nuestros Clientes
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Miles de pasajeros confían en GOGOBUS para sus viajes por España
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold text-[#002A33]">{testimonial.name}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-sm"></i>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed italic">&ldquo;{testimonial.comment}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
