import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSearch } from '@/components/home/hero-search'
import { PopularRoutes } from '@/components/home/popular-routes'
import { ServicesSection } from '@/components/home/services-section'
import { AppDownloadSection } from '@/components/home/app-download-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { AdvantagesSection } from '@/components/home/advantages-section'
import { NewsletterSection } from '@/components/home/newsletter-section'
import { FloatingDownloadButton } from '@/components/home/floating-download-button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section with Search */}
        <HeroSearch />

        {/* Popular Routes */}
        <PopularRoutes />

        {/* Services */}
        <ServicesSection />

        {/* App Download */}
        <AppDownloadSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Competitive Advantages */}
        <AdvantagesSection />

        {/* Newsletter */}
        <NewsletterSection />

        {/* Floating Download Button */}
        <FloatingDownloadButton />
      </main>

      <Footer />
    </div>
  )
}
