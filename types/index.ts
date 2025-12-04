// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Trip Types
export interface Trip {
  id: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime?: string
  duration?: number // in minutes
  price: number
  currency: string
  availableSeats: number
  totalSeats?: number
  busType?: string
  amenities: string[]
  company?: string
  status?: 'available' | 'full' | 'cancelled'
}

export interface TripSearchParams {
  origin?: string
  destination?: string
  originId?: string
  destinationId?: string
  originName?: string
  destinationName?: string
  date: string
  passengers?: number
  departureTimes?: string[]
  companies?: string[]
  services?: string[]
  sortOrder?: 'price-asc' | 'price-desc' | null
}

// Seat Types
export interface Seat {
  id: string
  number: string
  row: number
  column: number
  type: 'standard' | 'premium' | 'vip'
  status: 'available' | 'occupied' | 'blocked' | 'selected'
  price: number
}

export interface SeatMap {
  tripId: string
  rows: number
  columns: number
  seats: Seat[]
  layout: string[][] // 2D array representing seat layout
}

// Location Types
export interface Location {
  id: string
  name: string
  terminal?: string
  address?: string
  region?: string
}

// Booking Types
export interface Passenger {
  firstName: string
  lastName: string
  documentType: 'dni' | 'passport' | 'other'
  documentNumber: string
  email: string
  phone: string
  dateOfBirth?: string
}

export interface BookingRequest {
  tripId: string
  seatIds: string[]
  passengers: Passenger[]
  couponCode?: string
  busPointsToUse?: number
  totalAmount?: number
}

export interface Booking {
  id: string
  tripId: string
  trip: Trip
  seats: Seat[]
  passengers: Passenger[]
  subtotal: number
  discount: number
  busPointsUsed?: number
  total: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentUrl?: string
  qrCode?: string
  bookingCode: string
  createdAt: string
  updatedAt: string
}

// Payment Types
export interface Payment {
  id: string
  bookingId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  method: string
  transactionId?: string
  createdAt: string
  updatedAt: string
}

// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  documentType: string
  documentNumber: string
  busPoints: number
  birthDate?: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  documentType: string
  documentNumber: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// Simplified payment status
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED'
