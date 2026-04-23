<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Calculation</h1>
          <p class="mt-1 text-sm text-gray-600">
            คำนวณขนาดท่อด้วยระบบ Auto Suggest และ Hybrid Sizing
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Auto Suggest Upsizing -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                Auto Suggest Upsizing
              </h3>
              <svg
                class="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>

            <AutoSuggestUpsizing
              v-if="network"
              :network-id="network.id"
              :project-id="projectId"
              @suggestion-change="onSuggestionChange"
              @summary-change="onSummaryChange"
              @need-major-loss="onNeedMajorLoss"
            />
            <div v-else class="text-center py-8 text-gray-500">
              <p class="text-sm">ไม่พบข้อมูล Network</p>
            </div>
          </div>

          <!-- Hybrid Pipe Sizing -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                Hybrid Pipe Sizing
              </h3>
              <svg
                class="h-5 w-5 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>

            <HybridPipeSizing
              v-if="network"
              :network-id="network.id"
              @sizing-change="onSizingChange"
            />
            <div v-else class="text-center py-8 text-gray-500">
              <p class="text-sm">ไม่พบข้อมูล Network</p>
            </div>
          </div>
        </div>

        <!-- Required Inlet Pressure Calculator -->
        <div class="mt-6">
          <RequiredInletPressure
            v-if="network"
            ref="requiredInletPressureRef"
            :network-id="network.id"
            :project-id="projectId"
          />
        </div>

        <!-- Calculation Summary -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">สรุปขนาดท่อ</h3>
            <!-- <button
              @click="recalculate"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              คำนวณใหม่
            </button> -->
          </div>

          <div
            v-if="!hasCalculated && !pipeSizesSummary"
            class="text-center py-12"
          >
            <svg
              class="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M15 7h6m-6 0h.01M9 3h6m-6 0h.01M3 21h18M9 3v6m6-6h6m-6 0v6"
              />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              ยังไม่มีการคำนวณ
            </h3>
            <p class="text-gray-600">กดปุ่มคำนวณเพื่อเริ่มคำนวณขนาดท่อ</p>
          </div>

          <div v-else>
            <!-- Pipe Sizes Summary -->
            <div
              v-if="pipeSizesSummary"
              class="mb-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200"
            >
              <h4
                class="text-sm font-bold text-gray-900 mb-3 flex items-center"
              >
                <svg
                  class="h-4 w-4 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                รายชื่อเส้นท่อที่เลือก
              </h4>

              <!-- Critical Path -->
              <div
                v-if="pipeSizesSummary.criticalPath?.length > 0"
                class="mb-3"
              >
                <h5 class="text-xs font-semibold text-red-700 mb-2">
                  Critical Path ({{ pipeSizesSummary.criticalPath.length }}
                  เส้น)
                </h5>
                <div class="space-y-1">
                  <div
                    v-for="(pipe, idx) in pipeSizesSummary.criticalPath"
                    :key="`cp-${idx}`"
                    class="flex items-center justify-between bg-white px-3 py-2 rounded border border-red-200"
                  >
                    <span class="text-sm font-medium text-gray-800">{{
                      pipe.segmentName
                    }}</span>
                    <span class="text-sm font-bold text-red-600"
                      >{{ pipe.sizeMM }}mm ({{ pipe.sizeInches }})</span
                    >
                  </div>
                </div>
              </div>

              <!-- Branch Pipes -->
              <div v-if="pipeSizesSummary.branch?.length > 0">
                <h5 class="text-xs font-semibold text-blue-700 mb-2">
                  Branch Pipes ({{ pipeSizesSummary.branch.length }} เส้น)
                </h5>
                <div class="space-y-1">
                  <div
                    v-for="(pipe, idx) in pipeSizesSummary.branch"
                    :key="`br-${idx}`"
                    class="flex items-center justify-between bg-white px-3 py-2 rounded border border-blue-200"
                  >
                    <span class="text-sm font-medium text-gray-800">{{
                      pipe.segmentName
                    }}</span>
                    <span class="text-sm font-bold text-blue-600"
                      >{{ pipe.sizeMM }}mm ({{ pipe.sizeInches }})</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-between items-center">
            <div class="flex gap-3">
              <BackButton @click="goToPrevStep" />
              <NextStepButton
                @click="goToNextStep"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AutoSuggestUpsizing from "~/components/calculator/AutoSuggestUpsizing.vue";
import HybridPipeSizing from "~/components/calculator/HybridPipeSizing.vue";
import RequiredInletPressure from "~/components/calculator/RequiredInletPressure.vue";
import BackButton from "~/components/navigation/BackButton.vue";
import NextStepButton from "~/components/navigation/NextStepButton.vue";
import { networksApi } from "~/composables/useApi";
import { useWorkflowStore } from "~/stores/workflowStore";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const workflowStore = useWorkflowStore();

// State
const projectId = computed(() => parseInt(route.params.id as string));
const network = ref<any>(null);
const hasCalculated = ref(false);
const calculationSummary = ref<any>({
  totalFixtures: 0,
  totalFU: 0,
  flowRate: 0,
  maxPipeSize: "-"
});
const pipeSizesSummary = ref<any>(null);

// Methods
const loadNetwork = async () => {
  try {
    const currentNetwork = await networksApi.getCurrent(projectId.value);
    network.value = currentNetwork;
  } catch (error: any) {
    console.error("Failed to load network:", error);
    network.value = null;
  }
};

const loadCalculationSummary = async () => {
  try {
    // TODO: Implement this API endpoint in backend
    // const summary = await calculationsApi.getSummary(projectId.value)
    // if (summary) {
    //   calculationSummary.value = summary
    //   hasCalculated.value = true
    // }
    hasCalculated.value = false;
  } catch (error) {
    // No calculation yet
    hasCalculated.value = false;
  }
};

// const recalculate = async () => {
//   try {
//     toast.info("กำลังคำนวณ...");
//     await calculationsApi.calculate(projectId.value);
//     await loadCalculationSummary();
//     toast.success("คำนวณเสร็จสิ้น");
//     workflowStore.markStepComplete("calculation");
//   } catch (error: any) {
//     toast.error(error.message || "Failed to calculate");
//   }
// };

const onSuggestionChange = () => {
  workflowStore.markStepComplete("calculation");
};

const onSummaryChange = (summary: any) => {
  pipeSizesSummary.value = summary;

  // Update calculationSummary from stats
  if (summary.stats) {
    calculationSummary.value = {
      totalFixtures: summary.stats.totalFixtures || 0,
      totalFU: summary.stats.totalFU || 0,
      flowRate: summary.stats.flowRate || 0,
      maxPipeSize: summary.stats.maxPipeSize || "-"
    };
    console.log("[Calculation] Calculation summary updated:", calculationSummary.value);
  }

  console.log("[Calculation] Pipe sizes summary received:", summary);
};

const onSizingChange = () => {
  workflowStore.markStepComplete("calculation");
};

// Reference to RequiredInletPressure component
const requiredInletPressureRef = ref<any>(null);

// Handle major loss from AutoSuggestUpsizing, pass to RequiredInletPressure
const onNeedMajorLoss = (majorLossBar: number) => {
  console.log(
    "[Calculation] Received majorLoss from AutoSuggestUpsizing:",
    majorLossBar.toFixed(3),
    "bar"
  );
  // Pass to RequiredInletPressure component
  if (requiredInletPressureRef.value) {
    requiredInletPressureRef.value.onNeedMajorLoss(majorLossBar);
  }
};

const saveCalculation = () => {
  workflowStore.markStepComplete("calculation");
  toast.success("บันทึกผลการคำนวณเรียบร้อย");
};

const goToNextStep = () => {
  router.push(`/projects/${route.params.id}/versions`);
};

const goToPrevStep = () => {
  router.push(`/projects/${route.params.id}/fixtures`);
};

// Load data on mount
onMounted(async () => {
  await Promise.all([loadNetwork(), loadCalculationSummary()]);
  workflowStore.setCurrentStep("calculation");
});

definePageMeta({
  layout: "dashboard"
});
</script>
