<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
  >
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center">
        <svg
          class="mx-auto h-16 w-16 text-primary-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v18M8 7h8M8 12h8M8 17h8"
          />
        </svg>
        <h1 class="mt-6 text-4xl font-bold text-gray-900">
          CW Pipe Calculator
        </h1>
        <p class="mt-2 text-lg text-gray-600">ลงทะเบียนเพื่อเริ่มใช้งาน</p>
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
import AccountRegisterForm from "~/components/account/RegisterForm.vue";

// DEBUG: ลบ useAuth() ชั่วคราวเพื่อแก้ปัญหา crash
// const { isAuthenticated } = useAuth()

// onMounted(() => {
//   if (isAuthenticated.value) {
//     navigateTo('/projects')
//   }
// })

// Define page meta for layout
definePageMeta({
  layout: "auth"
});
</script>
