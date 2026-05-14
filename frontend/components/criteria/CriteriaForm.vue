<script setup lang="ts">
import { computed } from "vue";
import { useProjectStore } from "../../stores/projectStore";

const props = defineProps<{
  criteria?: any;
  projectId?: number;
}>();

const emit = defineEmits<{
  submit: [criteria: any];
  cancel: [];
}>();

const projectStore = useProjectStore();

const form = ref({
  curveMode: "HUNTER", // ล็อคเป็น Hunter Curve เสมอ
  demandMode: props.criteria?.demandMode || "FLUSH_TANK",
  minorLossFactor: props.criteria?.minorLossFactor || 15,
  cFactor: props.criteria?.cFactor || 150,
  pvcClass: props.criteria?.pvcClass || 7 // Default PVC Class เป็น 7
  // Critical Endpoint ระบุอัตโนมัติ - ไม่ต้อง input
});

const cFactorOptions = [
  {
    value: 150,
    label: "PVC (150)",
    desc: "ท่อ PVC ทั่วไป - มาตรฐานสำหรับท่อน้ำดี"
  }
];

const demandModeOptions = [
  { value: "FLUSH_TANK", label: "Flush Tank Only" },
  { value: "FLUSH_VALVE", label: "Flush Valve Only" },
  { value: "MIXED", label: "Flush Tank + Flush Valve" }
];

const pvcClassOptions = [
  {
    value: 5,
    label: "PVC 5 (5 bar)",
    desc: "ท่อ PVC ชั้นคุณภาพ 5 (ความดัน 5 bar)"
  },
  {
    value: 7,
    label: "PVC 7 (7 bar)",
    desc: "ท่อ PVC ชั้นคุณภาพ 7 (ความดัน 7 bar)"
  },
  {
    value: 8.5,
    label: "PVC 8.5 (8.5 bar)",
    desc: "ท่อ PVC ชั้นคุณภาพ 8.5 (ความดัน 8.5 bar)"
  },
  {
    value: 10.5,
    label: "PVC 10.5 (10.5 bar)",
    desc: "ท่อ PVC ชั้นคุณภาพ 10.5 (ความดัน 10.5 bar)"
  },
  {
    value: 13.5,
    label: "PVC 13.5 (13.5 bar)",
    desc: "ท่อ PVC ชั้นคุณภาพ 13.5 (ความดัน 13.5 bar)"
  }
];

// ตรวจสอบว่าเลือกท่อ PVC หรือไม่ (cFactor = 150)
const isPVC = computed(() => form.value.cFactor === 150);

const handleSubmit = () => {
  console.log('🔧 [CriteriaForm] handleSubmit called');
  console.log('🔧 [CriteriaForm] form.value:', form.value);
  console.log('🔧 [CriteriaForm] props.projectId:', props.projectId);

  const formData = {
    ...form.value,
    criticalEndpoint: "AUTO" // ระบุอัตโนมัติเสมอ
  };

  console.log('🔧 [CriteriaForm] formData:', formData);

  // Save to store if projectId is provided
  if (props.projectId) {
    console.log('🔧 [CriteriaForm] Saving to store...');
    projectStore.setCriteria(props.projectId, formData);
  }

  console.log('🔧 [CriteriaForm] Emitting submit event...');
  emit("submit", formData);

  console.log('✅ [CriteriaForm] handleSubmit completed');
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Gradient Header -->
    <div class="bg-gradient-to-r from-blue-50 to-green-50 px-4 py-3 border-b border-gray-200 -mx-6 -mt-6 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
          <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-900">
            ตั้งค่าเกณฑ์การคำนวณ Hydraulic
          </h3>
          <p class="text-xs text-gray-600">
            Design Criteria Configuration
          </p>
        </div>
      </div>
    </div>

    <!-- 2-Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Velocity Settings -->
      <div class="space-y-4">
        <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
          <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
          ความเร็วน้ำในท่อ (Velocity Ranges)
        </h4>

        <!-- Velocity Ranges - 3 Columns Layout -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-3">
            <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h5 class="text-xs font-bold text-blue-900 uppercase">Velocity Ranges</h5>
          </div>

          <!-- Critical Low -->
          <div class="grid grid-cols-3 gap-2 mb-2">
            <div class="text-center p-2 bg-red-50 border border-red-200 rounded">
              <div class="text-red-500 text-lg mb-1">❌</div>
              <div class="text-xs text-red-700 font-semibold">Critical Low</div>
              <div class="text-xs text-red-900 font-bold">&lt; 0.6 m/s</div>
            </div>
            <!-- Warning Low -->
            <div class="text-center p-2 bg-yellow-50 border border-yellow-200 rounded">
              <div class="text-yellow-500 text-lg mb-1">⚠️</div>
              <div class="text-xs text-yellow-700 font-semibold">Warning Low</div>
              <div class="text-xs text-yellow-900 font-bold">0.6 - 1.2 m/s</div>
            </div>
            <!-- OK -->
            <div class="text-center p-2 bg-green-50 border border-green-200 rounded">
              <div class="text-green-500 text-lg mb-1">✅</div>
              <div class="text-xs text-green-700 font-semibold">OK Range</div>
              <div class="text-xs text-green-900 font-bold">1.2 - 2.4 m/s</div>
            </div>
          </div>

          <!-- Warning High + Critical High -->
          <div class="grid grid-cols-2 gap-2">
            <!-- Warning High -->
            <div class="text-center p-2 bg-yellow-50 border border-yellow-200 rounded">
              <div class="text-yellow-500 text-lg mb-1">⚠️</div>
              <div class="text-xs text-yellow-700 font-semibold">Warning High</div>
              <div class="text-xs text-yellow-900 font-bold">2.4 - 3.0 m/s</div>
            </div>
            <!-- Critical High -->
            <div class="text-center p-2 bg-red-50 border border-red-200 rounded">
              <div class="text-red-500 text-lg mb-1">❌</div>
              <div class="text-xs text-red-700 font-semibold">Critical High</div>
              <div class="text-xs text-red-900 font-bold">&gt; 3.0 m/s</div>
            </div>
          </div>

          <!-- Info Note -->
          <div class="mt-3 p-2 bg-blue-100 border border-blue-300 rounded">
            <p class="text-xs text-blue-800 text-center">
              <strong>มาตรฐานระบบ:</strong> ค่าคงที่ตามมาตรฐานวิศวกรรมท่อประปา
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Pipe & Calculation Settings -->
      <div class="space-y-4">
        <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
          <span class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
          การตั้งค่าท่อและการคำนวณ
        </h4>

        <!-- Locked Settings Card -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <!-- Curve Mode -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              โหมดการคำนวณ Curve
            </label>
            <div class="relative">
              <input
                value="Hunter's Curve"
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
              />
              <span class="absolute right-3 top-2 text-xs text-gray-400">🔒 ล็อค</span>
            </div>
          </div>

          <!-- C-Factor -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              ชนิดท่อ (C-Factor)
            </label>
            <div class="relative">
              <input
                value="PVC (150)"
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
              />
              <span class="absolute right-3 top-2 text-xs text-gray-400">🔒 ล็อค</span>
            </div>
          </div>

          <!-- PVC Class -->
          <div v-if="isPVC">
            <label class="block text-xs font-medium text-gray-700 mb-1">
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
            <div class="mt-1 p-2 bg-blue-50 rounded border border-blue-200">
              <p class="text-xs text-blue-800">
                <strong>{{ form.pvcClass }} bar:</strong> {{ pvcClassOptions.find((opt) => opt.value === form.pvcClass)?.desc }}
              </p>
            </div>
          </div>

          <!-- Minor Loss Factor -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
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
        </div>

        <!-- Critical Endpoint Info -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <svg class="h-4 w-4 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <h5 class="text-xs font-semibold text-green-900">Critical Endpoint</h5>
              <p class="text-xs text-green-700 mt-0.5">
                ระบบจะระบุจุดวิกฤต (จุดที่มีความดันต่ำสุด) โดยอัตโนมัติจาก Network Diagram
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-4 border-t border-gray-200">
      <button
        type="submit"
        class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        บันทึกการเปลี่ยนแปลง
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
