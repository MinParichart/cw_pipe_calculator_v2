<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">
            Fixtures & Pipe Loading
          </h1>
          <p class="mt-1 text-sm text-gray-600">
            วิเคราะห์ FU load ของแต่ละเส้นท่อ
          </p>
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
          v-else-if="!network || !network.pipes || network.pipes.length === 0"
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
              Step 3: Network
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
          v-if="network && network.pipes && network.pipes.length > 0"
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
import PipeFUCard from "~/components/calculator/PipeFUCard.vue";
import BackButton from "~/components/navigation/BackButton.vue";
import NextStepButton from "~/components/navigation/NextStepButton.vue";
import { networksApi } from "~/composables/useApi";
import { calculateUPCGPM } from "~/shared/constants/hunterCurve";
import { useWorkflowStore } from "~/stores/workflowStore";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const workflowStore = useWorkflowStore();

// State
const projectId = computed(() => parseInt(route.params.id as string));
const network = ref<any>(null);
const loading = ref(true);

console.log("🚀 [Step 4] Fixtures page mounted");
console.log("   - Project ID:", projectId.value);
console.log("   - Route params.id:", route.params.id);

// Computed
const criticalPathPipes = computed(() => {
  if (!network.value?.pipes) {
    console.log("⚠️ No pipes in network");
    return [];
  }

  const critical = network.value.pipes.filter(
    (p: any) => p.isCriticalPath === true
  );

  // Debug: Check for duplicate pipe IDs
  const pipeIds = network.value.pipes.map((p: any) => p.id);
  const uniquePipeIds = new Set(pipeIds);
  if (pipeIds.length !== uniquePipeIds.size) {
    console.log(`⚠️ DUPLICATE PIPE IDS DETECTED!`);
    console.log(`   Total pipes: ${pipeIds.length}`);
    console.log(`   Unique pipes: ${uniquePipeIds.size}`);
    console.log(`   Duplicates: ${pipeIds.length - uniquePipeIds.size}`);

    // Show which IDs are duplicated
    const duplicates = pipeIds.filter(
      (id, index) => pipeIds.indexOf(id) !== index
    );
    console.log(`   Duplicate pipe IDs:`, [...new Set(duplicates)]);
  }

  console.log(
    `🔥 Network pipes: ${network.value.pipes.length}, Critical Path Pipes: ${critical.length}`
  );

  return critical;
});

const branchPipes = computed(() => {
  if (!network.value?.pipes) {
    console.log("⚠️ No pipes in network");
    return [];
  }

  const branch = network.value.pipes.filter(
    (p: any) => p.isCriticalPath !== true
  );
  console.log(`🌿 Branch Pipes: ${branch.length} pipes`);
  return branch;
});

const criticalPathPipeLoads = computed(() => {
  if (criticalPathPipes.value.length === 0) return [];

  // Filter pipes that have valid nodes (both source and target exist)
  const validPipes = criticalPathPipes.value.filter((pipe: any) => {
    const sourceExists = network.value?.nodes?.some(
      (n: any) => n.id === pipe.sourceNodeId
    );
    const targetExists = network.value?.nodes?.some(
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
    const sourceExists = network.value?.nodes?.some(
      (n: any) => n.id === pipe.sourceNodeId
    );
    const targetExists = network.value?.nodes?.some(
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

// 🔥 NEW: Prepare GPM data for Step 5
const pipeGPMData = computed(() => {
  const criticalPipes = criticalPathPipeLoads.value;
  const branchP = branchPipeLoads.value;
  const allPipes = [...criticalPipes, ...branchP];

  console.log(`📊 [Step 4] pipeGPMData computed called:`);
  console.log(`   - Critical path pipes: ${criticalPipes.length}`);
  console.log(`   - Branch pipes: ${branchP.length}`);
  console.log(`   - Total pipes: ${allPipes.length}`);

  if (allPipes.length === 0) {
    console.warn(`⚠️ [Step 4] No pipes to prepare!`);
    return [];
  }

  const result = allPipes.map((pipeLoad: any) => ({
    pipeId: pipeLoad.pipe.id,
    fromNode: pipeLoad.fromNode,
    toNode: pipeLoad.toNode,
    totalFU: pipeLoad.totalFU,
    totalGPM: pipeLoad.totalGPM,
    hunterGPM: pipeLoad.hunterGPM, // 🔥 เพิ่มตัวนี้
    hoseBibbGPM: pipeLoad.hoseBibbGPM, // 🔥 เพิ่มตัวนี้
    isCriticalPath: pipeLoad.pipe.isCriticalPath
  }));

  console.log(`✅ [Step 4] Prepared ${result.length} pipe entries`);

  // Show sample data
  if (result.length > 0) {
    console.log(`📋 [Step 4] Sample pipe data:`, {
      pipeId: result[0].pipeId,
      totalFU: result[0].totalFU,
      totalGPM: result[0].totalGPM
    });
  }

  return result;
});

// 🔥 FIX: Watch pipeGPMData and save to localStorage when data is ready
watch(
  pipeGPMData,
  (newData) => {
    console.log(`👀 [Step 4] pipeGPMData watch triggered:`);
    console.log(`   - newData length: ${newData?.length || 0}`);
    console.log(`   - process.client: ${process.client}`);

    // Check if running on client-side AND data exists
    if (process.client && newData && newData.length > 0) {
      const storageKey = `pipeGPMData_${projectId.value}`;
      localStorage.setItem(storageKey, JSON.stringify(newData));
      console.log(
        `💾 [Step 4] Saved pipeGPMData to localStorage: ${newData.length} pipes`
      );
      console.log(`💾 [Step 4] Storage key: ${storageKey}`);
    } else {
      console.log(
        `⏳ [Step 4] Watch triggered but no data to save (length: ${newData?.length || 0})`
      );
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
    // Fallback: return as-is if we can't determine ends
    console.log("⚠️ Cannot determine end pipes, returning as-is");
    return pipes;
  }

  // Sort each chain starting from end pipes
  const sorted: any[] = [];
  const visited = new Set<number>();

  const traverseFromEnd = (pipe: any) => {
    if (visited.has(pipe.id)) {
      console.log(`⚠️ Already visited pipe ${pipe.id}, skipping`);
      return;
    }
    visited.add(pipe.id);

    sorted.push(pipe);

    // Find pipe that starts from this pipe's source (go upstream)
    const upstreamPipes = pipes.filter(
      (p) => p.targetNodeId === pipe.sourceNodeId
    );
    upstreamPipes.forEach((upstreamPipe) => traverseFromEnd(upstreamPipe));
  };

  // Start from each end pipe
  endPipes.forEach((endPipe) => {
    if (!visited.has(endPipe.id)) {
      traverseFromEnd(endPipe);
    }
  });

  // Add any remaining pipes (shouldn't happen, but just in case)
  pipes.forEach((pipe) => {
    if (!visited.has(pipe.id)) {
      console.log(`⚠️ Unvisited pipe ${pipe.id}, adding to end`);
      sorted.push(pipe);
    }
  });

  console.log(`✅ Sorted ${sorted.length} pipes (visited: ${visited.size})`);

  // Ensure no duplicates
  const uniqueSorted = Array.from(
    new Map(sorted.map((p) => [p.id, p])).values()
  );
  if (uniqueSorted.length !== sorted.length) {
    console.log(
      `⚠️ Removed ${sorted.length - uniqueSorted.length} duplicate pipes`
    );
  }

  return uniqueSorted;
};

const maxFULoad = computed(() => {
  const allLoads = [...criticalPathPipeLoads.value, ...branchPipeLoads.value];
  if (allLoads.length === 0) return 0;
  return Math.max(...allLoads.map((load) => load.totalFU));
});

// Methods
const loadNetwork = async () => {
  try {
    const currentNetwork = await networksApi.getCurrent(projectId.value);

    // Debug: Log network data
    console.log("📊 Network loaded:", {
      hasNetwork: !!currentNetwork,
      networkId: currentNetwork?.id,
      nodesCount: currentNetwork?.nodes?.length || 0,
      pipesCount: currentNetwork?.pipes?.length || 0,
      sampleNodes:
        currentNetwork?.nodes?.slice(0, 3).map((n: any) => ({
          id: n.id,
          label: n.label,
          type: n.type
        })) || [],
      samplePipes:
        currentNetwork?.pipes?.slice(0, 3).map((p: any) => ({
          id: p.id,
          sourceNodeId: p.sourceNodeId,
          targetNodeId: p.targetNodeId,
          isCriticalPath: p.isCriticalPath
        })) || []
    });

    network.value = currentNetwork;
  } catch (error: any) {
    console.error("Failed to load network:", error);
    network.value = null;
  }
};

// Calculate FU load for a specific pipe
// Calculate FU load for a specific pipe
// Calculate FU load for a specific pipe
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
    // บังคับแปลงเป็น Number และตัวพิมพ์ใหญ่เพื่อป้องกันบั๊ก
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
    hunterGPM: gpmFromWC, // 🔥 เพิ่มตัวนี้ (GPM จากตาราง Hunter เพียวๆ)
    hoseBibbGPM: gpmFromHoseBibb, // 🔥 เพิ่มตัวนี้ (GPM จาก HB เพียวๆ)
    length: pipe.length
  };
};

// Get fixtures and nodes that are connected to this pipe (directly or indirectly)
const getFixturesAndNodesForPipe = (pipe: any) => {
  if (!network.value?.nodes || !network.value?.pipes) {
    console.log(`⚠️ getFixturesAndNodesForPipe: No network data`);
    return { fixtures: [], nodes: [] };
  }

  const targetNodeId = pipe.targetNodeId;
  console.log(`  🔍 Tracing from targetNodeId: ${targetNodeId}`);

  const connectedFixtures: any[] = [];
  const connectedNodes: any[] = [];
  const visitedNodes = new Set<number>();
  const visitedPipes = new Set<number>();

  // Find all fixture nodes and nodes downstream from this pipe
  const traceDownstream = (nodeId: number) => {
    // Prevent infinite loops
    if (visitedNodes.has(nodeId)) {
      console.log(`    ⚠️ Already visited node ${nodeId}, skipping`);
      return;
    }
    visitedNodes.add(nodeId);

    const node = network.value.nodes.find((n: any) => n.id === nodeId);
    if (!node) {
      console.log(`    ⚠️ Node ${nodeId} not found in network`);
      return;
    }

    console.log(
      `    ✓ Found node ${nodeId}: ${node.label || "(no label)"} (${node.type})`
    );

    // Add this node to the list
    connectedNodes.push({
      id: node.id,
      label: node.label || `Node ${node.id}`,
      type: node.type
    });

    // If this is a fixture node, add its fixtures
    if (node.type === "FIXTURE" && node.fixtures && node.fixtures.length > 0) {
      console.log(`    ✓ Node has ${node.fixtures.length} fixtures`);
      node.fixtures.forEach((fixture: any) => {
        connectedFixtures.push({
          ...fixture,
          nodeName: node.label || `Node ${node.id}`
        });
      });
    } else if (node.type === "FIXTURE") {
      console.log(`    ⚠️ Node is FIXTURE type but has no fixtures`);
    }

    // Find all pipes that start from this node (outgoing pipes)
    const outgoingPipes = network.value.pipes.filter(
      (p: any) => p.sourceNodeId === nodeId
    );
    console.log(
      `    → Found ${outgoingPipes.length} outgoing pipes from node ${nodeId}`
    );

    outgoingPipes.forEach((nextPipe: any) => {
      // Prevent processing the same pipe twice
      if (!visitedPipes.has(nextPipe.id)) {
        visitedPipes.add(nextPipe.id);
        // Recursively trace from the target node of this pipe
        traceDownstream(nextPipe.targetNodeId);
      }
    });
  };

  // Start tracing from the target node of the current pipe
  traceDownstream(targetNodeId);

  console.log(
    `  ✓ Result: ${connectedFixtures.length} fixtures, ${connectedNodes.length} nodes`
  );

  return { fixtures: connectedFixtures, nodes: connectedNodes };
};

// Get standard FU value for fixture type
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

// Group fixtures by type
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

// Get node label
const getNodeLabel = (nodeId: number) => {
  if (!network.value?.nodes) {
    return `Node ${nodeId}`;
  }

  const node = network.value.nodes.find((n: any) => n.id === nodeId);

  if (!node) {
    // Silent warning - only log once per missing node
    return `Node ${nodeId}`;
  }

  return node?.label || `Node ${nodeId} (${node.type})`;
};

const goToNextStep = () => {
  router.push(`/projects/${route.params.id}/calculation`);
};

const goToPrevStep = () => {
  router.push(`/projects/${route.params.id}/network`);
};

// Load data on mount
onMounted(async () => {
  console.log("🚀 [Step 4] onMounted called, loading network...");
  loading.value = true;
  try {
    await loadNetwork();
    console.log("✅ [Step 4] Network loaded successfully");
    console.log(`   - Network exists: ${!!network.value}`);
    console.log(`   - Total pipes: ${network.value?.pipes?.length || 0}`);
    console.log(`   - Total nodes: ${network.value?.nodes?.length || 0}`);
  } finally {
    loading.value = false;
  }
  workflowStore.setCurrentStep("fixtures");
});

definePageMeta({
  layout: "dashboard"
});
</script>
