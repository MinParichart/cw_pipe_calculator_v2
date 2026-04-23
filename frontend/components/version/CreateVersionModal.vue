<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <Transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="show"
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              @click="close"
            ></div>
          </Transition>

          <!-- Modal panel -->
          <Transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="show"
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <!-- Header -->
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      class="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      สร้างเวอร์ชันใหม่
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        สร้างเวอร์ชันใหม่เพื่อเริ่มทำงานกับแบบที่แตกต่างกัน
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form -->
              <div class="px-4 pb-4 sm:px-6 sm:pb-4">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <!-- Version Name -->
                  <div>
                    <label for="version-name" class="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อเวอร์ชัน <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="version-name"
                      v-model="form.name"
                      type="text"
                      required
                      ref="nameInput"
                      placeholder="เช่น: แบบที่ 1, ทาวน์โฮม 2 ชั้น"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      :disabled="submitting"
                    />
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="version-description" class="block text-sm font-medium text-gray-700 mb-1">
                      รายละเอียด (ไม่บังคับ)
                    </label>
                    <textarea
                      id="version-description"
                      v-model="form.description"
                      rows="3"
                      placeholder="อธิบายเพิ่มเติมเกี่ยวกับเวอร์ชันนี้..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      :disabled="submitting"
                    ></textarea>
                  </div>

                  <!-- Info Box -->
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div class="flex">
                      <svg
                        class="h-5 w-5 text-blue-400 mr-2 flex-shrink-0"
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
                      <div class="text-xs text-blue-800">
                        <p class="font-medium mb-1">หลังจากสร้างเวอร์ชัน:</p>
                        <ul class="list-disc list-inside space-y-0.5 text-blue-700">
                          <li>จะไป Step 2: Documents เพื่อ upload plan แปลน</li>
                          <li>แต่ละเวอร์ชันมี network, fixtures, results เป็นของตัวเอง</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- Error Message -->
                  <div
                    v-if="error"
                    class="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <p class="text-sm text-red-800">{{ error }}</p>
                  </div>

                  <!-- Actions -->
                  <div class="flex flex-row-reverse gap-2 sm:gap-3">
                    <button
                      type="submit"
                      class="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="submitting || !form.name.trim()"
                    >
                      <span v-if="submitting">
                        <svg class="animate-spin inline-block h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังสร้าง...
                      </span>
                      <span v-else>สร้างเวอร์ชัน</span>
                    </button>
                    <button
                      type="button"
                      @click="close"
                      class="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                      :disabled="submitting"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useVersionStore } from '~/stores/versionStore'
import { onKeyStroke } from '@vueuse/core'

const props = defineProps<{
  show: boolean
  projectId: number
}>()

const emit = defineEmits<{
  close: []
  created: [versionId: number]
}>()

const toast = useToast()
const versionStore = useVersionStore()

// State
const form = ref({
  name: '',
  description: '',
})
const submitting = ref(false)
const error = ref('')
const nameInput = ref<HTMLInputElement>()

// Watch for modal open
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    // Reset form
    form.value = {
      name: '',
      description: '',
    }
    error.value = ''
    submitting.value = false

    // Focus on name input after transition
    nextTick(() => {
      setTimeout(() => {
        nameInput.value?.focus()
      }, 100)
    })
  }
})

const close = () => {
  if (!submitting.value) {
    emit('close')
  }
}

const handleSubmit = async () => {
  error.value = ''
  submitting.value = true

  try {
    const result = await versionStore.createVersion(props.projectId, {
      name: form.value.name,
      description: form.value.description || undefined,
    })

    if (result.success) {
      toast.success('สร้างเวอร์ชันสำเร็จแล้ว')
      emit('close')
      emit('created', result.data.id)
    } else {
      error.value = result.error?.message || 'สร้างเวอร์ชันไม่สำเร็จ'
    }
  } catch (err: any) {
    error.value = err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
  } finally {
    submitting.value = false
  }
}

// Close on ESC key
onKeyStroke('Escape', () => {
  close()
})
</script>
