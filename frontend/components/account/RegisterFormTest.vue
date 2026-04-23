<template>
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        สมัครสมาชิกใหม่
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        หรือ
        <NuxtLink to="/" class="font-medium text-primary-600 hover:text-primary-500">
          เข้าสู่ระบบ
        </NuxtLink>
      </p>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>

      <div class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            ชื่อ (ไม่บังคับ)
          </label>
          <input
            id="name"
            v-model="form.name"
            name="name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="ชื่อของคุณ"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            อีเมล
          </label>
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
          </label>
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <span v-if="loading">กำลังสมัครสมาชิก...</span>
          <span v-else>สมัครสมาชิก</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
// Simple version without useAuth for testing
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  // Simple redirect for testing
  setTimeout(() => {
    loading.value = false
    router.push('/projects')
  }, 500)
}
</script>
