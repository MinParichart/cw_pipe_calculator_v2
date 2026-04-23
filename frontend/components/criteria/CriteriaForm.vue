<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '../../stores/projectStore'

const props = defineProps<{
  criteria?: any
  projectId?: number
}>()

const emit = defineEmits<{
  submit: [criteria: any]
  cancel: []
}>()

const projectStore = useProjectStore()

const form = ref({
  curveMode: 'HUNTER', // ล็อคเป็น Hunter Curve เสมอ
  demandMode: props.criteria?.demandMode || 'FLUSH_TANK',
  minorLossFactor: props.criteria?.minorLossFactor || 15,
  cFactor: props.criteria?.cFactor || 150,
  pvcClass: props.criteria?.pvcClass || 7, // Default PVC Class เป็น 7
  // Critical Endpoint ระบุอัตโนมัติ - ไม่ต้อง input
})

const cFactorOptions = [
  { value: 150, label: 'PVC (150)', desc: 'ท่อ PVC ทั่วไป - มาตรฐานสำหรับท่อน้ำดี' },
  { value: 130, label: 'Copper (130)', desc: 'ท่อทองแดง - ทนทานต่อน้ำร้อน/เย็น' },
  { value: 100, label: 'Steel (Galvanized) (100)', desc: 'ท่อเหล็กชุบสังกะสี - แข็งแรง' },
  { value: 150, label: 'CPVC (150)', desc: 'ท่อ CPVC - สำหรับน้ำร้อน' },
  { value: 150, label: 'PEX (150)', desc: 'ท่อ PEX - ยืดหยุ่นสูง' },
]

const demandModeOptions = [
  { value: 'FLUSH_TANK', label: 'Flush Tank Only' },
  { value: 'FLUSH_VALVE', label: 'Flush Valve Only' },
  { value: 'MIXED', label: 'Flush Tank + Flush Valve' },
]

const pvcClassOptions = [
  { value: 5, label: 'PVC 5 (5 bar)', desc: 'ท่อ PVC ชั้นคุณภาพ 5 (ความดัน 5 bar)' },
  { value: 7, label: 'PVC 7 (7 bar)', desc: 'ท่อ PVC ชั้นคุณภาพ 7 (ความดัน 7 bar)' },
  { value: 8.5, label: 'PVC 8.5 (8.5 bar)', desc: 'ท่อ PVC ชั้นคุณภาพ 8.5 (ความดัน 8.5 bar)' },
  { value: 10.5, label: 'PVC 10.5 (10.5 bar)', desc: 'ท่อ PVC ชั้นคุณภาพ 10.5 (ความดัน 10.5 bar)' },
  { value: 13.5, label: 'PVC 13.5 (13.5 bar)', desc: 'ท่อ PVC ชั้นคุณภาพ 13.5 (ความดัน 13.5 bar)' },
]

// ตรวจสอบว่าเลือกท่อ PVC หรือไม่ (cFactor = 150)
const isPVC = computed(() => form.value.cFactor === 150)

const handleSubmit = () => {
  const formData = {
    ...form.value,
    criticalEndpoint: 'AUTO', // ระบุอัตโนมัติเสมอ
  }

  // Save to store if projectId is provided
  if (props.projectId) {
    projectStore.setCriteria(props.projectId, formData)
  }

  emit('submit', formData)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Header -->
    <div class="mb-4">
      <h3 class="text-lg font-bold text-gray-900">
        ตั้งค่าเกณฑ์การคำนวณ Hydraulic
      </h3>
      <p class="text-sm text-gray-600 mt-1">
        กำหนดพารามิเตอร์สำหรับการคำนวณท่อน้ำดีตามมาตรฐาน
      </p>
    </div>

    <!-- Velocity Settings -->
    <div class="space-y-3">
      <h4 class="text-sm font-semibold text-gray-700">เกณฑ์ความเร็วน้ำในท่อ (มาตรฐานระบบ)</h4>

      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <!-- ✅ OK Range -->
        <div class="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-sm">✓</span>
            <div>
              <span class="text-sm font-bold text-green-900">1.2 - 2.4 m/s</span>
              <span class="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">ปกติดี (OK)</span>
            </div>
          </div>
          <p class="text-xs text-green-800 ml-8">
            ความเร็วที่เหมาะสมที่สุด • ท่อทำงานได้อย่างมีประสิทธิภาพ • ไม่เกิดปัญหา
          </p>
        </div>

        <!-- ⚠️ Warning Ranges -->
        <div class="mb-4 grid grid-cols-2 gap-3">
          <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg">⚠️</span>
              <div>
                <span class="text-sm font-bold text-yellow-900">0.6 - 1.2 m/s</span>
                <span class="ml-1 text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">ต่ำ</span>
              </div>
            </div>
            <p class="text-xs text-yellow-800">
              ความเร็วต่ำกว่าเกณฑ์ • อาจเกิดการตะกตะกอน
            </p>
          </div>

          <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg">⚠️</span>
              <div>
                <span class="text-sm font-bold text-yellow-900">2.4 - 3.0 m/s</span>
                <span class="ml-1 text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">สูง</span>
              </div>
            </div>
            <p class="text-xs text-yellow-800">
              ความเร็วสูงกว่าเกณฑ์ • อาจเกิดเสียงดัง
            </p>
          </div>
        </div>

        <!-- ❌ Critical Ranges -->
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 bg-red-50 rounded-lg border border-red-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg">❌</span>
              <div>
                <span class="text-sm font-bold text-red-900">&lt; 0.6 m/s</span>
                <span class="ml-1 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">วิกฤต</span>
              </div>
            </div>
            <p class="text-xs text-red-800">
              ความเร็วต่ำมาก • เกิดการตะกตะกอนแน่นอน • ต้องปรับขนาดท่อ
            </p>
          </div>

          <div class="p-3 bg-red-50 rounded-lg border border-red-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg">❌</span>
              <div>
                <span class="text-sm font-bold text-red-900">&gt; 3.0 m/s</span>
                <span class="ml-1 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">วิกฤต</span>
              </div>
            </div>
            <p class="text-xs text-red-800">
              ความเร็วสูงมาก • เกิด water hammer • เสียหายต่อท่อแน่นอน
            </p>
          </div>
        </div>

        <!-- Info Note -->
        <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex items-start gap-2">
            <svg class="h-4 w-4 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <p class="text-xs text-blue-900 font-semibold mb-1">มาตรฐานระบบ (System Constants)</p>
              <p class="text-xs text-blue-800">
                ค่าเหล่านี้เป็นค่าคงที่ของระบบ ไม่สามารถแก้ไขได้ • อ้างอิงจากมาตรฐานวิศวกรรมท่อประปา
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Curve Mode (Locked) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        โหมดการคำนวณ Curve
      </label>
      <div class="relative">
        <input
          value="Hunter's Curve"
          disabled
          class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
        />
        <span class="absolute right-3 top-2 text-xs text-gray-400">🔒 ล็อค</span>
      </div>
    </div>

    <!-- C-Factor -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        ชนิดท่อ (C-Factor)
      </label>
      <select
        v-model.number="form.cFactor"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        required
      >
        <option
          v-for="option in cFactorOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <p class="text-xs text-gray-500 mt-1">
        ค่า C-Factor สำหรับคำนวณความสูญเสียดัน (Hazen-Williams)
      </p>
    </div>

    <!-- PVC Class (แสดงเฉพาะเมื่อเลือก PVC) -->
    <div v-if="isPVC">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        ชั้นคุณภาพท่อ PVC (PVC Class)
      </label>
      <select
        v-model.number="form.pvcClass"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        required
      >
        <option
          v-for="option in pvcClassOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs text-blue-800">
            <strong>PVC Class:</strong> {{ form.pvcClass }} bar
          </span>
        </div>
        <p class="text-xs text-blue-700 mt-1">
          {{ pvcClassOptions.find(opt => opt.value === form.pvcClass)?.desc }}
        </p>
      </div>
    </div>

    <!-- Demand Mode -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        โหมด Demand
      </label>
      <select
        v-model="form.demandMode"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        required
      >
        <option
          v-for="option in demandModeOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Minor Loss Factor -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Minor Loss Factor
      </label>
      <div class="relative">
        <input
          v-model.number="form.minorLossFactor"
          type="number"
          step="1"
          min="0"
          max="50"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          required
        />
        <span class="absolute right-3 top-2 text-gray-500 text-xs">%</span>
      </div>
      <p class="text-xs text-gray-500 mt-1">
        ค่าน้ำหนักที่เสียจากข้องอ ตัวแยก วาล์ว ฯลฯ (แนะนำ: 10-20%)
      </p>
    </div>

    <!-- Critical Endpoint (Auto) -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <div class="text-blue-500 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-blue-900">
            Critical Endpoint
          </h4>
          <p class="text-xs text-blue-700 mt-1">
            ระบบจะระบุจุดวิกฤตโดยอัตโนมัติ
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-3 border-t">
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
      >
        บันทึก
      </button>
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
      >
        ยกเลิก
      </button>
    </div>
  </form>
</template>
