<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="$router.back()"
          class="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg
            class="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          กลับ
        </button>

        <h1 class="text-3xl font-bold text-gray-900">
          สร้างเวอร์ชันใหม่
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          สร้าง snapshot ของ network ปัจจุบันเพื่อเก็บไว้เป็นเวอร์ชันใหม่
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Version Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อเวอร์ชัน <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="เช่น: แบบที่ 1, ทาวน์โฮม 2 ชั้น"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :disabled="submitting"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียด (ไม่บังความ)
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="อธิบายเพิ่มเติมเกี่ยวกับเวอร์ชันนี้..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :disabled="submitting"
            />
          </div>

          <!-- Info Box -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex">
              <svg
                class="h-5 w-5 text-blue-400 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div class="text-sm text-blue-800">
                <p class="font-medium mb-1">สิ่งที่จะถูกบันทึก:</p>
                <ul class="list-disc list-inside text-xs space-y-1 text-blue-700 ml-4">
                  <li>Network diagram ปัจจุบัน</li>
                  <li>Fixtures ทั้งหมด</li>
                  <li>Calculation results</li>
                  <li>Design criteria (ใช้ร่วมกันทุก version)</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="$router.back()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              :disabled="submitting"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="submitting || !form.name.trim()"
            >
              <span v-if="submitting">กำลังบันทึก...</span>
              <span v-else>สร้างเวอร์ชัน</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVersionStore } from '~/stores/versionStore'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const versionStore = useVersionStore()

// State
const form = ref({
  name: '',
  description: '',
})
const submitting = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  submitting.value = true

  try {
    const projectId = parseInt(route.params.id as string)

    const result = await versionStore.createVersion(projectId, {
      name: form.value.name,
      description: form.value.description || undefined,
    })

    if (result.success) {
      toast.success('สร้างเวอร์ชันสำเร็จแล้ว')
      // Navigate back to versions list
      router.push(`/projects/${route.params.id}/versions`)
    } else {
      error.value = result.error?.message || 'สร้างเวอร์ชันไม่สำเร็จ'
    }
  } catch (err: any) {
    error.value = err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
  } finally {
    submitting.value = false
  }
}

// Define page meta for layout
definePageMeta({
  layout: 'dashboard'
})
</script>
