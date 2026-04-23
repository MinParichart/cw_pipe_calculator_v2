// Axios Plugin
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor - add auth token
  api.interceptors.request.use(
    (config) => {
      // Check if running on client-side (support both SSR modes)
      if (process.client || import.meta.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // ❌ ลบ Content-Type สำหรับ FormData ให้ Axios ตั้งเอง
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type']
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid - only on client-side
        if (import.meta.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          // Redirect to login (if not already there)
          if (window.location.pathname !== '/') {
            window.location.href = '/'
          }
        }
      }
      return Promise.reject(error)
    }
  )

  // Provide axios instance globally
  nuxtApp.provide('api', api)
})
