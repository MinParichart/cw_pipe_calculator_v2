// Authentication Middleware
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  // Pages that don't require authentication
  const publicPages = ['/']

  // Check if page requires auth
  const requiresAuth = !publicPages.includes(to.path)

  if (requiresAuth && !isAuthenticated.value) {
    // Redirect to login
    return navigateTo('/')
  }

  // If already authenticated and trying to access login page
  if (!requiresAuth && isAuthenticated.value) {
    return navigateTo('/projects')
  }
})
