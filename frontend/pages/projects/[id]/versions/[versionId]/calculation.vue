<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Version Steps Indicator -->
    <VersionSteps :version-id="versionId" />

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Calculation</h1>
              <p class="mt-1 text-sm text-gray-600">
                คำนวณขนาดท่อด้วยระบบ Auto Suggest และ Hybrid Sizing
              </p>
            </div>

            <!-- Version Badge -->
            <div class="flex items-center gap-3">
              <div class="bg-orange-100 border border-orange-200 rounded-lg px-4 py-2">
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <p class="text-xs text-orange-600 font-medium">Version</p>
                    <p class="text-lg font-bold text-orange-900">{{ version?.name || `Version ${version?.versionNumber || '-'}` }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              v-if="networkData"
              :network-data="networkData"
              :version-id="versionId"
              :version-data="version"
              :project-id="projectId"
              @suggestion-change="onSuggestionChange"
              @summary-change="onSummaryChange"
              @need-major-loss="onNeedMajorLoss"
              @network-change="onNetworkChange"
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
              v-if="networkData"
              :network-data="networkData"
              :version-id="versionId"
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
            v-if="networkData"
            ref="requiredInletPressureRef"
            :network-data="networkData"
            :version-id="versionId"
            :project-id="projectId"
          />
        </div>

        <!-- Calculation Summary -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">สรุปขนาดท่อ</h3>
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
import VersionSteps from "~/components/workflow/VersionSteps.vue";
import AutoSuggestUpsizing from "~/components/calculator/AutoSuggestUpsizing.vue";
import HybridPipeSizing from "~/components/calculator/HybridPipeSizing.vue";
import RequiredInletPressure from "~/components/calculator/RequiredInletPressure.vue";
import BackButton from "~/components/navigation/BackButton.vue";
import NextStepButton from "~/components/navigation/NextStepButton.vue";
import { versionsApi } from "~/composables/useApi";
import { useWorkflowStore } from "~/stores/workflowStore";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const workflowStore = useWorkflowStore();

// State
const projectId = computed(() => parseInt(route.params.id as string));
const versionId = computed(() => parseInt(route.params.versionId as string));
const version = ref<any>(null);
const networkData = ref<any>(null);
const hasCalculated = ref(false);
const calculationSummary = ref<any>({
  totalFixtures: 0,
  totalFU: 0,
  flowRate: 0,
  maxPipeSize: "-"
});
const pipeSizesSummary = ref<any>(null);

console.log("🚀 [Step 5 - V2] Calculation page mounted");
console.log("   - Project ID:", projectId.value);
console.log("   - Version ID:", versionId.value);

// Methods
const loadVersion = async () => {
  try {
    const data = await versionsApi.get(versionId.value);
    if (data) {
      version.value = data;
      console.log('✅ Version loaded:', {
        id: data.id,
        name: data.name,
        hasSnapshotNetwork: !!data.snapshotNetwork,
        hasSnapshotFixtures: !!data.snapshotFixtures
      });
    }
  } catch (err: any) {
    console.error('Failed to load version:', err);
    toast.error('ไม่สามารถโหลด Version ได้');
  }
};

const loadNetworkFromVersion = () => {
  try {
    if (version.value?.snapshotNetwork) {
      networkData.value = JSON.parse(version.value.snapshotNetwork);
      console.log('✅ Network loaded from snapshot:', {
        nodes: networkData.value?.nodes?.length || 0,
        pipes: networkData.value?.pipes?.length || 0
      });
    } else {
      console.log('ℹ️ No snapshotNetwork found');
      networkData.value = null;
    }
  } catch (error) {
    console.error('Failed to parse network snapshot:', error);
    networkData.value = null;
  }
};

const loadCalculationSummary = async () => {
  try {
    // TODO: Load from version.snapshotResults if available
    if (version.value?.snapshotResults) {
      const results = JSON.parse(version.value.snapshotResults);
      console.log('✅ Calculation results loaded from snapshot');
      // Parse results if needed
      hasCalculated.value = true;
    } else {
      hasCalculated.value = false;
    }
  } catch (error) {
    console.error('Failed to parse calculation results:', error);
    hasCalculated.value = false;
  }
};

const onSuggestionChange = () => {
  workflowStore.markStepComplete("calculation");
  console.log('✅ [Step 5 - V2] Suggestion changed');
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

  // Save to version.snapshotResults
  saveCalculationSnapshot(summary);
};

const saveCalculationSnapshot = async (results: any) => {
  try {
    const snapshotResults = {
      pipeSizesSummary: results,
      calculationSummary: calculationSummary.value,
      updatedAt: new Date().toISOString()
    };

    await versionsApi.update(versionId.value, {
      snapshotResults: JSON.stringify(snapshotResults)
    });

    console.log('✅ Calculation snapshot saved');
  } catch (error) {
    console.error('Failed to save calculation snapshot:', error);
  }
};

const onSizingChange = () => {
  workflowStore.markStepComplete("calculation");
  console.log('✅ [Step 5 - V2] Sizing changed');
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

// Handle network changes from AutoSuggestUpsizing (v2 mode)
const onNetworkChange = async (updatedNetwork: any) => {
  networkData.value = updatedNetwork;

  // Save to version snapshot
  try {
    await versionsApi.update(versionId.value, {
      snapshotNetwork: JSON.stringify(updatedNetwork)
    });
    console.log('✅ Network snapshot saved after size change');
  } catch (error) {
    console.error('Failed to save network snapshot:', error);
    toast.error('ไม่สามารถบันทึก Network ได้');
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
  router.push(`/projects/${route.params.id}/versions/${route.params.versionId}/fixtures`);
};

// Load data on mount
onMounted(async () => {
  console.log("🚀 [Step 5 - V2] onMounted called");

  await loadVersion();
  loadNetworkFromVersion();
  await loadCalculationSummary();

  workflowStore.setCurrentStep("versionCalculation");

  console.log("✅ [Step 5 - V2] Data loaded");
});

definePageMeta({
  layout: "dashboard"
});
</script>
