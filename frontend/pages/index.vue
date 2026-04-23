<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center">
        <svg class="mx-auto h-16 w-16 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <h1 class="mt-6 text-4xl font-bold text-gray-900">
          CW Pipe Calculator
        </h1>
        <p class="mt-2 text-lg text-gray-600">
          ระบบคำนวณขนาดท่อน้ำดีสำหรับที่พักอาศัย
        </p>
      </div>

      <!-- Login Form -->
      <div class="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <AccountLoginForm />
      </div>

      <!-- Features -->
      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900 text-center">
            คำนวณอัตโนมัติ
          </h3>
          <p class="mt-2 text-sm text-gray-500 text-center">
            Hunter's Curve + Hazen-Williams
          </p>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="flex items-center justify-center h-12 w-12 rounded-md bg-success-500 text-white">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900 text-center">
            Visual Builder
          </h3>
          <p class="mt-2 text-sm text-gray-500 text-center">
            ลากวาด Node และท่อได้ง่าย
          </p>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="flex items-center justify-center h-12 w-12 rounded-md bg-warning-500 text-white">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900 text-center">
            ประหยัดเวลา
          </h3>
          <p class="mt-2 text-sm text-gray-500 text-center">
            คำนวณผลในไม่กี่วินาที
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Redirect if already authenticated
const { isAuthenticated } = useAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/projects')
  }
})

// Define page meta for layout
definePageMeta({
  layout: 'auth',
})
</script>
