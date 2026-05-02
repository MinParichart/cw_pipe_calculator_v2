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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { projectsApi, versionsApi, authApi } from '~/composables/useApi'

const toast = useToast()
const router = useRouter()
const { user: authUser } = useAuth()

// State
const editing = ref(false)
const changingPassword = ref(false)
const saving = ref(false)
const savingPassword = ref(false)
const passwordError = ref('')

// User data from useAuth with fallback
const user = computed(() => {
  if (!authUser.value) {
    return {
      name: 'ผู้ใช้ทดสอบ',
      email: 'test@example.com',
      phone: '',
      organization: '',
      createdAt: '2024-01-01T00:00:00Z',
    }
  }

  return {
    name: authUser.value.name || authUser.value.email || 'ผู้ใช้',
    email: authUser.value.email || 'test@example.com',
    phone: authUser.value.phone || '',
    organization: authUser.value.organization || '',
    createdAt: authUser.value.createdAt || '2024-01-01T00:00:00Z',
  }
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
    // Initialize form with current user data
    form.value = {
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone,
      organization: user.value.organization,
    }

    // Load actual stats from API
    const projects = await projectsApi.list()

    // Count versions and calculations across all projects
    let totalVersions = 0
    let totalCalculations = 0

    for (const project of projects) {
      const versions = await versionsApi.list(project.id)
      totalVersions += versions.length

      // Count versions that have calculation results
      totalCalculations += versions.filter(v => v.snapshotResults).length
    }

    stats.value = {
      projects: projects.length,
      calculations: totalCalculations,
      versions: totalVersions,
    }
  } catch (error: any) {
    console.error('Failed to load profile:', error)
    // Set default values on error
    stats.value = {
      projects: 0,
      calculations: 0,
      versions: 0,
    }
  }
}

const updateProfile = async () => {
  saving.value = true

  try {
    // TODO: Update via API (ไม่ส่ง email และ name ไป update)
    // await authApi.updateProfile({
    //   phone: form.value.phone,
    //   organization: form.value.organization
    // })
    await new Promise(resolve => setTimeout(resolve, 500))

    user.value = {
      ...user.value,
      phone: form.value.phone,
      organization: form.value.organization,
      // email, name: เก็บค่าเดิม ไม่อัปเดต
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
    // เรียก API จริงเปลี่ยนรหัสผ่าน
    await authApi.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )

    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    changingPassword.value = false
    toast.success('เปลี่ยนรหัสผ่านเรียบร้อย')
  } catch (error: any) {
    toast.error(error.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้')
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

// Load profile on mount
onMounted(() => {
  loadProfile()
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard',
})
</script>
