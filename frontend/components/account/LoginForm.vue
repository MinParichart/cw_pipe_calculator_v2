<template>
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        เข้าสู่ระบบ
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        หรือ
        <NuxtLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
          สมัครสมาชิกใหม่
        </NuxtLink>
      </p>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div v-if="error" class="rounded-md bg-red-50 p-4 border border-red-200">
        <p class="text-sm text-red-800 font-bold">{{ error }}</p>
      </div>

      <div class="space-y-4">
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
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            รหัสผ่าน
          </label>
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="loading">กำลังเข้าสู่ระบบ...</span>
          <span v-else>เข้าสู่ระบบ</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const router = useRouter()
const toast = useToast()

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  const result = await login(form.value.email, form.value.password)

  if (result.success) {
    toast.success('เข้าสู่ระบบสำเร็จ')
    await router.push('/projects')
  } else {
    error.value = result.error?.message || 'เข้าสู่ระบบไม่สำเร็จ'
  }

  loading.value = false
}
</script>
