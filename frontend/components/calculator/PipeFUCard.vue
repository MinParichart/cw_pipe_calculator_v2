<template>
  <div class="space-y-3">
    <!-- Pipe Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg
          class="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <h4 class="font-semibold text-gray-900">
          {{ pipeLoad.fromNode }} → {{ pipeLoad.toNode }}
        </h4>
      </div>
      <div class="flex flex-col items-end gap-2">
        <div class="flex items-center gap-3 text-sm">
          <span
            class="px-3 py-1 bg-white rounded-full text-gray-700 border border-gray-300 shadow-sm"
          >
            {{ pipeLoad.length.toFixed(1) }}m
          </span>
        </div>
        <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <div class="space-y-1.5">
            <!-- WC Systems (UPC Standard) -->
            <div
              v-if="
                getGPMBreakdown().flushTankFU > 0 ||
                getGPMBreakdown().flushValveFU > 0
              "
              class="flex items-center justify-between gap-4 text-xs"
            >
              <span class="text-gray-600 font-medium">
                {{
                  getGPMBreakdown().upcSystemType === "FLUSH_TANK"
                    ? "🚽 Flush Tank:"
                    : "🚰 Mixed System (Flush Tank + Valve):"
                }}
              </span>
              <span class="text-gray-900 font-semibold">
                {{ getGPMBreakdown().upcTotalFU }} FU →
                {{
                  (
                    getGPMBreakdown().flushTankGPM +
                    getGPMBreakdown().flushValveGPM
                  ).toFixed(1)
                }}
                GPM
              </span>
            </div>
            <div
              v-if="
                getGPMBreakdown().upcSystemType === 'FLUSH_VALVE' &&
                getGPMBreakdown().flushTankFU > 0 &&
                getGPMBreakdown().flushValveFU > 0
              "
              class="flex items-center justify-between gap-4 text-xs text-orange-600"
            >
              <span class="font-medium">└─ โดย:</span>
              <span class="font-semibold">
                {{ getGPMBreakdown().flushTankFU }} Tank +
                {{ getGPMBreakdown().flushValveFU }} Valve FU
              </span>
            </div>

            <!-- Hose Bibb -->
            <div
              v-if="getGPMBreakdown().hoseBibbGPM > 0"
              class="flex items-center justify-between gap-4 text-xs"
            >
              <span class="text-gray-600 font-medium">🚿 Hose Bibb:</span>
              <span class="text-gray-900 font-semibold"
                >{{ getGPMBreakdown().hoseBibbGPM }} GPM</span
              >
            </div>

            <!-- Total -->
            <div class="border-t border-gray-200 pt-2 mt-2">
              <div class="flex items-center justify-between gap-4 text-xs">
                <span class="text-blue-600 font-bold">Total:</span>
                <span class="text-blue-600 font-bold text-lg"
                  >{{ getGPMBreakdown().gpmFromFU.toFixed(1) }} FU</span
                >
                <span class="text-blue-600 font-bold text-lg"
                  >{{ getGPMBreakdown().totalGPM.toFixed(1) }} GPM</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nodes in Network -->
    <div v-if="pipeLoad.nodes.length > 0" class="mt-3">
      <div class="text-xs text-gray-600 font-medium mb-2">
        Nodes ที่เชื่อมต่อ ({{ pipeLoad.nodes.length }} nodes):
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="node in pipeLoad.nodes"
          :key="node.id"
          class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
        >
          {{ node.label }} ({{ node.type }})
        </span>
      </div>
    </div>

    <!-- Fixtures List -->
    <div v-if="pipeLoad.fixtureGroups.length > 0" class="space-y-2">
      <div class="text-xs text-gray-600 font-medium">สุขภัณฑ์ที่จ่าย:</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div
          v-for="group in pipeLoad.fixtureGroups"
          :key="group.type"
          class="bg-white rounded-lg p-3 border border-gray-200"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-900">{{
                getFixtureTypeName(group.type)
              }}</span>
              <span
                class="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {{ group.count }} ชุด
              </span>
            </div>
            <div
              class="text-sm font-bold text-blue-600"
              v-if="group.type !== 'HOSE_BIBB'"
            >
              {{ group.totalFU }} FU
            </div>
          </div>

          <div class="text-xs text-gray-500">
            <span v-if="group.type === 'HOSE_BIBB'"
              >{{ getGroupGPM(group) }} GPM</span
            >
            <span v-else>FU: {{ getStandardFU(group.type) }} ต่อชุด</span>
          </div>
        </div>
      </div>

      <!-- Fixtures Detail List -->
      <div v-if="showDetails" class="mt-3 space-y-1">
        <div
          v-for="fixture in pipeLoad.fixtures"
          :key="fixture.id"
          class="text-xs text-gray-600 pl-2 border-l-2 border-gray-200"
        >
          • {{ fixture.name }} ({{ fixture.nodeName }}) -
          {{ fixture.totalFU }} FU
        </div>
      </div>

      <!-- Toggle Details Button -->
      <button
        @click="showDetails = !showDetails"
        class="mt-2 text-xs text-blue-600 hover:text-blue-700"
      >
        {{ showDetails ? "ซ่อนรายละเอียด" : "แสดงรายละเอียดเพิ่มเติม" }}
      </button>
    </div>

    <!-- No Fixtures -->
    <div v-else class="text-xs text-gray-500 italic">
      ไม่มีสุขภัณฑ์เชื่อมต่อ
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { calculateUPCGPM, fuToGPM } from "~/shared/constants/hunterCurve.ts";

const props = defineProps<{
  pipeLoad: {
    pipe: any;
    fromNode: string;
    toNode: string;
    fixtures: any[];
    nodes: any[];
    fixtureGroups: any[];
    totalFU: number;
    totalGPM: number;
    length: number;
  };
}>();

const showDetails = ref(false);

const getFixtureTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    WC_TANK: "WC (Flush Tank)",
    WC_VALVE: "WC (Flush Valve)",
    LAVATORY: "Lavatory",
    BATHTUB: "Bathtub",
    SHOWER: "Shower",
    HOSE_BIBB: "Hose Bibb",
    KITCHEN_SINK: "Kitchen Sink",
    LAUNDRY_TRAY: "Laundry Tray",
    DISHWASHER: "Dishwasher",
    WASHING_MACHINE_3_5KG: "Washing Machine 3.5kg",
    WASHING_MACHINE_7KG: "Washing Machine 7kg"
  };
  return typeNames[type] || type;
};

const getStandardFU = (type: string) => {
  const standardFU: Record<string, number> = {
    WC_TANK: 3,
    WC_VALVE: 6,
    LAVATORY: 1,
    BATHTUB: 2,
    SHOWER: 2,
    HOSE_BIBB: 0,
    KITCHEN_SINK: 2,
    LAUNDRY_TRAY: 3,
    DISHWASHER: 1,
    WASHING_MACHINE_3_5KG: 2,
    WASHING_MACHINE_7KG: 4
  };
  const normalizedType = type?.trim().toUpperCase();
  return standardFU[normalizedType] || (normalizedType === "HOSE_BIBB" ? 0 : 1);
};

// Get GPM value for hose bibb (constant flow rate)
const getHoseBibbGPM = () => {
  return 5;
};

// Calculate Total GPM for this pipe using Hunter's Curve (legacy - for display only)
const getTotalGPM = () => {
  return fuToGPM(props.pipeLoad.totalFU, "FLUSH_TANK");
};

// Get GPM for a fixture group
const getGroupGPM = (group: any) => {
  if (group.type === "HOSE_BIBB") {
    return group.count * 5;
  } else {
    return fuToGPM(group.totalFU, "FLUSH_TANK");
  }
};

// Calculate Total GPM with proper handling of Flush Tank vs Flush Valve
const getTotalGPMWithHoseBibb = () => {
  // Separate FU for Flush Tank and Flush Valve fixtures
  let flushTankFU = 0;
  let flushValveFU = 0;
  let hoseBibbCount = 0;

  // Count fixtures by type
  if (props.pipeLoad.fixtures && Array.isArray(props.pipeLoad.fixtures)) {
    props.pipeLoad.fixtures.forEach((fixture: any) => {
      if (fixture.type === "HOSE_BIBB") {
        hoseBibbCount += fixture.quantity || 1;
      } else if (fixture.type === "WC_VALVE") {
        // WC Valve uses Flush Valve curve
        const fu = getStandardFU(fixture.type);
        flushValveFU += fu * (fixture.quantity || 1);
      } else if (fixture.type === "WC_TANK") {
        // WC Tank uses Flush Tank curve
        const fu = getStandardFU(fixture.type);
        flushTankFU += fu * (fixture.quantity || 1);
      } else {
        // Other fixtures use Flush Tank curve
        const fu = getStandardFU(fixture.type);
        flushTankFU += fu * (fixture.quantity || 1);
      }
    });
  }

  // Calculate GPM from each curve
  const gpmFromFlushTank = fuToGPM(flushTankFU, "FLUSH_TANK");
  const gpmFromFlushValve = fuToGPM(flushValveFU, "FLUSH_VALVE");
  const gpmFromHoseBibb = hoseBibbCount * 5;

  return gpmFromFlushTank + gpmFromFlushValve + gpmFromHoseBibb;
};

// Get detailed breakdown of GPM sources
const getGPMBreakdown = () => {
  let flushTankFU = 0;
  let flushValveFU = 0;
  let hoseBibbCount = 0;

  // Count fixtures by type
  if (props.pipeLoad.fixtures && Array.isArray(props.pipeLoad.fixtures)) {
    props.pipeLoad.fixtures.forEach((fixture: any) => {
      // ดัก Type Coercion ให้เป็น Number เสมอ ป้องกัน String Concatenation
      const qty = Number(fixture.quantity) || 1;
      const normalizedType = fixture.type?.trim().toUpperCase();

      if (normalizedType === "HOSE_BIBB") {
        hoseBibbCount += qty;
      } else if (normalizedType === "WC_VALVE") {
        flushValveFU += getStandardFU(fixture.type) * qty;
      } else if (normalizedType === "WC_TANK") {
        flushTankFU += getStandardFU(fixture.type) * qty;
      } else {
        flushTankFU += getStandardFU(fixture.type) * qty;
      }
    });
  }

  // คำนวณค่าย่อย
  const upcResult = calculateUPCGPM(flushTankFU, flushValveFU);
  const gpmFromWC = upcResult.totalGPM;
  const gpmFromHoseBibb = hoseBibbCount * 5;

  // 🔥 FIX: คำนวณ Total GPM สดๆ ตรงนี้เลย ไม่ใช้ค่าจาก props แล้ว ป้องกัน Bug จาก Cache หรือ State เก่า
  const computedTotalGPM = gpmFromWC + gpmFromHoseBibb;

  return {
    flushTankFU,
    flushTankGPM: upcResult.systemType === "FLUSH_TANK" ? gpmFromWC : 0,
    flushValveFU,
    flushValveGPM: upcResult.systemType === "FLUSH_VALVE" ? gpmFromWC : 0,
    hoseBibbGPM: gpmFromHoseBibb,
    totalGPM: computedTotalGPM, // ส่งค่าที่คำนวณสดๆ ไปแสดงผลแทน
    gpmFromFU: upcResult.totalFU,
    upcSystemType: upcResult.systemType,
    upcTotalFU: upcResult.totalFU
  };
};
</script>
