export function ServicesSection() {
  const services = [
    {
      icon: 'fas fa-wifi',
      title: 'WiFi Gratuito',
      description: 'Conexión a internet de alta velocidad en todos nuestros autobuses'
    },
    {
      icon: 'fas fa-couch',
      title: 'Asientos Cómodos',
      description: 'Asientos reclinables con espacio extra para piernas'
    },
    {
      icon: 'fas fa-snowflake',
      title: 'Aire Acondicionado',
      description: 'Climatización perfecta durante todo el viaje'
    },
    {
      icon: 'fas fa-tv',
      title: 'Entretenimiento',
      description: 'Sistema multimedia con películas, música y juegos'
    },
    {
      icon: 'fas fa-suitcase',
      title: 'Equipaje Incluido',
      description: 'Hasta 20kg de equipaje facturado sin costo adicional'
    },
    {
      icon: 'fas fa-clock',
      title: 'Puntualidad',
      description: '98% de puntualidad garantizada en todos nuestros servicios'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-[#002A33] mb-4">
            Nuestros Servicios
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Disfruta de la mejor experiencia de viaje con todos los servicios incluidos
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#F5951F] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className={`${service.icon} text-2xl text-white`}></i>
              </div>
              <h4 className="text-xl font-bold text-[#002A33] mb-4">{service.title}</h4>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
