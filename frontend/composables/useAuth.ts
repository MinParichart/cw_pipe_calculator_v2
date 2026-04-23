// Authentication Composable
export const useAuth = () => {
  const config = useRuntimeConfig()

  // Don't access $api here to avoid SSR issues
  const user = useState<string | null>('auth_user', () => null)
  const token = useState<string | null>('auth_token', () => null)

  // Load from localStorage only on client side (directly, not in onMounted)
  if (import.meta.client) {
    const storedUser = localStorage.getItem('auth_user')
    const storedToken = localStorage.getItem('auth_token')
    if (storedUser) user.value = JSON.parse(storedUser)
    if (storedToken) token.value = storedToken
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Helper to get api instance safely
  const getApi = () => {
    const nuxtApp = useNuxtApp()
    return nuxtApp.$api
  }

  /**
   * Register new user
   */
  const register = async (email: string, password: string, name?: string) => {
    try {
      const api = getApi()
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
      })

      const { user: userData, token: userToken } = response.data.data

      // Store in state
      user.value = userData
      token.value = userToken

      // Store in localStorage
      if (import.meta.client) {
        localStorage.setItem('auth_token', userToken)
        localStorage.setItem('auth_user', JSON.stringify(userData))
      }

      return { success: true, data: response.data.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || { message: error.message },
      }
    }
  }

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    try {
      const api = getApi()
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { user: userData, token: userToken } = response.data.data

      // Store in state
      user.value = userData
      token.value = userToken

      // Store in localStorage
      if (import.meta.client) {
        localStorage.setItem('auth_token', userToken)
        localStorage.setItem('auth_user', JSON.stringify(userData))
      }

      return { success: true, data: response.data.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || { message: error.message },
      }
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      const api = getApi()
      await api.post('/auth/logout')
    } catch (error) {
      // Ignore logout errors
    } finally {
      // Clear state
      user.value = null
      token.value = null

      // Clear localStorage
      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }

      // Redirect to home
      await navigateTo('/')
    }
  }

  /**
   * Get current user
   */
  const fetchUser = async () => {
    if (!token.value) {
      return { success: false, error: { message: 'No token found' } }
    }

    try {
      const api = getApi()
      const response = await api.get('/auth/me')
      user.value = response.data.data

      if (import.meta.client) {
        localStorage.setItem('auth_user', JSON.stringify(response.data.data))
      }

      return { success: true, data: response.data.data }
    } catch (error: any) {
      // Token might be expired
      if (error.response?.status === 401) {
        user.value = null
        token.value = null
        if (import.meta.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        }
      }
      return {
        success: false,
        error: error.response?.data?.error || { message: error.message },
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    register,
    login,
    logout,
    fetchUser,
  }
}
