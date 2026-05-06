<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">UI Component Preview</h1>
        <p class="text-sm text-gray-600 mt-1">ดูตัวอย่าง UI Components ใหม่ทั้งหมด</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Step Indicator -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Step Indicator</h2>

        <div class="bg-white rounded-lg shadow-md p-6">
          <StepIndicator
            :steps="steps"
            :current-step="currentStep"
            :clickable="true"
            @step-click="handleStepClick"
          />

          <div class="flex items-center justify-between mt-8 gap-4">
            <button
              @click="previousStep"
              :disabled="isFirstStep"
              class="px-6 py-2 bg-transparent text-primary-500 border-2 border-primary-500 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Previous
            </button>

            <button
              v-if="!isLastStep"
              @click="nextStep"
              class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors"
            >
              Next
            </button>

            <button
              v-else
              @click="resetSteps"
              class="px-6 py-3 bg-success-500 text-white rounded-lg hover:bg-success-600 font-medium transition-colors"
            >
              Reset
            </button>
          </div>

          <div class="flex items-center justify-center mt-4 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-700">
              <strong>Current Step:</strong> {{ currentStep + 1 }} / {{ steps.length }}
              <span class="mx-2">•</span>
              <strong>Progress:</strong> {{ Math.round(progressPercentage) }}%
            </p>
          </div>
        </div>
      </section>

      <!-- Buttons -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Buttons</h2>

        <div class="bg-white rounded-lg shadow-md p-6">
          <!-- Primary Buttons -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Primary Buttons</h3>

            <div class="flex flex-wrap gap-4">
              <button class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium transition-colors">
                Small Primary
              </button>

              <button class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-base font-medium transition-colors">
                Medium Primary
              </button>

              <button class="px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-lg font-medium transition-colors">
                Large Primary
              </button>

              <button class="px-6 py-3 bg-primary-500 text-white rounded-lg text-base font-medium opacity-50 cursor-not-allowed">
                Loading...
              </button>

              <button class="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg text-base font-medium cursor-not-allowed">
                Disabled
              </button>
            </div>
          </div>

          <!-- Secondary Buttons -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Secondary Buttons</h3>

            <div class="flex flex-wrap gap-4">
              <button class="px-4 py-2 bg-transparent text-primary-500 border-2 border-primary-500 rounded-lg hover:bg-primary-50 text-sm font-medium transition-colors">
                Small Secondary
              </button>

              <button class="px-6 py-3 bg-transparent text-primary-500 border-2 border-primary-500 rounded-lg hover:bg-primary-50 text-base font-medium transition-colors">
                Medium Secondary
              </button>

              <button class="px-8 py-4 bg-transparent text-primary-500 border-2 border-primary-500 rounded-lg hover:bg-primary-50 text-lg font-medium transition-colors">
                Large Secondary
              </button>

              <button class="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg text-base font-medium cursor-not-allowed">
                Disabled
              </button>
            </div>
          </div>

          <!-- Buttons with Icons -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Buttons with Icons</h3>

            <div class="flex flex-wrap gap-4">
              <button class="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-base font-medium transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add New
              </button>

              <button class="inline-flex items-center px-6 py-3 bg-transparent text-primary-500 border-2 border-primary-500 rounded-lg hover:bg-primary-50 text-base font-medium transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Cards -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Cards</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Default Card -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Default Card</h3>
            <div class="bg-white rounded-lg shadow-md p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Card Title</h4>
              <p class="text-sm text-gray-600 mb-4">
                This is a default card with shadow and padding. Perfect for grouping related content.
              </p>
              <button class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium">
                Action
              </button>
            </div>
          </div>

          <!-- Card with Header -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Card with Header</h3>
            <div class="bg-white rounded-lg shadow-md">
              <div class="border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">Header Card</h4>
                  <p class="text-sm text-gray-500">With subtitle</p>
                </div>
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
              <div class="p-6">
                <p class="text-sm text-gray-600">
                  Card with header section for title and actions.
                </p>
              </div>
            </div>
          </div>

          <!-- Hoverable Card -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Hoverable Card</h3>
            <div class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-1">Click Me</h4>
                  <p class="text-sm text-gray-600">
                    Hover this card to see shadow effect. Great for clickable items.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Clickable Card with Border -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Selected State</h3>
            <div class="bg-white rounded-lg shadow-md p-6 cursor-pointer border-2 border-blue-500 bg-blue-50">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-blue-900 mb-1">Selected Item</h4>
                  <p class="text-sm text-blue-700">
                    Card with selected state styling. Used for active items.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Form Inputs -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Form Inputs</h2>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Text Input -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Text Input</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อโปรเจกต์
                  </label>
                  <input
                    type="text"
                    placeholder="ระบุชื่อโปรเจกต์..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    ตัวอย่าง helper text สำหรับคำอธิบาย
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    เลือกชั้น <span class="text-red-500">*</span>
                  </label>
                  <select
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">เลือกชั้น...</option>
                    <option value="1">ชั้น 1</option>
                    <option value="2">ชั้น 2</option>
                    <option value="3">ชั้น 3</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">
                    เลือกชั้นที่ต้องการออกแบบ
                  </p>
                </div>
              </div>
            </div>

            <!-- Input States -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Input States</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Error State
                  </label>
                  <input
                    type="text"
                    value="Invalid value"
                    class="w-full px-4 py-2 border-2 border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                  <p class="text-xs text-red-600 mt-1">
                    ⚠️ ค่าที่ระบุไม่ถูกต้อง
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Disabled State
                  </label>
                  <input
                    type="text"
                    value="Cannot edit"
                    disabled
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Textarea
                  </label>
                  <textarea
                    rows="3"
                    placeholder="ระบุรายละเอียดเพิ่มเติม..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Alerts -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Alerts & Notifications</h2>

        <div class="space-y-4">
          <!-- Success Alert -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <svg class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-green-900">
                  บันทึกเรียบร้อยแล้ว
                </p>
                <p class="text-xs text-green-700 mt-1">
                  ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว
                </p>
              </div>
            </div>
          </div>

          <!-- Warning Alert -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <svg class="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-yellow-900">
                  พบข้อมูลซ้ำ
                </p>
                <p class="text-xs text-yellow-700 mt-1">
                  มี Blueprint อยู่แล้วในชั้นนี้ ต้องการลบเดิมและอัปโหลดใหม่หรือไม่?
                </p>
              </div>
              <div class="flex gap-2">
                <button class="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700">
                  ลบเดิม
                </button>
                <button class="px-3 py-1 border border-yellow-600 text-yellow-700 rounded text-xs hover:bg-yellow-50">
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>

          <!-- Error Alert -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <svg class="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-red-900">
                  อัปโหลดไม่สำเร็จ
                </p>
                <p class="text-xs text-red-700 mt-1">
                  ขนาดไฟล์ต้องไม่เกิน 10MB และรองรับเฉพาะไฟล์ PNG, JPG เท่านั้น
                </p>
              </div>
            </div>
          </div>

          <!-- Info Alert -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <svg class="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-blue-900">
                  ข้อแนะนำ
                </p>
                <p class="text-xs text-blue-700 mt-1">
                  แนะนำให้อัปโหลด Blueprint ความละเอียดสูงเพื่อผลลัพธ์ที่ดีที่สุด
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Form Layout Example -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Complete Form Layout</h2>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="border-b pb-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-900">อัปโหลด Blueprint</h3>
            <p class="text-sm text-gray-600 mt-1">ระบุข้อมูลและอัปโหลดไฟล์ Blueprint</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ชั้น <span class="text-red-500">*</span>
              </label>
              <select
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">เลือกชั้น...</option>
                <option value="roof">ดาดฟ้า (Roof)</option>
                <option value="2">ชั้น 2</option>
                <option value="1">ชั้น 1</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">เลือกชั้นที่ต้องการอัปโหลดแปลน</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ประเภทแปลน
              </label>
              <select
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="floor_plan">Floor Plan (แปลนชั้น)</option>
                <option value="elevation">Elevation (ด้านข้าง)</option>
                <option value="section">Section (ตัดแบบ)</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">เลือกประเภทของแปลน</p>
            </div>
          </div>

          <!-- Upload Area -->
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors mb-6"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mt-2 text-sm text-gray-600">
              <span class="font-medium text-blue-600">คลิกเพื่ออัปโหลด</span>
              หรือลากไฟล์มาวาง
            </p>
            <p class="mt-1 text-xs text-gray-500">
              รองรับไฟล์ PNG, JPG สูงสุด 10MB
            </p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              หมายเหตุ
            </label>
            <textarea
              rows="3"
              placeholder="ระบุรายละเอียดเพิ่มเติม..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              class="px-6 py-2 bg-transparent text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
            >
              ยกเลิก
            </button>
            <button
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              บันทึก Blueprint
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StepIndicator from '~/components/ui/StepIndicator.vue'

// Step Indicator
const currentStep = ref(0)
const steps = [
  { title: 'Upload', description: 'อัปโหลด Blueprint' },
  { title: 'Network', description: 'วาดท่อ' },
  { title: 'Fixtures', description: 'เพิ่มอุปกรณ์' },
  { title: 'Calculate', description: 'คำนวณ' },
  { title: 'Results', description: 'ดูผลลัพธ์' }
]

const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === steps.length - 1)
const progressPercentage = computed(() => {
  if (steps.length === 0) return 0
  return ((currentStep.value + 1) / steps.length) * 100
})

const handleStepClick = (stepIndex) => {
  currentStep.value = stepIndex
}

const nextStep = () => {
  if (!isLastStep.value) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (!isFirstStep.value) {
    currentStep.value--
  }
}

const resetSteps = () => {
  currentStep.value = 0
}
</script>
