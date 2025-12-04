import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProfileView } from '@/components/profile/profile-view'

export const metadata = {
  title: 'Mi Perfil - GOGOBUS',
  description: 'Gestiona tu información personal, preferencias de viaje y configuraciones de cuenta'
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <ProfileView />
      </main>
      <Footer />
    </div>
  )
}
