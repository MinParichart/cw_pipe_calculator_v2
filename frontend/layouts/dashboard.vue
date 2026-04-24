<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow fixed top-0 left-0 right-0 z-50 h-16 relative transition-all duration-300 ease-in-out"
      :class="{ 'ml-64': sidebarOpen }"
    >
      <div class="flex items-center justify-between h-full px-4">
        <!-- Left Side - Toggle Button -->
        <div class="flex items-center">
          <!-- Sidebar Toggle Button -->
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="p-2 rounded-md hover:bg-gray-100 transition-colors border border-gray-200 bg-white relative z-40"
            title="เปิด/ปิดเมนู"
          >
            <svg class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Logo (always visible) -->
          <div class="flex items-center ml-4">
            <svg class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span class="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
              CW Pipe Calculator
            </span>
            <span class="ml-2 text-lg font-bold text-gray-900 sm:hidden">
              CW Pipe Calc
            </span>
          </div>
        </div>

        <!-- Right Side - Profile & Logout -->
        <div class="flex items-center space-x-2">
          <!-- Profile Link -->
          <NuxtLink
            to="/profile"
            class="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 sm:px-3"
            title="โปรไฟล์"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="ml-1 hidden sm:inline">{{ user?.name || 'ผู้ใช้' }}</span>
          </NuxtLink>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="flex items-center px-2 py-2 rounded-md hover:bg-red-50 transition-colors text-sm font-medium text-red-600 border border-red-200 sm:px-3 sm:border-0 bg-white"
            title="ออกจากระบบ"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="ml-1 hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Sidebar Overlay (Mobile) -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    ></div>

    <!-- Sidebar Component -->
    <LayoutAppSidebar
      :is-open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <!-- Main Content -->
    <main
      class="transition-all duration-300 ease-in-out pt-16"
      :class="{
        'md:ml-64': sidebarOpen,
        'ml-0': !sidebarOpen
      }"
    >
      <!-- Project Steps (แสดงเฉพาะใน project pages) -->
      <ProjectSteps
        v-if="showProjectSteps"
        :project-id="currentProjectId"
      />

      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import ProjectSteps from '~/components/workflow/ProjectSteps.vue'

const { user, logout } = useAuth()
const router = useRouter()
const route = useRoute()
const toast = useToast()

// State - Sidebar เปิดโดย default
const sidebarOpen = ref(true)
const isMobile = ref(false)

// Computed - v2: ไม่แสดง ProjectSteps เลย (ใช้แต่ VersionSteps ระดับ version)
const showProjectSteps = computed(() => {
  // v2 architecture: No project-level step indicator, only version-level
  return false
})

// Computed - ดึง projectId จาก URL
const currentProjectId = computed(() => {
  const match = route.path.match(/^\/projects\/(\d+)/)
  return match ? match[1] : undefined
})

// Handle window resize
const handleResize = () => {
  if (process.client) {
    isMobile.value = window.innerWidth < 1024 // เพิ่ม breakpoint
    if (isMobile.value) {
      sidebarOpen.value = false
    } else {
      sidebarOpen.value = true
    }
  }
}

// Logout handler
const handleLogout = async () => {
  try {
    await logout()
    toast.success('ออกจากระบบเรียบร้อย')
    await router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
    toast.error('เกิดข้อผิดพลาดในการออกจากระบบ')
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize)
  }
})

// Watch for mobile changes
watch(isMobile, (newValue) => {
  if (newValue) {
    sidebarOpen.value = false
  } else {
    sidebarOpen.value = true
  }
})
</script>
