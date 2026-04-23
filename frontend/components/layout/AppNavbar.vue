<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo & Title -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <svg class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span class="ml-2 text-xl font-bold text-gray-900">
              CW Pipe Calculator
            </span>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex md:items-center md:space-x-4">
          <NuxtLink
            to="/"
            class="nav-link"
            :class="{ 'text-blue-600 font-medium': route.path === '/' }"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="ml-1">หน้าแรก</span>
          </NuxtLink>

          <NuxtLink
            to="/dashboard"
            class="nav-link"
            :class="{ 'text-blue-600 font-medium': isActive('/dashboard') }"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span class="ml-1">Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/projects"
            class="nav-link"
            :class="{ 'text-blue-600 font-medium': isActive('/projects') }"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span class="ml-1">โปรเจกต์</span>
          </NuxtLink>

          <NuxtLink
            to="/calculator"
            class="nav-link"
            :class="{ 'text-blue-600 font-medium': isActive('/calculator') }"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span class="ml-1">คำนวณ</span>
          </NuxtLink>

          <NuxtLink
            to="/reference"
            class="nav-link"
            :class="{ 'text-blue-600 font-medium': isActive('/reference') }"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span class="ml-1">ตารางอ้างอิง</span>
          </NuxtLink>

          <NuxtLink
            to="/settings"
            class="nav-link"
            :class="{ 'text-blue-600 font-medium': isActive('/settings') }"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="ml-1">ตั้งค่า</span>
          </NuxtLink>

          <!-- User Menu -->
          <div class="flex items-center ml-4 pl-4 border-l">
            <NuxtLink
              to="/profile"
              class="nav-link"
              :class="{ 'text-blue-600 font-medium': isActive('/profile') }"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="ml-1">โปรไฟล์</span>
            </NuxtLink>

            <button
              @click="handleLogout"
              class="nav-link text-red-600 hover:text-red-700"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="ml-1">ออกจากระบบ</span>
            </button>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            <span class="sr-only">เปิดเมนู</span>
            <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <NuxtLink
          to="/"
          class="nav-link-mobile"
          :class="{ 'bg-blue-600 bg-opacity-10 text-primary': route.path === '/' }"
          @click="mobileMenuOpen = false"
        >
          หน้าแรก
        </NuxtLink>
        <NuxtLink
          to="/dashboard"
          class="nav-link-mobile"
          :class="{ 'bg-blue-600 bg-opacity-10 text-primary': isActive('/dashboard') }"
          @click="mobileMenuOpen = false"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="nav-link-mobile"
          :class="{ 'bg-blue-600 bg-opacity-10 text-primary': isActive('/projects') }"
          @click="mobileMenuOpen = false"
        >
          โปรเจกต์
        </NuxtLink>
        <NuxtLink
          to="/calculator"
          class="nav-link-mobile"
          :class="{ 'bg-blue-600 bg-opacity-10 text-primary': isActive('/calculator') }"
          @click="mobileMenuOpen = false"
        >
          คำนวณ
        </NuxtLink>
        <NuxtLink
          to="/reference"
          class="nav-link-mobile"
          :class="{ 'bg-blue-600 bg-opacity-10 text-primary': isActive('/reference') }"
          @click="mobileMenuOpen = false"
        >
          ตารางอ้างอิง
        </NuxtLink>
        <NuxtLink
          to="/settings"
          class="nav-link-mobile"
          :class="{ 'bg-blue-600 bg-opacity-10 text-primary': isActive('/settings') }"
          @click="mobileMenuOpen = false"
        >
          ตั้งค่า
        </NuxtLink>
        <NuxtLink
          to="/profile"
          class="nav-link-mobile"
          :class="{ 'bg-blue-600 bg-opacity-10 text-primary': isActive('/profile') }"
          @click="mobileMenuOpen = false"
        >
          โปรไฟล์
        </NuxtLink>
        <button
          @click="handleLogout"
          class="nav-link-mobile w-full text-left text-red-600 hover:bg-red-50"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const router = useRouter()
const route = useRoute()

const mobileMenuOpen = ref(false)

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await logout()
  await router.push('/')
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors;
}

.nav-link-mobile {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors;
}
</style>
