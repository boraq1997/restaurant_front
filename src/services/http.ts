import axios from 'axios'
import { useAuthStore } from '../modules/auth/store/auth.store'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://72.62.63.16:9090/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// أضف JWT token تلقائياً لكل request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// معالجة 401 تلقائياً
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default http