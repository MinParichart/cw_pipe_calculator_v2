<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">โปรไฟล์</h1>
          <p class="mt-1 text-sm text-gray-600">
            จัดการข้อมูลส่วนตัวและตั้งค่าบัญชีของคุณ
          </p>
        </div>

        <div class="space-y-6">
          <!-- Profile Overview -->
          <div class="card">
            <div class="flex items-center space-x-6">
              <div class="flex-shrink-0">
                <div class="h-20 w-20 rounded-full bg-blue-600 bg-opacity-10 flex items-center justify-center">
                  <span class="text-2xl font-bold text-blue-600">
                    {{ userInitials }}
                  </span>
                </div>
              </div>
              <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-900">
                  {{ user.name || 'ผู้ใช้' }}
                </h2>
                <p class="text-sm text-gray-600">{{ user.email }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  สมาชิกตั้งแต่ {{ formatDate(user.createdAt) }}
                </p>
              </div>
              <button
                @click="editing = !editing"
                class="btn btn-secondary"
              >
                {{ editing ? 'ยกเลิก' : 'แก้ไขโปรไฟล์' }}
              </button>
            </div>
          </div>

          <!-- Usage Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="card text-center">
              <div class="text-3xl font-bold text-blue-600">{{ stats.projects }}</div>
              <div class="text-sm text-gray-600 mt-1">โปรเจกต์</div>
            </div>
            <div class="card text-center">
              <div class="text-3xl font-bold text-blue-600">{{ stats.calculations }}</div>
              <div class="text-sm text-gray-600 mt-1">การคำนวณ</div>
            </div>
            <div class="card text-center">
              <div class="text-3xl font-bold text-blue-600">{{ stats.versions }}</div>
              <div class="text-sm text-gray-600 mt-1">เวอร์ชันที่บันทึก</div>
            </div>
          </div>

          <!-- Edit Profile Form -->
          <div v-if="editing" class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">แก้ไขข้อมูลส่วนตัว</h3>
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="ชื่อของคุณ"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="your@email.com"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="08x-xxx-xxxx"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  บริษัท/องค์กร
                </label>
                <input
                  v-model="form.organization"
                  type="text"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="ชื่อบริษัท"
                >
              </div>
              <div class="flex gap-4">
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 btn btn-primary"
                >
                  <span v-if="saving">กำลังบันทึก...</span>
                  <span v-else>บันทึกการเปลี่ยนแปลง</span>
                </button>
                <button
                  type="button"
                  @click="editing = false"
                  class="btn btn-secondary"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>

          <!-- Change Password -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">เปลี่ยนรหัสผ่าน</h3>
              <button
                v-if="!changingPassword"
                @click="changingPassword = true"
                class="text-sm text-primary hover:text-primary-dark"
              >
                เปลี่ยนรหัสผ่าน
              </button>
            </div>

            <form v-if="changingPassword" @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  รหัสผ่านปัจจุบัน
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="••••••••"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  รหัสผ่านใหม่
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="8"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  minlength="8"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="••••••••"
                >
                <p v-if="passwordError" class="text-sm text-red-600 mt-1">
                  {{ passwordError }}
                </p>
              </div>
              <div class="flex gap-4">
                <button
                  type="submit"
                  :disabled="savingPassword"
                  class="flex-1 btn btn-primary"
                >
                  <span v-if="savingPassword">กำลังบันทึก...</span>
                  <span v-else>เปลี่ยนรหัสผ่าน</span>
                </button>
                <button
                  type="button"
                  @click="cancelChangePassword"
                  class="btn btn-secondary"
                >
                  ยกเลิก
                </button>
              </div>
            </form>

            <div v-else class="flex items-center justify-center py-4">
              <div class="text-center">
                <svg class="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p class="text-sm text-gray-600">คลิกเพื่อเปลี่ยนรหัสผ่าน</p>
              </div>
            </div>
          </div>

          <!-- Account Settings -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">ตั้งค่าบัญชี</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 border-b">
                <div>
                  <p class="text-sm font-medium text-gray-900">การแจ้งเตือนทางอีเมล</p>
                  <p class="text-xs text-gray-500">รับข่าวสารและอัปเดตเกี่ยวกับระบบ</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="accountSettings.emailNotifications"
                    type="checkbox"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between py-3 border-b">
                <div>
                  <p class="text-sm font-medium text-gray-900">โหมดเซสชันคงอยู่</p>
                  <p class="text-xs text-gray-500">ไม่ต้องล็อกอินใหม่ทุกครั้ง</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="accountSettings.rememberSession"
                    type="checkbox"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between py-3">
                <div>
                  <p class="text-sm font-medium text-gray-900">การยืนยัน 2 ขั้นตอน</p>
                  <p class="text-xs text-gray-500">เพิ่มความปลอดภัยให้บัญชีของคุณ</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="accountSettings.twoFactorAuth"
                    type="checkbox"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="card border-red-200">
            <h3 class="text-lg font-medium text-red-900 mb-4">โซนอันตราย</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 border-b border-red-200">
                <div>
                  <p class="text-sm font-medium text-red-900">ลบข้อมูลทั้งหมด</p>
                  <p class="text-xs text-red-600">ลบโปรเจกต์ การคำนวณ และข้อมูลทั้งหมด</p>
                </div>
                <button
                  @click="confirmDeleteAllData"
                  class="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  ลบข้อมูล
                </button>
              </div>

              <div class="flex items-center justify-between py-3">
                <div>
                  <p class="text-sm font-medium text-red-900">ลบบัญชี</p>
                  <p class="text-xs text-red-600">ลบบัญชีและข้อมูลทั้งหมดถาวร</p>
                </div>
                <button
                  @click="confirmDeleteAccount"
                  class="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  ลบบัญชี
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const router = useRouter()

// State
const editing = ref(false)
const changingPassword = ref(false)
const saving = ref(false)
const savingPassword = ref(false)
const passwordError = ref('')

const user = ref({
  name: 'ผู้ใช้ทดสอบ',
  email: 'test@example.com',
  phone: '',
  organization: '',
  createdAt: '2024-01-01T00:00:00Z',
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  organization: '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const stats = ref({
  projects: 0,
  calculations: 0,
  versions: 0,
})

const accountSettings = ref({
  emailNotifications: true,
  rememberSession: true,
  twoFactorAuth: false,
})

// Computed
const userInitials = computed(() => {
  if (!user.value.name) return 'U'
  return user.value.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
  })
}

const loadProfile = async () => {
  try {
    // TODO: Load from API
    // user.value = await authApi.getProfile()
    form.value = {
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone,
      organization: user.value.organization,
    }

    // Load stats
    // stats.value = await usersApi.getStats()
    stats.value = {
      projects: 5,
      calculations: 23,
      versions: 12,
    }
  } catch (error: any) {
    console.error('Failed to load profile:', error)
  }
}

const updateProfile = async () => {
  saving.value = true

  try {
    // TODO: Update via API
    // await authApi.updateProfile(form.value)
    await new Promise(resolve => setTimeout(resolve, 500))

    user.value = {
      ...user.value,
      ...form.value,
    }

    editing.value = false
    toast.success('อัปเดตโปรไฟล์เรียบร้อย')
  } catch (error: any) {
    toast.error(error.message || 'Failed to update profile')
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  // Validate passwords
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'รหัสผ่านไม่ตรงกัน'
    return
  }

  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
    return
  }

  passwordError.value = ''
  savingPassword.value = true

  try {
    // TODO: Change password via API
    // await authApi.changePassword(passwordForm.value)
    await new Promise(resolve => setTimeout(resolve, 500))

    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    changingPassword.value = false
    toast.success('เปลี่ยนรหัสผ่านเรียบร้อย')
  } catch (error: any) {
    toast.error(error.message || 'Failed to change password')
  } finally {
    savingPassword.value = false
  }
}

const cancelChangePassword = () => {
  changingPassword.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  passwordError.value = ''
}

const confirmDeleteAllData = () => {
  if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
    deleteAllData()
  }
}

const deleteAllData = async () => {
  try {
    // TODO: Delete all data via API
    // await usersApi.deleteAllData()
    await new Promise(resolve => setTimeout(resolve, 500))

    stats.value = {
      projects: 0,
      calculations: 0,
      versions: 0,
    }

    toast.success('ลบข้อมูลทั้งหมดเรียบร้อย')
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete data')
  }
}

const confirmDeleteAccount = () => {
  if (confirm('คุณแน่ใจหรือไม่ที่จะลบบัญชี? การกระทำนี้ไม่สามารถย้อนกลับได้และข้อมูลทั้งหมดจะหายไป')) {
    deleteAccount()
  }
}

const deleteAccount = async () => {
  try {
    // TODO: Delete account via API
    // await authApi.deleteAccount()
    await new Promise(resolve => setTimeout(resolve, 500))

    toast.success('ลบบัญชีเรียบร้อย')
    router.push('/login')
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete account')
  }
}

// Load profile on mount
onMounted(() => {
  loadProfile()
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard',
})
</script>
