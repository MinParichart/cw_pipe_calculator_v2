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
          สมัครสมาชิกเพื่อเริ่มใช้งาน
        </p>
      </div>

      <!-- Register Form -->
      <div class="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <AccountRegisterForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import component directly to fix auto-import issue
import AccountRegisterForm from '~/components/account/RegisterForm.vue'

// DEBUG: ลบ useAuth() ชั่วคราวเพื่อแก้ปัญหา crash
// const { isAuthenticated } = useAuth()

// onMounted(() => {
//   if (isAuthenticated.value) {
//     navigateTo('/projects')
//   }
// })

// Define page meta for layout
definePageMeta({
  layout: 'auth',
})
</script>
