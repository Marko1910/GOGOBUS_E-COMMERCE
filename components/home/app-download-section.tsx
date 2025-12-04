export function AppDownloadSection() {
  return (
    <section id="app-download" className="py-16 bg-gradient-to-r from-[#F5951F] to-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-4xl font-bold text-white mb-6">Descarga Nuestra App Móvil</h3>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Reserva tus viajes de forma más rápida y sencilla. Recibe notificaciones en tiempo real y accede a ofertas
              exclusivas.
            </p>
            <div className="space-y-4 mb-8">
              {[
                'Reservas más rápidas y sencillas',
                'Notificaciones de viaje en tiempo real',
                'Ofertas exclusivas para usuarios de la app',
                'Gestión completa de tus reservas',
              ].map((text) => (
                <div key={text} className="flex items-center text-white">
                  <i className="fas fa-check-circle mr-3 text-xl" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center">
                <i className="fab fa-google-play mr-2 text-xl" />
                <div className="text-left">
                  <div className="text-xs">Disponible en</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center">
                <i className="fab fa-apple mr-2 text-xl" />
                <div className="text-left">
                  <div className="text-xs">Descargar en</div>
                  <div className="font-bold">App Store</div>
                </div>
              </button>
            </div>
          </div>
          <div className="text-center">
            <img src="/modern-smartphone-mockup-showing-bus-booking-app-i.jpg" alt="GOGOBUS App" className="max-w-sm mx-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}
