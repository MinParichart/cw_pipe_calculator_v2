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
      <div v-if="error" class="rounded-md bg-danger-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-danger-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-danger-800">
              {{ error }}
            </h3>
          </div>
        </div>
      </div>

      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="name" class="label">ชื่อ (ไม่บังคับ)</label>
          <input
            id="name"
            v-model="form.name"
            name="name"
            type="text"
            class="input rounded-t-md"
            placeholder="ชื่อของคุณ"
          />
        </div>
        <div>
          <label for="email-address" class="label">อีเมล</label>
          <input
            id="email-address"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="input"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label for="password" class="label">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</label>
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            minlength="6"
            class="input rounded-b-md"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">กำลังสมัครสมาชิก...</span>
          <span v-else>สมัครสมาชิก</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { register } = useAuth()
const router = useRouter()
const toast = useToast()

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

  const result = await register(form.value.email, form.value.password, form.value.name)

  if (result.success) {
    toast.success('สมัครสมาชิกสำเร็จ')
    await router.push('/projects')
  } else {
    error.value = result.error?.message || 'สมัครสมาชิกไม่สำเร็จ'
  }

  loading.value = false
}
</script>
