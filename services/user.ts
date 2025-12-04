import api, { handleApiError } from '@/lib/api'
import { User, LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/types'

export const userService = {
  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', data)
      const authData = response.data

      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('gogobus_token', authData.token)
        localStorage.setItem('gogobus_user', JSON.stringify(authData.user))
      }

      return authData
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', data)
      const authData = response.data

      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('gogobus_token', authData.token)
        localStorage.setItem('gogobus_user', JSON.stringify(authData.user))
      }

      return authData
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const stored = userService.getStoredUser()
      if (stored) return stored

      const response = await api.get('/user')
      return response.data
    } catch (error) {
      const stored = userService.getStoredUser()
      if (stored) return stored
      throw new Error(handleApiError(error))
    }
  },

  // Logout
  logout: () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('gogobus_token')
      localStorage.removeItem('gogobus_user')
      window.location.href = '/'
    }
  },

  // Get stored user
  getStoredUser: (): User | null => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null
    const userStr = localStorage.getItem('gogobus_user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
      ? !!localStorage.getItem('gogobus_token')
      : false
  },
}
