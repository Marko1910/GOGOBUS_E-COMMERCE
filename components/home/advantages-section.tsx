export function AdvantagesSection() {
  return (
    <section className="py-16 bg-[#002A33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-white mb-4">
            ¿Por Qué Elegir GOGOBUS?
          </h3>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Somos la opción preferida de miles de pasajeros en toda España
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-[#F5951F] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-euro-sign text-2xl"></i>
            </div>
            <h4 className="text-xl font-bold mb-2">Precios Competitivos</h4>
            <p className="text-white/80 leading-relaxed">Las mejores tarifas del mercado con ofertas especiales</p>
          </div>
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-[#F5951F] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-map-marked-alt text-2xl"></i>
            </div>
            <h4 className="text-xl font-bold mb-2">Amplia Cobertura</h4>
            <p className="text-white/80 leading-relaxed">Más de 200 destinos en toda España</p>
          </div>
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-[#F5951F] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bus text-2xl"></i>
            </div>
            <h4 className="text-xl font-bold mb-2">Flota Moderna</h4>
            <p className="text-white/80 leading-relaxed">Autobuses nuevos con la última tecnología</p>
          </div>
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-[#F5951F] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-headset text-2xl"></i>
            </div>
            <h4 className="text-xl font-bold mb-2">Atención 24/7</h4>
            <p className="text-white/80 leading-relaxed">Soporte al cliente disponible las 24 horas</p>
          </div>
        </div>
      </div>
    </section>
  )
}
