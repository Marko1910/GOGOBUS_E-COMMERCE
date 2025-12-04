import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MyTripsView } from '@/components/trips/my-trips-view'

export default function MyTripsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <MyTripsView />
      </main>
      <Footer />
    </div>
  )
}
