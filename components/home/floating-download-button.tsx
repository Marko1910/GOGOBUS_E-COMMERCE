'use client'

export function FloatingDownloadButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="bg-[#F5951F] text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110">
        <i className="fas fa-download text-xl"></i>
        <span className="sr-only">Descargar App</span>
      </button>
    </div>
  )
}
