<template>
  <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6">
          <button
            @click="$router.back()"
            class="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            ย้อนกลับ
          </button>
          <h1 class="mt-4 text-3xl font-bold text-gray-900">
            สร้างโปรเจกต์ใหม่
          </h1>
        </div>

        <!-- Form -->
        <div class="bg-white shadow rounded-lg p-6">
          <form @submit.prevent="handleCreate" novalidate class="space-y-6">
            <!-- Project Name -->
            <div>
              <label for="name" class="label">
                ชื่อโปรเจกต์ <span class="text-danger-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="input"
                :class="{ 'border-danger-500': errors.name }"
                placeholder="เช่น บ้านพักอาศัย 2 ชั้น"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-danger-600">
                {{ errors.name }}
              </p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="label">
                รายละเอียด (ไม่บังคับ)
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="input"
                placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับโปรเจกต์..."
              />
            </div>

            <!-- Building Type -->
            <div>
              <label class="label">
                ประเภทอาคาร <span class="text-danger-500">*</span>
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label
                  v-for="type in buildingTypes"
                  :key="type.value"
                  class="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  :class="{
                    'border-primary-500 bg-primary-50': form.buildingType === type.value,
                    'border-danger-500': errors.buildingType && form.buildingType !== type.value,
                    'border-gray-300': !errors.buildingType && form.buildingType !== type.value
                  }"
                >
                  <input
                    v-model="form.buildingType"
                    type="radio"
                    :value="type.value"
                    class="sr-only"
                  />
                  <div class="flex items-center">
                    <svg class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span class="ml-2 text-sm font-medium text-gray-900">
                      {{ type.label }}
                    </span>
                  </div>
                </label>
              </div>
              <p v-if="errors.buildingType" class="mt-1 text-sm text-danger-600">
                {{ errors.buildingType }}
              </p>
            </div>

            <!-- Number of Floors -->
            <div>
              <label for="floors" class="label">
                จำนวนชั้น <span class="text-danger-500">*</span>
              </label>
              <input
                id="floors"
                v-model="form.floors"
                type="text"
                class="input"
                :class="{ 'border-danger-500': errors.floors }"
                placeholder="1"
              />
              <p v-if="errors.floors" class="mt-1 text-sm text-danger-600">
                {{ errors.floors }}
              </p>
              <p class="mt-1 text-sm text-gray-500">
                ระบบรองรับสูงสุด 2 ชั้น
              </p>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                @click="$router.back()"
                class="btn btn-secondary"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="btn btn-primary"
              >
                <span v-if="loading">กำลังสร้าง...</span>
                <span v-else>สร้างโปรเจกต์</span>
              </button>
            </div>
          </form>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { projectsApi } from '~/composables/useApi'

const router = useRouter()
const toast = useToast()

const form = ref({
  name: '',
  description: '',
  buildingType: 'APARTMENT' as 'APARTMENT' | 'OFFICE' | 'HOSPITAL' | 'SCHOOL' | 'HOTEL',
  floors: '1',
})

const loading = ref(false)
const errors = ref<{
  name?: string
  buildingType?: string
  floors?: string
}>({})

const buildingTypes = [
  { value: 'APARTMENT', label: 'ที่พักอาศัย' },
  { value: 'OFFICE', label: 'สำนักงาน' },
  { value: 'HOSPITAL', label: 'โรงพยาบาล' },
  { value: 'SCHOOL', label: 'โรงเรียน' },
  { value: 'HOTEL', label: 'โรงแรม' },
]

const validateForm = (): boolean => {
  let isValid = true
  errors.value = {}

  // A1: Project Name ว่าง
  if (!form.value.name || form.value.name.trim() === '') {
    errors.value.name = 'กรุณากรอกชื่อโปรเจกต์'
    isValid = false
  }

  // Validate Building Type
  if (!form.value.buildingType) {
    errors.value.buildingType = 'กรุณาเลือกประเภทอาคาร'
    isValid = false
  }

  // Validate Floors (ต้องอยู่ในช่วง 1-2)
  const floorsNum = parseInt(form.value.floors)
  if (!form.value.floors || isNaN(floorsNum) || floorsNum < 1 || floorsNum > 2) {
    errors.value.floors = 'กรุณาระบุจำนวนชั้น (1-2)'
    isValid = false
  }

  return isValid
}

const handleCreate = async () => {
  // Validate form
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    console.log('Creating project with data:', form.value)

    const newProject = await projectsApi.create({
      name: form.value.name,
      description: form.value.description,
      criteria: {
        buildingType: form.value.buildingType,
      },
      floors: parseInt(form.value.floors),
    })

    console.log('Project created successfully:', newProject)

    toast.success('สร้างโปรเจกต์สำเร็จ')

    // Navigate to project detail page
    if (newProject?.id) {
      await router.push(`/projects/${newProject.id}`)
    } else {
      console.error('Invalid response:', newProject)
      toast.error('รับข้อมูลโปรเจกต์ไม่ถูกต้อง')
      await router.push('/projects')
    }
  } catch (error: any) {
    console.error('Create project error:', error)

    // Show more detailed error
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      toast.error('กรุณา Login ก่อนสร้างโปรเจกต์')
      setTimeout(() => router.push('/'), 2000)
    } else {
      toast.error(error.message || 'สร้างโปรเจกต์ล้มเหลือ')
    }
  } finally {
    loading.value = false
  }
}

// Define page meta for layout
definePageMeta({
  layout: 'dashboard',
})
</script>
