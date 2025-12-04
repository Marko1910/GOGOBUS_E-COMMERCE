'use client'

import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setEmail('')
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl font-bold text-[#002A33] mb-4">
          Suscríbete a Nuestro Newsletter
        </h3>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Recibe las mejores ofertas y promociones exclusivas directamente en tu email
        </p>
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email"
            required
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#F5951F] focus:border-transparent text-sm"
          />
          <button
            type="submit"
            className="bg-[#F5951F] text-white px-6 py-3 rounded-r-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Suscribirse
          </button>
        </form>
        {showSuccess && (
          <div className="mt-4 text-green-600 font-medium">
            <i className="fas fa-check-circle mr-2"></i>
            ¡Gracias por suscribirte!
          </div>
        )}
      </div>
    </section>
  )
}
