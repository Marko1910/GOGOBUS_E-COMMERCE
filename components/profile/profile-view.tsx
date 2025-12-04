'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useUser } from '@/hooks/use-user'
import { useBookings } from '@/hooks/use-bookings'

export function ProfileView() {
  const [activeTab, setActiveTab] = useState('informacion-personal')
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const { data: user } = useUser()
  const { data: bookingsData } = useBookings()

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.firstName + ' ' + user?.lastName || 'Usuario',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || ''
  })

  const [travelPreferences, setTravelPreferences] = useState({
    seatPreference: 'ventana',
    notifications: {
      bookingConfirmation: true,
      travelReminders: true,
      promotionalOffers: false,
      serviceUpdates: true
    }
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const savedPaymentMethods = [
    {
      id: 1,
      type: 'visa',
      lastFour: '4532',
      expiryDate: '12/26',
      isDefault: true
    },
    {
      id: 2,
      type: 'mastercard',
      lastFour: '8901',
      expiryDate: '08/25',
      isDefault: false
    }
  ]

  const recentTrips = bookingsData?.bookings?.slice(0, 3) || []

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setTravelPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'informacion-personal':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <img
                  src="/professional-portrait-of-happy-middle-aged-spanish.jpg"
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 bg-[#F5951F] text-white rounded-full p-2 hover:bg-orange-600 transition-colors cursor-pointer">
                  <i className="fas fa-camera text-sm"></i>
                </button>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#002A33] mb-1">Foto de Perfil</h3>
                <p className="text-gray-600 text-sm">Sube una foto para personalizar tu perfil</p>
                <button className="mt-2 text-[#F5951F] text-sm font-medium hover:text-orange-600 cursor-pointer">
                  Cambiar foto
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5951F] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5951F] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5951F] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <Label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={personalInfo.birthDate}
                  onChange={(e) => handlePersonalInfoChange('birthDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5951F] focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button variant="outline" className="px-6 py-3">
                Cancelar
              </Button>
              <Button className="px-6 py-3 bg-[#F5951F] hover:bg-orange-600">
                Guardar Cambios
              </Button>
            </div>
          </div>
        )

      case 'datos-viaje':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-[#002A33] mb-4">Preferencias de Asiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'ventana', icon: 'fas fa-window-maximize', label: 'Ventana' },
                  { value: 'pasillo', icon: 'fas fa-walking', label: 'Pasillo' },
                  { value: 'sin-preferencia', icon: 'fas fa-random', label: 'Sin Preferencia' }
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setTravelPreferences(prev => ({ ...prev, seatPreference: option.value }))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      travelPreferences.seatPreference === option.value
                        ? 'border-[#F5951F] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <i className={`${option.icon} text-2xl mb-2 ${
                        travelPreferences.seatPreference === option.value ? 'text-[#F5951F]' : 'text-gray-400'
                      }`}></i>
                      <p className={`font-medium ${
                        travelPreferences.seatPreference === option.value ? 'text-[#002A33]' : 'text-gray-600'
                      }`}>
                        {option.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#002A33]">Métodos de Pago Guardados</h3>
                <Button className="bg-[#F5951F] hover:bg-orange-600 text-sm">
                  <i className="fas fa-plus mr-2"></i>
                  Agregar Tarjeta
                </Button>
              </div>
              <div className="space-y-4">
                {savedPaymentMethods.map((method) => (
                  <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <i className={`fab fa-cc-${method.type} text-xl ${
                          method.type === 'visa' ? 'text-blue-600' : 'text-red-500'
                        }`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          •••• •••• •••• {method.lastFour}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expira {method.expiryDate}
                          {method.isDefault && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Principal
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-red-400 hover:text-red-600 cursor-pointer">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'notificaciones':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                {
                  key: 'bookingConfirmation',
                  title: 'Confirmaciones de Reserva',
                  description: 'Recibe confirmaciones cuando realices una nueva reserva'
                },
                {
                  key: 'travelReminders',
                  title: 'Recordatorios de Viaje',
                  description: 'Te recordaremos sobre tus próximos viajes'
                },
                {
                  key: 'promotionalOffers',
                  title: 'Ofertas Promocionales',
                  description: 'Recibe ofertas especiales y descuentos exclusivos'
                },
                {
                  key: 'serviceUpdates',
                  title: 'Actualizaciones del Servicio',
                  description: 'Información sobre cambios en horarios o servicios'
                }
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                  </div>
                  <Switch
                    checked={travelPreferences.notifications[notification.key as keyof typeof travelPreferences.notifications]}
                    onCheckedChange={(checked) => handleNotificationChange(notification.key, checked)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <Button className="px-6 py-3 bg-[#F5951F] hover:bg-orange-600">
                Guardar Preferencias
              </Button>
            </div>
          </div>
        )

      case 'historial':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#002A33]">Viajes Recientes</h3>
              <a
                href="/my-trips"
                className="text-[#F5951F] font-medium hover:text-orange-600 cursor-pointer"
              >
                Ver Historial Completo
              </a>
            </div>
            <div className="space-y-4">
              {recentTrips.length > 0 ? (
                recentTrips.map((trip: any) => (
                  <div key={trip.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-sm font-medium text-gray-500">#{trip.bookingCode}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            trip.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            trip.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {trip.status === 'confirmed' ? 'Confirmado' : 
                             trip.status === 'completed' ? 'Completado' : trip.status}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900 mb-1">
                          {trip.trip?.origin} → {trip.trip?.destination}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(trip.trip?.departureTime).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#F5951F] text-lg">${trip.totalPrice}</p>
                        <button className="mt-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-bus text-4xl mb-4 text-gray-300"></i>
                  <p>No tienes viajes recientes</p>
                </div>
              )}
            </div>
          </div>
        )

      case 'configuracion':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-[#002A33] mb-4">Seguridad</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Contraseña</h4>
                    <p className="text-sm text-gray-500">Última actualización: hace 3 meses</p>
                  </div>
                  <Button
                    onClick={() => setIsPasswordChangeOpen(!isPasswordChangeOpen)}
                    className="bg-[#F5951F] hover:bg-orange-600 text-sm"
                  >
                    Cambiar Contraseña
                  </Button>
                </div>

                {isPasswordChangeOpen && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div>
                      <Label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña Actual
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsPasswordChangeOpen(false)}
                        className="text-sm"
                      >
                        Cancelar
                      </Button>
                      <Button className="bg-[#F5951F] hover:bg-orange-600 text-sm">
                        Actualizar Contraseña
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#002A33] mb-4">Privacidad</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Perfil Público</h4>
                    <p className="text-sm text-gray-500">Permite que otros usuarios vean tu perfil básico</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <Button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {/* Page Title */}
      <section className="bg-gradient-to-r from-[#002A33] to-[#004A5A] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Mi Perfil
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Gestiona tu información personal, preferencias de viaje y configuraciones de cuenta en un solo lugar.
            </p>
          </div>
        </div>
      </section>

      {/* Profile Navigation Tabs */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'informacion-personal', label: 'Información Personal', icon: 'fas fa-user' },
              { id: 'datos-viaje', label: 'Datos de Viaje', icon: 'fas fa-suitcase' },
              { id: 'notificaciones', label: 'Notificaciones', icon: 'fas fa-bell' },
              { id: 'historial', label: 'Historial', icon: 'fas fa-history' },
              { id: 'configuracion', label: 'Configuración', icon: 'fas fa-cog' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#F5951F] text-[#F5951F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            {renderTabContent()}
          </div>
        </div>
      </section>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <i className="fas fa-sign-out-alt text-4xl text-red-500 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cerrar Sesión</h3>
              <p className="text-gray-600 mb-6">¿Estás seguro de que quieres cerrar sesión?</p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    // Handle logout
                    setIsLogoutModalOpen(false)
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
