<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Version Steps Indicator -->
    <VersionSteps :version-id="versionId" />

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">
                  Fixtures & Pipe Loading
                </h1>
                <p class="mt-1 text-sm text-gray-600">
                  วิเคราะห์ FU load ของแต่ละเส้นท่อ
                </p>
              </div>
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

        <!-- Loading State -->
        <div
          v-if="loading"
          class="bg-white rounded-lg shadow-sm p-8 text-center"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>

        <!-- No Network Warning -->
        <div
          v-else-if="!networkData || !networkData.pipes || networkData.pipes.length === 0"
          class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center"
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p class="font-medium text-yellow-900">ยังไม่มีข้อมูล Network</p>
          <p class="text-sm text-yellow-700 mt-1">
            กรุณาสร้าง Network ที่
            <button
              @click="goToPrevStep"
              class="text-blue-600 underline hover:text-blue-700"
            >
              Step: Network
            </button>
          </p>
        </div>

        <!-- Pipe FU Loading Analysis -->
        <div v-else class="space-y-6">
          <!-- Overall Summary -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                สรุป FU Load ทั้งหมด
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-orange-50 rounded-lg p-4">
                <p class="text-xs text-orange-700 mb-1">ท่อทั้งหมด</p>
                <p class="text-2xl font-bold text-orange-900">
                  {{ criticalPathPipeLoads.length + branchPipeLoads.length }}
                </p>
              </div>
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-xs text-blue-700 mb-1">Critical Path</p>
                <p class="text-2xl font-bold text-blue-900">
                  {{ criticalPathPipeLoads.length }}
                </p>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <p class="text-xs text-green-700 mb-1">ท่อสาขา</p>
                <p class="text-2xl font-bold text-green-900">
                  {{ branchPipeLoads.length }}
                </p>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <p class="text-xs text-purple-700 mb-1">FU รวมสูงสุด</p>
                <p class="text-2xl font-bold text-purple-900">
                  {{ maxFULoad }} FU
                </p>
              </div>
            </div>
          </div>

          <!-- Critical Path Pipes -->
          <div
            v-if="criticalPathPipes.length > 0"
            class="bg-white rounded-lg shadow-sm p-6"
          >
            <div class="flex items-center gap-2 mb-4">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h3 class="text-lg font-medium text-gray-900">
                Critical Path - เส้นท่อหลัก
              </h3>
            </div>
            <div class="space-y-4">
              <div
                v-for="pipeLoad in criticalPathPipeLoads"
                :key="pipeLoad.pipe.id"
                class="border border-orange-200 rounded-lg p-4 bg-orange-50"
              >
                <PipeFUCard :pipe-load="pipeLoad" />
              </div>
            </div>
          </div>

          <!-- Branch Pipes -->
          <div
            v-if="branchPipes.length > 0"
            class="bg-white rounded-lg shadow-sm p-6"
          >
            <div class="flex items-center gap-2 mb-4">
              <svg
                class="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 class="text-lg font-medium text-gray-900">
                Branch Pipes - เส้นท่อสาขา
              </h3>
            </div>
            <div class="space-y-4">
              <div
                v-for="pipeLoad in branchPipeLoads"
                :key="pipeLoad.pipe.id"
                class="border border-green-200 rounded-lg p-4 bg-green-50"
              >
                <PipeFUCard :pipe-load="pipeLoad" />
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div
          v-if="networkData && networkData.pipes && networkData.pipes.length > 0"
          class="mt-6 flex gap-3"
        >
          <BackButton @click="goToPrevStep" />
          <NextStepButton @click="goToNextStep" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import VersionSteps from "~/components/workflow/VersionSteps.vue";
import PipeFUCard from "~/components/calculator/PipeFUCard.vue";
import NextStepButton from "~/components/navigation/NextStepButton.vue";
import BackButton from "~/components/navigation/BackButton.vue";
import { versionsApi } from "~/composables/useApi";
import { useWorkflowStore } from "~/stores/workflowStore";
import { calculateUPCGPM } from "~/shared/constants/hunterCurve.ts";

const route = useRoute();
const router = useRouter();
const toast = useToast();
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
const loading = ref(true);

console.log("🚀 [Step 4 - V2] Fixtures page mounted");
console.log("   - Project ID:", route.params.id);
console.log("   - Version ID:", route.params.versionId);

// Computed
const criticalPathPipes = computed(() => {
  if (!networkData.value?.pipes) {
    console.log("⚠️ No pipes in network");
    return [];
  }

  const critical = networkData.value.pipes.filter(
    (p: any) => p.isCriticalPath === true
  );

  console.log(
    `🔥 Network pipes: ${networkData.value.pipes.length}, Critical Path Pipes: ${critical.length}`
  );

  return critical;
});

const branchPipes = computed(() => {
  if (!networkData.value?.pipes) {
    console.log("⚠️ No pipes in network");
    return [];
  }

  const branch = networkData.value.pipes.filter(
    (p: any) => p.isCriticalPath !== true
  );
  console.log(`🌿 Branch Pipes: ${branch.length} pipes`);
  return branch;
});

const criticalPathPipeLoads = computed(() => {
  if (criticalPathPipes.value.length === 0) return [];

  // Filter pipes that have valid nodes (both source and target exist)
  const validPipes = criticalPathPipes.value.filter((pipe: any) => {
    const sourceExists = networkData.value?.nodes?.some(
      (n: any) => n.id === pipe.sourceNodeId
    );
    const targetExists = networkData.value?.nodes?.some(
      (n: any) => n.id === pipe.targetNodeId
    );

    if (!sourceExists || !targetExists) {
      console.log(
        `⚠️ Skipping pipe ${pipe.id}: source (${pipe.sourceNodeId}) exists: ${sourceExists}, target (${pipe.targetNodeId}) exists: ${targetExists}`
      );
      return false;
    }

    return true;
  });

  console.log(
    `📊 Filtered ${validPipes.length} valid pipes from ${criticalPathPipes.value.length} critical pipes`
  );

  const sortedPipes = sortPipesFromEndToStart(validPipes);
  console.log(
    `📊 Critical Path Pipe Loads: ${sortedPipes.length} pipes (input: ${validPipes.length})`
  );

  return sortedPipes.map((pipe: any) => calculatePipeFULoad(pipe));
});

const branchPipeLoads = computed(() => {
  if (branchPipes.value.length === 0) return [];

  // Filter pipes that have valid nodes (both source and target exist)
  const validPipes = branchPipes.value.filter((pipe: any) => {
    const sourceExists = networkData.value?.nodes?.some(
      (n: any) => n.id === pipe.sourceNodeId
    );
    const targetExists = networkData.value?.nodes?.some(
      (n: any) => n.id === pipe.targetNodeId
    );

    if (!sourceExists || !targetExists) {
      console.log(
        `⚠️ Skipping pipe ${pipe.id}: source (${pipe.sourceNodeId}) exists: ${sourceExists}, target (${pipe.targetNodeId}) exists: ${targetExists}`
      );
      return false;
    }

    return true;
  });

  console.log(
    `📊 Filtered ${validPipes.length} valid pipes from ${branchPipes.value.length} branch pipes`
  );

  const sortedPipes = sortPipesFromEndToStart(validPipes);
  console.log(
    `📊 Branch Pipe Loads: ${sortedPipes.length} pipes (input: ${validPipes.length})`
  );

  return sortedPipes.map((pipe: any) => calculatePipeFULoad(pipe));
});

// Prepare GPM data for Step 5
const pipeGPMData = computed(() => {
  const criticalPipes = criticalPathPipeLoads.value;
  const branchP = branchPipeLoads.value;
  const allPipes = [...criticalPipes, ...branchP];

  console.log(`📊 [Step 4 - V2] pipeGPMData computed called:`);
  console.log(`   - Critical path pipes: ${criticalPipes.length}`);
  console.log(`   - Branch pipes: ${branchP.length}`);
  console.log(`   - Total pipes: ${allPipes.length}`);

  if (allPipes.length === 0) {
    console.warn(`⚠️ [Step 4 - V2] No pipes to prepare!`);
    return [];
  }

  const result = allPipes.map((pipeLoad: any) => ({
    pipeId: pipeLoad.pipe.id,
    fromNode: pipeLoad.fromNode,
    toNode: pipeLoad.toNode,
    totalFU: pipeLoad.totalFU,
    totalGPM: pipeLoad.totalGPM,
    hunterGPM: pipeLoad.hunterGPM,
    hoseBibbGPM: pipeLoad.hoseBibbGPM,
    isCriticalPath: pipeLoad.pipe.isCriticalPath
  }));

  console.log(`✅ [Step 4 - V2] Prepared ${result.length} pipe entries`);

  return result;
});

// Watch pipeGPMData and save to version.snapshotFixtures
watch(
  pipeGPMData,
  (newData) => {
    console.log(`👀 [Step 4 - V2] pipeGPMData watch triggered:`);
    console.log(`   - newData length: ${newData?.length || 0}`);

    if (newData && newData.length > 0) {
      saveFixturesSnapshot(newData);
    }
  },
  { deep: true }
);

// Sort pipes from end (fixtures) to start (source)
const sortPipesFromEndToStart = (pipes: any[]) => {
  if (!pipes || pipes.length === 0) {
    console.log("⚠️ sortPipesFromEndToStart: No pipes to sort");
    return [];
  }

  console.log(`🔄 sortPipesFromEndToStart: Input ${pipes.length} pipes`);

  // Build adjacency list for reverse traversal
  const pipeMap = new Map<number, any[]>();
  pipes.forEach((pipe) => {
    pipeMap.set(
      pipe.targetNodeId,
      (pipeMap.get(pipe.targetNodeId) || []).concat(pipe)
    );
  });

  // Find end pipes (pipes that are not source of any other pipe in this group)
  const sourceNodeIds = new Set(pipes.map((p) => p.sourceNodeId));
  const endPipes = pipes.filter((p) => !sourceNodeIds.has(p.targetNodeId));

  console.log(`📍 Found ${endPipes.length} end pipes`);

  if (endPipes.length === 0) {
    console.log("⚠️ Cannot determine end pipes, returning as-is");
    return pipes;
  }

  // Sort each chain starting from end pipes
  const sorted: any[] = [];
  const visited = new Set<number>();

  const traverseFromEnd = (pipe: any) => {
    if (visited.has(pipe.id)) {
      return;
    }
    visited.add(pipe.id);
    sorted.push(pipe);

    const upstreamPipes = pipes.filter(
      (p) => p.targetNodeId === pipe.sourceNodeId
    );
    upstreamPipes.forEach((upstreamPipe) => traverseFromEnd(upstreamPipe));
  };

  endPipes.forEach((endPipe) => {
    if (!visited.has(endPipe.id)) {
      traverseFromEnd(endPipe);
    }
  });

  pipes.forEach((pipe) => {
    if (!visited.has(pipe.id)) {
      sorted.push(pipe);
    }
  });

  const uniqueSorted = Array.from(
    new Map(sorted.map((p) => [p.id, p])).values()
  );

  return uniqueSorted;
};

const maxFULoad = computed(() => {
  const allLoads = [...criticalPathPipeLoads.value, ...branchPipeLoads.value];
  if (allLoads.length === 0) return 0;
  return Math.max(...allLoads.map((load) => load.totalFU));
});

// Methods
const loadVersion = async () => {
  loading.value = true;
  try {
    const versionId = parseInt(route.params.versionId as string);
    // Load version directly from database
    const data = await versionsApi.get(versionId);

    if (data) {
      version.value = data;
      console.log('✅ Version loaded:', {
        id: data.id,
        name: data.name,
        hasSnapshotNetwork: !!data.snapshotNetwork
      });
    }
  } catch (err: any) {
    console.error('Failed to load version:', err);
    toast.error('ไม่สามารถโหลด Version ได้');
  } finally {
    loading.value = false;
  }
};

const loadNetworkFromVersion = () => {
  loading.value = true;
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
  } finally {
    loading.value = false;
  }
};

const saveFixturesSnapshot = async (fixturesData: any[]) => {
  try {
    const versionId = parseInt(route.params.versionId as string);

    // Create fixtures snapshot structure
    const snapshotFixtures = {
      nodes: networkData.value?.nodes || [],
      pipes: fixturesData
    };

    await versionsApi.update(versionId, {
      snapshotFixtures: JSON.stringify(snapshotFixtures)
    });

    console.log('✅ Fixtures snapshot saved');
  } catch (error) {
    console.error('Failed to save fixtures snapshot:', error);
  }
};

const calculatePipeFULoad = (pipe: any) => {
  const { fixtures: pipeFixtures, nodes: pipeNodes } =
    getFixturesAndNodesForPipe(pipe);
  const fixtureGroups = groupFixturesByType(pipeFixtures);

  const totalFU = pipeFixtures.reduce(
    (sum, f) => sum + getStandardFU(f.type) * (Number(f.quantity) || 1),
    0
  );

  let flushTankFU = 0;
  let flushValveFU = 0;
  let hoseBibbCount = 0;

  pipeFixtures.forEach((fixture: any) => {
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

  const upcResult = calculateUPCGPM(flushTankFU, flushValveFU);
  const gpmFromWC = upcResult.totalGPM;
  const gpmFromHoseBibb = hoseBibbCount * 5;
  const totalGPM = gpmFromWC + gpmFromHoseBibb;

  return {
    pipe,
    fromNode: getNodeLabel(pipe.sourceNodeId),
    toNode: getNodeLabel(pipe.targetNodeId),
    fixtures: pipeFixtures,
    nodes: pipeNodes,
    fixtureGroups,
    totalFU,
    totalGPM,
    hunterGPM: gpmFromWC,
    hoseBibbGPM: gpmFromHoseBibb,
    length: pipe.length
  };
};

const getFixturesAndNodesForPipe = (pipe: any) => {
  if (!networkData.value?.nodes || !networkData.value?.pipes) {
    return { fixtures: [], nodes: [] };
  }

  const targetNodeId = pipe.targetNodeId;
  const connectedFixtures: any[] = [];
  const connectedNodes: any[] = [];
  const visitedNodes = new Set<number>();
  const visitedPipes = new Set<number>();

  const traceDownstream = (nodeId: number) => {
    if (visitedNodes.has(nodeId)) {
      return;
    }
    visitedNodes.add(nodeId);

    const node = networkData.value.nodes.find((n: any) => n.id === nodeId);
    if (!node) {
      return;
    }

    connectedNodes.push({
      id: node.id,
      label: node.label || `Node ${node.id}`,
      type: node.type
    });

    if (node.type === "FIXTURE" && node.fixtures && node.fixtures.length > 0) {
      node.fixtures.forEach((fixture: any) => {
        connectedFixtures.push({
          ...fixture,
          nodeName: node.label || `Node ${node.id}`
        });
      });
    }

    const outgoingPipes = networkData.value.pipes.filter(
      (p: any) => p.sourceNodeId === nodeId
    );

    outgoingPipes.forEach((nextPipe: any) => {
      if (!visitedPipes.has(nextPipe.id)) {
        visitedPipes.add(nextPipe.id);
        traceDownstream(nextPipe.targetNodeId);
      }
    });
  };

  traceDownstream(targetNodeId);

  return { fixtures: connectedFixtures, nodes: connectedNodes };
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

const groupFixturesByType = (fixtures: any[]) => {
  const groups: Record<string, any> = {};

  fixtures.forEach((fixture) => {
    if (!groups[fixture.type]) {
      const standardFU = getStandardFU(fixture.type);
      groups[fixture.type] = {
        type: fixture.type,
        count: 0,
        fuPerUnit: standardFU,
        totalFU: 0,
        fixtures: []
      };
    }
    groups[fixture.type].count += fixture.quantity || 1;
    groups[fixture.type].totalFU +=
      getStandardFU(fixture.type) * (fixture.quantity || 1);
    groups[fixture.type].fixtures.push(fixture);
  });

  return Object.values(groups);
};

const getNodeLabel = (nodeId: number) => {
  if (!networkData.value?.nodes) {
    return `Node ${nodeId}`;
  }

  const node = networkData.value.nodes.find((n: any) => n.id === nodeId);

  if (!node) {
    return `Node ${nodeId}`;
  }

  return node?.label || `Node ${nodeId} (${node.type})`;
};

const goToNextStep = () => {
  router.push(`/projects/${route.params.id}/versions/${route.params.versionId}/calculation`);
};

const goToPrevStep = () => {
  router.push(`/projects/${route.params.id}/versions/${route.params.versionId}/network`);
};

const goBack = () => {
  router.push(`/projects/${route.params.id}`);
};

// Load data on mount
onMounted(async () => {
  console.log("🚀 [Step 4 - V2] onMounted called");

  // Load version from database
  await loadVersion();

  // Load network from version snapshot
  loadNetworkFromVersion();

  // Set current step in workflow
  workflowStore.setCurrentStep('versionFixtures');

  console.log("✅ [Step 4 - V2] Data loaded");
});

definePageMeta({
  layout: "dashboard"
});
</script>
