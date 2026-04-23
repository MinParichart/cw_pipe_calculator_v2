// Authentication Store (Pinia)
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<any>(null)
  const token = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  // Actions
  function setUser(userData: any) {
    user.value = userData
    if (process.client) {
      localStorage.setItem('auth_user', JSON.stringify(userData))
    }
  }

  function setToken(tokenValue: string) {
    token.value = tokenValue
    if (process.client) {
      localStorage.setItem('auth_token', tokenValue)
    }
  }

  function clearAuth() {
    user.value = null
    token.value = null
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  function initFromStorage() {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    }
  }

  // Initialize on store creation
  initFromStorage()

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    setUser,
    setToken,
    clearAuth,
    initFromStorage,
  }
})
