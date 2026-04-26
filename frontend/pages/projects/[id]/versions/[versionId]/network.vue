<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Version Steps Indicator -->
    <VersionSteps :version-id="versionId" />

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">
                  Network Builder
                </h1>
                <p class="mt-1 text-sm text-gray-600">
                  วาดแผนภาพระบบท่อน้ำดีและเลือก Critical Path
                </p>
              </div>
            </div>

            <!-- Version Badge -->
            <div class="flex items-center gap-3">
              <div
                class="bg-orange-100 border border-orange-200 rounded-lg px-4 py-2"
              >
                <div class="flex items-center gap-2">
                  <svg
                    class="h-5 w-5 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <div>
                    <p class="text-xs text-orange-600 font-medium">Version</p>
                    <p class="text-lg font-bold text-orange-900">
                      {{
                        version?.name ||
                        `Version ${version?.versionNumber || "-"}`
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Blueprint Selector -->
        <div v-if="blueprints.length > 0" class="mb-6">
          <div
            class="bg-white rounded-lg shadow-sm border border-blue-200 overflow-hidden"
          >
            <div class="bg-blue-50 px-6 py-3 border-b border-blue-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg
                    class="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 class="text-lg font-semibold text-blue-900">
                    เลือก Blueprint จาก Step Upload
                  </h3>
                </div>
                <span
                  class="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full"
                >
                  {{ blueprints.length }} รูป
                </span>
              </div>
            </div>

            <div class="p-6">
              <!-- Blueprint Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  v-for="bp in blueprints"
                  :key="bp.id"
                  @click="toggleBlueprint(bp)"
                  class="border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg"
                  :class="
                    isBlueprintSelected(bp)
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-300 hover:border-blue-400'
                  "
                >
                  <div class="relative">
                    <img
                      :src="bp.url"
                      :alt="bp.name"
                      class="w-full h-32 object-cover"
                    />
                    <div
                      v-if="isBlueprintSelected(bp)"
                      class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                    >
                      {{ getBlueprintLayerNumber(bp) }}
                    </div>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center gap-1 mb-2 flex-wrap">
                      <span
                        class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {{ bp.floorText }}
                      </span>
                      <span
                        class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded"
                      >
                        {{ bp.typeText }}
                      </span>
                    </div>
                    <p
                      class="text-sm font-semibold text-gray-900 mb-1 truncate"
                    >
                      {{ bp.floorText }} - {{ bp.typeText }}
                    </p>
                    <p class="text-xs text-gray-600">Scale: {{ bp.scale }}</p>
                  </div>
                </div>
              </div>

              <!-- Selected Blueprints Info -->
              <div
                v-if="selectedBlueprints.length > 0"
                class="mt-4 p-3 bg-blue-50 rounded-lg"
              >
                <div class="text-sm text-blue-900">
                  <span class="font-semibold"
                    >เลือก {{ selectedBlueprints.length }} แบบ:</span
                  >
                  <span class="ml-2">{{
                    selectedBlueprints
                      .map((bp, i) => `${i + 1}. ${bp.floorText}`)
                      .join(", ")
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Blueprints Message -->
        <div
          v-else
          class="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center"
        >
          <svg
            class="h-12 w-12 mx-auto mb-3 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="font-medium text-yellow-900">ยังไม่มี Blueprint</p>
          <p class="text-sm text-yellow-700 mt-1">
            กรุณาอัปโหลด Blueprint ที่ Step Upload
          </p>
        </div>

        <!-- Network Builder -->
        <div v-if="selectedBlueprints.length > 0 && !loadingNetwork" class="mb-6">
          <NetworkBuilder
            :project-id="parseInt(route.params.id as string)"
            :version-id="parseInt(route.params.versionId as string)"
            :network-data="networkData"
            :blueprints="selectedBlueprints"
            @network-change="onNetworkChange"
          />
        </div>

        <!-- Loading State -->
        <div
          v-else-if="loadingNetwork"
          class="mb-6 bg-white rounded-lg shadow-sm p-8 text-center"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">กำลังโหลด Network...</p>
        </div>

        <!-- No Blueprint Selected Message -->
        <div v-else class="mb-6 bg-white rounded-lg shadow-sm p-8 text-center">
          <svg
            class="h-16 w-16 mx-auto mb-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            ยังไม่ได้เลือก Blueprint
          </h3>
          <p class="text-gray-600 mb-4">กรุณาเลือก Blueprint จากด้านบนก่อนเริ่มวาด Network</p>
        </div>

        <!-- Navigation Buttons -->
        <div v-if="networkData" class="mt-6 flex gap-3">
          <BackButton @click="goToPrevStep" />
          <NextStepButton @click="goToNextStep" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import VersionSteps from "~/components/workflow/VersionSteps.vue";
import BackButton from "~/components/navigation/BackButton.vue";
import NextStepButton from "~/components/navigation/NextStepButton.vue";
import NetworkBuilder from "~/components/network/NetworkBuilder.vue";
import { documentsApi, versionsApi } from "~/composables/useApi";
import { useVersionStore } from "~/stores/versionStore";
import { useWorkflowStore } from "~/stores/workflowStore";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const versionStore = useVersionStore();
const workflowStore = useWorkflowStore();

// Computed
const versionId = computed(() => {
  const id = route.params.versionId;
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
});

// State
const version = ref<any>(null);
const networkData = ref<any>(null);
const fixtures = ref<any[]>([]);
const criticalEndpointId = ref("");
const findingPath = ref(false);
const criticalPath = ref<any>(null);
const loadingNetwork = ref(true);

// Blueprint state
const blueprints = ref<any[]>([]);
const selectedBlueprints = ref<any[]>([]);

// Methods
const loadVersion = async () => {
  loadingNetwork.value = true;
  try {
    const versionId = parseInt(route.params.versionId as string);
    // Load version directly from database (not from cache)
    const data = await versionsApi.get(versionId);

    if (data) {
      version.value = data;
      console.log("✅ Version loaded from database:", {
        id: data.id,
        name: data.name,
        hasSnapshotNetwork: !!data.snapshotNetwork
      });
    }
  } catch (err: any) {
    console.error("Failed to load version:", err);
    toast.error("ไม่สามารถโหลด Version ได้");
  } finally {
    loadingNetwork.value = false;
  }
};

const loadNetworkFromVersion = () => {
  loadingNetwork.value = true;
  try {
    if (version.value?.snapshotNetwork) {
      networkData.value = JSON.parse(version.value.snapshotNetwork);
      console.log("✅ Network loaded from snapshot:", {
        nodes: networkData.value?.nodes?.length || 0,
        pipes: networkData.value?.pipes?.length || 0
      });
    } else {
      console.log("ℹ️ No snapshotNetwork found, networkData is null");
      networkData.value = null;
    }
  } catch (error) {
    console.error("Failed to parse network snapshot:", error);
    networkData.value = null;
  } finally {
    loadingNetwork.value = false;
  }
};

const loadFixturesFromVersion = () => {
  try {
    if (version.value?.snapshotFixtures) {
      const fixturesData = JSON.parse(version.value.snapshotFixtures);
      // Convert fixtures data to array
      fixtures.value =
        fixturesData.nodes?.flatMap((node: any) =>
          (node.fixtures || []).map((f: any) => ({
            id: `${node.id}-${f.type}`,
            name: `${node.label || node.id} - ${f.type}`,
            distance: 0, // TODO: Calculate from network
            type: f.type,
            quantity: f.quantity || 1
          }))
        ) || [];
    }
  } catch (error) {
    console.error("Failed to parse fixtures snapshot:", error);
    fixtures.value = [];
  }
};

const createNetwork = async () => {
  networkData.value = {
    nodes: [],
    pipes: []
  };
  // Save to version snapshot immediately
  await saveNetworkSnapshot();
  toast.success("สร้าง Network เรียบร้อย");
};

const onNetworkChange = async (updatedNetwork: any) => {
  networkData.value = updatedNetwork;
  // Save to version snapshot
  try {
    await saveNetworkSnapshot();
    console.log("✅ Network snapshot saved");
  } catch (error) {
    console.error("❌ Failed to save network snapshot:", error);
    toast.error("ไม่สามารถบันทึก Network ได้");
  }
};

const saveNetworkSnapshot = async () => {
  try {
    const versionId = parseInt(route.params.versionId as string);
    await versionStore.updateVersion(versionId, {
      snapshotNetwork: JSON.stringify(networkData.value)
    });
  } catch (error) {
    console.error("Failed to save network snapshot:", error);
  }
};

const findCriticalPath = async () => {
  if (fixtures.value.length === 0) {
    toast.error("ไม่พบ Fixtures สำหรับคำนวณ Critical Path");
    return;
  }

  findingPath.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock finding the furthest fixture
    const furthestFixture = fixtures.value.reduce(
      (max, fixture) =>
        (fixture.distance || 0) > (max.distance || 0) ? fixture : max,
      fixtures.value[0]
    );

    criticalEndpointId.value = furthestFixture.id;
    criticalPath.value = {
      endpoint: furthestFixture.name,
      totalDistance: furthestFixture.distance || 0,
      segments: Math.floor((furthestFixture.distance || 0) / 3) + 1
    };

    toast.success("หา Critical Path เรียบร้อย");
  } catch (error: any) {
    toast.error(error.message || "Failed to find critical path");
  } finally {
    findingPath.value = false;
  }
};

const goToNextStep = () => {
  router.push(
    `/projects/${route.params.id}/versions/${route.params.versionId}/fixtures`
  );
};

const goToPrevStep = () => {
  router.push(
    `/projects/${route.params.id}/versions/${route.params.versionId}/upload`
  );
};

const goBack = () => {
  router.push(`/projects/${route.params.id}`);
};

// Blueprint methods
const loadBlueprints = async () => {
  try {
    const versionId = parseInt(route.params.versionId as string);
    blueprints.value = await documentsApi.listByVersion(versionId);
    // Auto-select all blueprints if available
    if (blueprints.value.length > 0 && selectedBlueprints.value.length === 0) {
      selectedBlueprints.value = [...blueprints.value];
    }
  } catch (error: any) {
    console.error("Failed to load blueprints from API:", error);
    blueprints.value = [];
  }
};

const isBlueprintSelected = (blueprint: any) => {
  return selectedBlueprints.value.some((bp) => bp.id === blueprint.id);
};

const getBlueprintLayerNumber = (blueprint: any) => {
  const index = selectedBlueprints.value.findIndex(
    (bp) => bp.id === blueprint.id
  );
  return index >= 0 ? index + 1 : "";
};

const toggleBlueprint = (blueprint: any) => {
  const index = selectedBlueprints.value.findIndex(
    (bp) => bp.id === blueprint.id
  );
  if (index >= 0) {
    // Deselect
    selectedBlueprints.value.splice(index, 1);
    toast.success(`เลิกเลือก: ${blueprint.floorText}`);
  } else {
    // Select
    selectedBlueprints.value.push(blueprint);
    toast.success(`เลือก Blueprint: ${blueprint.floorText}`);
  }
};

// Load data on mount
onMounted(async () => {
  // Load version from database first (must be first!)
  await loadVersion();

  // Then load network/fixtures from version snapshot
  await loadNetworkFromVersion();
  await loadFixturesFromVersion();

  // Load blueprints
  await loadBlueprints();

  // Set current step in workflow
  workflowStore.setCurrentStep('versionNetwork');

  console.log("✅ All data loaded", {
    hasNetworkData: !!networkData.value,
    networkNodes: networkData.value?.nodes?.length || 0,
    networkPipes: networkData.value?.pipes?.length || 0
  });
});

// Define page meta for layout
definePageMeta({
  layout: "dashboard"
});
</script>
