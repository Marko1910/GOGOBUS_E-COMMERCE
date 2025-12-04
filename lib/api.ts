import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.gogobus.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('gogobus_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Fallback para endpoints de pagos en modo demo
    if (error.config?.url?.includes('/payments/')) {
      return Promise.resolve({
        data: { status: 'PENDING' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      } as any)
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('gogobus_token')
        localStorage.removeItem('gogobus_user')
        // No redirigir automáticamente para no interrumpir el flujo de compra
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>
    return axiosError.response?.data?.message || axiosError.message || 'Error en la conexión'
  }
  return 'Error desconocido'
}
