<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">
        Required Inlet Pressure Calculator
      </h3>
      <div class="flex items-center gap-2">
        <svg
          class="h-5 w-5 text-purple-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span
          class="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full"
          >ใหม่</span
        >
      </div>
    </div>

    <div
      class="mb-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200"
    >
      <div class="text-center">
        <p class="text-sm text-gray-700 mb-2">Required Inlet Pressure</p>
        <p class="text-4xl font-bold text-purple-900 mb-1">
          {{ totalPressureBar }} bar
        </p>
        <p class="text-sm text-gray-600">({{ totalPressureMwg }} m.w.g)</p>

        <div class="mt-4 flex gap-2 justify-center">
          <button
            class="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            คำนวณใหม่
          </button>
          <button
            class="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
          >
            บันทึก PDF
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-50 rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ความสูงของท่อแนวดิ่ง (Vertical Loss)
        </label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="verticalHeight"
            type="number"
            step="0.1"
            min="0"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="0.0"
          />
          <span class="text-sm text-gray-600">เมตร</span>
        </div>
        <p class="mt-2 text-xs text-gray-500">💡 1 m = 0.0981 bar (แรงดัน)</p>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          สุขภัณฑ์ปลายทางที่ใกล้ที่สุด
        </label>
        <select
          v-model="selectedFixtureKey"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">-- เลือกสุขภัณฑ์ --</option>
          <option
            v-for="fixture in fixtureFlowRates"
            :key="fixture.name"
            :value="fixture.name"
          >
            {{ fixture.nameTh }} ({{ fixture.pressureBar }} bar)
          </option>
        </select>

        <div class="mt-2">
          <p class="text-xs text-gray-600">
            ความดันที่ต้องการ:
            <span class="font-semibold text-purple-900">
              {{ selectedFixturePressureBar.toFixed(2) }} bar
            </span>
          </p>
          <p class="text-xs text-gray-500">(จากตาราง Reference)</p>
        </div>

        <button
          class="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
        >
          📖 ดูตารางค่ามาตรฐาน
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <button
        class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span class="text-sm font-medium text-gray-900"
          >📊 Detailed Breakdown</span
        >
        <svg
          class="h-5 w-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div class="space-y-3 p-4 bg-gray-50 rounded-lg">
        <div
          class="flex items-start justify-between p-3 bg-white rounded-lg border border-orange-200"
        >
          <div class="flex-1">
            <p class="text-sm font-semibold text-orange-900 mb-1">
              ① Pipe Friction (Major Loss)
            </p>
            <p class="text-xs text-gray-600 mb-1">
              รวมความดันลดทุกท่อใน Critical Path
            </p>
            <p class="text-xs text-gray-500">(คำนวณจาก Hazen-Williams)</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-orange-900">
              {{ majorLossBarValue.toFixed(3) }} bar
            </p>
            <p class="text-xs text-gray-600">
              ({{ majorLossMwg.toFixed(2) }} m.w.g)
            </p>
          </div>
        </div>

        <div
          class="flex items-start justify-between p-3 bg-white rounded-lg border border-blue-200"
        >
          <div class="flex-1">
            <p class="text-sm font-semibold text-blue-900 mb-1">
              ② Fittings (Minor Loss)
            </p>
            <p class="text-xs text-gray-600">
              {{ minorLossPercent }}% ของ Major Loss
            </p>
            <p class="text-xs text-gray-500">(ตั้งค่าที่ Step 1: Parameters)</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-blue-900">
              {{ minorLossBarValue.toFixed(3) }} bar
            </p>
            <p class="text-xs text-gray-600">
              ({{ minorLossMwg.toFixed(2) }} m.w.g)
            </p>
          </div>
        </div>

        <div
          class="flex items-start justify-between p-3 bg-white rounded-lg border border-green-200"
        >
          <div class="flex-1">
            <p class="text-sm font-semibold text-green-900 mb-1">
              ③ Elevation (Vertical Loss)
            </p>
            <p class="text-xs text-gray-600">
              ความสูงท่อแนวดิ่ง: {{ verticalHeight.toFixed(1) }} เมตร
            </p>
            <p class="text-xs text-gray-500">(จากข้อมูลที่ User กรอก)</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-green-900">
              {{ verticalLossBarValue.toFixed(3) }} bar
            </p>
            <p class="text-xs text-gray-600">
              ({{ verticalLossMwg.toFixed(2) }} m.w.g)
            </p>
          </div>
        </div>

        <div
          class="flex items-start justify-between p-3 bg-white rounded-lg border border-purple-200"
        >
          <div class="flex-1">
            <p class="text-sm font-semibold text-purple-900 mb-1">
              ④ Fixture Requirement
            </p>
            <p class="text-xs text-gray-600">
              {{ selectedFixture?.nameTh || "-" }}
            </p>
            <p class="text-xs text-gray-500">(ความดันขั้นต่ำจากตารางอ้างอิง)</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-purple-900">
              {{ selectedFixturePressureBar.toFixed(3) }} bar
            </p>
            <p class="text-xs text-gray-600">
              ({{ selectedFixturePressureMwg.toFixed(2) }} m.w.g)
            </p>
          </div>
        </div>

        <div
          class="flex items-start justify-between p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300"
        >
          <div class="flex-1">
            <p class="text-base font-bold text-purple-900 mb-1">
              Total Required Inlet Pressure
            </p>
            <p class="text-xs text-gray-700">① + ② + ③ + ④</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-purple-900">
              {{ totalPressureBar }} bar
            </p>
            <p class="text-xs text-gray-600">({{ totalPressureMwg }} m.w.g)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useProjectStore } from "~/stores/projectStore";
import { fixtureFlowRates } from "~/utils/fixtureData";

const props = defineProps<{
  networkId?: number;
  projectId?: number;
}>();

const projectStore = useProjectStore();

// 1. โหลดข้อมูลจาก LocalStorage (กันหายเวลารีเฟรช)
const loadSavedValues = () => {
  let initialHeight = 3.0;
  // ลองดึงจาก Store ก่อน
  if (props.projectId) {
    const criteria = projectStore.getCriteria(props.projectId);
    if (criteria && criteria.staticHead !== undefined) {
      initialHeight = criteria.staticHead;
    }
  }

  // ดึงจาก LocalStorage เป็นหลัก
  if (typeof window !== "undefined" && props.networkId) {
    const saved = localStorage.getItem(
      `requiredInletPressure_${props.networkId}`
    );
    if (saved) {
      const data = JSON.parse(saved);
      return {
        verticalHeight: data.verticalHeight ?? initialHeight,
        selectedFixtureKey: data.selectedFixtureKey ?? "Shower"
      };
    }
  }
  return { verticalHeight: initialHeight, selectedFixtureKey: "Shower" };
};

const verticalHeight = ref<number>(loadSavedValues().verticalHeight);
const selectedFixtureKey = ref<string>(loadSavedValues().selectedFixtureKey);

// 🔥 FIX: ตัวแปรเก็บ Major Loss (รับมาเป็นหน่วย m.w.g เสมอ)
const majorLossMwg = ref<number>(0.0);

// บันทึกค่าผู้ใช้กรอกลง LocalStorage แบบ Real-time
watch(
  [verticalHeight, selectedFixtureKey],
  ([newHeight, newFixture]) => {
    if (typeof window !== "undefined" && props.networkId) {
      localStorage.setItem(
        `requiredInletPressure_${props.networkId}`,
        JSON.stringify({
          verticalHeight: newHeight,
          selectedFixtureKey: newFixture
        })
      );
    }
  },
  { deep: true }
);

// 🚀 ฟังก์ชันพระเอก รับค่า Major Loss จากตัวแม่ (ส่งมาเป็นเมตรน้ำ m.w.g)
const onNeedMajorLoss = (majorLoss: number) => {
  console.log(
    `[RequiredInletPressure] 📥 ได้รับค่า Major Loss: ${majorLoss.toFixed(3)} m.w.g`
  );
  majorLossMwg.value = majorLoss || 0.0;

  // 🛡️ เซฟลง LocalStorage ไว้กันเหนียว (กันรีเฟรชแล้วเป็น 0)
  if (typeof window !== "undefined" && props.networkId) {
    localStorage.setItem(
      `majorLoss_net_${props.networkId}`,
      majorLossMwg.value.toString()
    );
  }
};

defineExpose({ onNeedMajorLoss });

onMounted(() => {
  // ถ้าเปิดหน้าต่างขึ้นมา แล้วแม่ยังไม่ทันส่งค่ามา ให้ดึงจากที่เคยจำไว้มาโชว์ก่อน
  if (typeof window !== "undefined" && props.networkId) {
    const savedMajorLoss = localStorage.getItem(
      `majorLoss_net_${props.networkId}`
    );
    if (savedMajorLoss) {
      majorLossMwg.value = parseFloat(savedMajorLoss);
    }
  }
});

// ==========================================
// 🧮 โซนคำนวณคณิตศาสตร์ (ใช้หน่วยตัวเลขเพียวๆ ไม่มีบั๊ก)
// ==========================================

// ① Major Loss
const majorLossBarValue = computed(() => majorLossMwg.value / 10.197);

// ② Minor Loss (ดึงเปอร์เซ็นต์มาจาก Step 1)
const minorLossPercent = computed(() => {
  if (!props.projectId) return 30; // กันพัง
  const criteria = projectStore.getCriteria(props.projectId);
  return criteria?.minorLossFactor ?? 30;
});
const minorLossMwg = computed(
  () => majorLossMwg.value * (minorLossPercent.value / 100)
);
const minorLossBarValue = computed(() => minorLossMwg.value / 10.197);

// ③ Vertical Loss
const verticalLossMwg = computed(() => verticalHeight.value);
const verticalLossBarValue = computed(() => verticalHeight.value * 0.0981);

// ④ Fixture Requirement
const selectedFixture = computed(() => {
  if (!selectedFixtureKey.value) return null;
  return fixtureFlowRates.find((f) => f.name === selectedFixtureKey.value);
});
const selectedFixturePressureBar = computed(
  () => selectedFixture.value?.pressureBar || 0.0
);
const selectedFixturePressureMwg = computed(
  () => selectedFixturePressureBar.value * 10.197
);

// 🌟 TOTAL
const totalPressureBar = computed(() => {
  const total =
    majorLossBarValue.value +
    minorLossBarValue.value +
    verticalLossBarValue.value +
    selectedFixturePressureBar.value;
  return total.toFixed(2);
});

const totalPressureMwg = computed(() => {
  const total =
    majorLossMwg.value +
    minorLossMwg.value +
    verticalLossMwg.value +
    selectedFixturePressureMwg.value;
  return total.toFixed(2);
});
</script>
