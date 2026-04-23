<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-medium text-gray-900">Hybrid Pipe Sizing</h3>
        <p class="text-sm text-gray-600 mt-1">
          เลือกขนาดท่อโดยใช้ตาราง Fixture Units (Private Use)
          สำหรับท่อในห้องน้ำและห้องครัว
        </p>
      </div>
    </div>

    <!-- Results Display -->
    <div v-if="hybridResult" class="space-y-4">
      <!-- Fixture Branch Pipes by Node (v2 mode: from hybridResult.fixtureNodes, v1 mode: from fixtureNodesData) -->
      <div class="rounded-lg bg-purple-50 border border-purple-200 p-4">
        <h5 class="text-sm font-bold text-purple-900 mb-3 flex items-center">
          <svg
            class="h-4 w-4 mr-2"
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
          ท่อเข้าสุขภัณฑ์แต่ละห้อง (Fixture Branch Pipes by Node)
        </h5>

        <!-- Group by Node -->
        <div class="space-y-3">
          <div
            v-for="node in (hybridResult.fixtureNodes || fixtureNodesData)"
            :key="node.id"
            class="bg-white rounded-lg border border-purple-200 overflow-hidden"
          >
            <!-- Node Header -->
            <div
              class="bg-purple-100 px-3 py-2 flex items-center justify-between"
            >
              <div class="flex items-center space-x-2">
                <svg
                  class="h-4 w-4 text-purple-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span class="font-bold text-purple-900">{{ node.name }}</span>
                <span
                  class="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full"
                >
                  {{ node.fixtures.length }} สุขภัณฑ์
                </span>
              </div>
            </div>

            <!-- Fixtures List -->
            <div class="p-3 space-y-2">
              <div
                v-for="fixture in node.fixtures"
                :key="fixture.name"
                class="flex items-center justify-between bg-purple-50 rounded-lg p-2 border border-purple-100"
              >
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900 text-sm">{{
                      fixture.name
                    }}</span>
                  </div>
                </div>

                <div class="flex items-center space-x-2 text-sm">
                  <div class="font-bold text-blue-600">{{ fixture.size }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-3 pt-3 border-t border-purple-200 text-xs text-purple-700"
        >
          <p class="flex items-start">
            <svg
              class="h-4 w-4 mr-1 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              ><strong>อ้างอิง:</strong> ตาราง Fixture Units (Private Use)
              สำหรับที่พักอาศัย ≤ 2 ชั้น (MOCK DATA)</span
            >
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-gray-500">
      <svg
        class="h-12 w-12 mx-auto mb-3 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p class="text-sm">คลิกปุ่ม "คำนวณเปรียบเทียบ" เพื่อดูผลการเปรียบเทียบ</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { hybridSizingApi, networksApi } = useApi();

const props = defineProps<{
  pipeId?: number;        // v1 mode
  networkId?: number;      // v1 mode
  networkData?: any;       // v2 mode: network data from version snapshot
  versionId?: number;      // v2 mode
  systemType?: "FLUSH_TANK" | "FLUSH_VALVE";
}>();

const emit = defineEmits<{
  select: [method: "table26" | "hazenWilliams", result: any];
  apply: [method: "table26" | "hazenWilliams", sizeMM: number];
  sizingChange: [];
}>();

const toast = useToast();

// State
const calculating = ref(false);
const selectedMethod = ref<"table26" | "hazenWilliams" | null>(null);
const hybridResult = ref<any>(null);
const networkNodes = ref<any[]>([]);
const loadingNodes = ref(false);

// Computed: Detect which mode we're in
const isV2Mode = computed(() => {
  return !!(props.networkData && props.versionId);
});

console.log('[HybridPipeSizing] Component mounted/updated:', {
  networkId: props.networkId,
  versionId: props.versionId,
  hasNetworkData: !!props.networkData,
  isV2Mode: isV2Mode.value
});

// Pipe size mapping from Fixture Units table
const getPipeSize = (fixtureType: string): string => {
  const pipeSizes: Record<string, string> = {
    WC_TANK: '15mm (1/2")',
    WC_VALVE: '25mm (1")',
    LAVATORY: '15mm (1/2")',
    SHOWER: '15mm (1/2")',
    BATHTUB: '15mm (1/2")',
    KITCHEN_SINK: '15mm (1/2")',
    LAUNDRY_TRAY: '15mm (1/2")',
    DISHWASHER: '15mm (1/2")',
    HOSE_BIBB: '15mm (1/2")'
  };

  return pipeSizes[fixtureType] || '15mm (1/2")';
};

// Transform network nodes to fixture nodes format
const transformNodesToFixtureNodes = (nodes: any[]) => {
  return nodes
    .filter((node) => node.fixtures && node.fixtures.length > 0)
    .map((node) => ({
      id: node.id,
      name: node.label || `Node ${node.id}`,
      fixtures: node.fixtures.map((fixture: any) => ({
        name: getFixtureDisplayName(fixture.type),
        size: getPipeSize(fixture.type)
      }))
    }));
};

// Computed: fixture nodes data (from real network)
const fixtureNodesData = computed(() => {
  if (!networkNodes.value || networkNodes.value.length === 0) {
    return [];
  }
  return transformNodesToFixtureNodes(networkNodes.value);
});

// Method: load network nodes (supports both v1 and v2 modes)
const loadNetworkNodes = async () => {
  try {
    loadingNodes.value = true;

    if (isV2Mode.value && props.networkData) {
      // v2 mode: Load from networkData prop
      console.log('[HybridPipeSizing V2] Loading nodes from networkData');
      networkNodes.value = props.networkData.nodes || [];
    } else if (props.networkId) {
      // v1 mode: Load from API
      console.log('[HybridPipeSizing V1] Loading nodes from API');
      const nodes = await networksApi.getNodes(props.networkId);
      networkNodes.value = nodes;
    }
  } catch (error: any) {
    console.error("Failed to load network nodes:", error);
  } finally {
    loadingNodes.value = false;
  }
};

// Computed
const canCalculate = computed(() => {
  return props.pipeId || props.networkId || isV2Mode.value;
});

// Methods
const calculateHybrid = async () => {
  if (!canCalculate.value) return;

  calculating.value = true;

  try {
    let result: any;

    if (isV2Mode.value && props.networkData) {
      // v2 mode: Calculate locally from networkData (no API call)
      console.log('[HybridPipeSizing V2] Calculating from networkData');

      // Get fixture nodes from networkData
      const nodesWithFixtures = (props.networkData.nodes || []).filter((node: any) =>
        node.fixtures && node.fixtures.length > 0
      );

      if (nodesWithFixtures.length === 0) {
        hybridResult.value = null;
        toast.info("ไม่พบข้อมูลสุขภัณฑ์");
        calculating.value = false;
        return;
      }

      // Transform to fixture nodes format for display
      const fixtureNodes = transformNodesToFixtureNodes(nodesWithFixtures);

      // Create mock result for v2 mode (display fixture nodes only)
      result = {
        fixtureNodes: fixtureNodes,
        tableSizing: {
          mm: 15,
          inches: '1/2"',
          method: 'table26'
        },
        formulaSizing: {
          mm: 15,
          inches: '1/2"',
          method: 'hazenWilliams'
        },
        comparison: {
          agreement: true,
          difference: 0
        }
      };

      console.log('[HybridPipeSizing V2] Created result from networkData:', fixtureNodes.length, 'nodes with fixtures');

    } else if (props.pipeId) {
      // v1 mode: Calculate for single pipe
      result = await hybridSizingApi.calculatePipe(props.pipeId, {
        systemType: props.systemType || "FLUSH_TANK"
      });
    } else if (props.networkId) {
      // v1 mode: Calculate for all pipes in network and show first result
      const results = await hybridSizingApi.calculateNetwork(props.networkId, {
        systemType: props.systemType || "FLUSH_TANK"
      });
      result = results[0]; // Show first pipe as example
    } else {
      hybridResult.value = null;
      calculating.value = false;
      return;
    }

    hybridResult.value = result;

    // Auto-select recommended method (prefer formula if larger)
    selectedMethod.value = result.comparison?.agreement
      ? "table26"
      : result.formulaSizing?.mm > result.tableSizing?.mm
        ? "hazenWilliams"
        : "table26";

    emitSelection();
    emit("sizingChange");

    if (isV2Mode.value) {
      toast.success(`โหลดข้อมูลสุขภัณฑ์ ${result.fixtureNodes?.length || 0} ห้องเรียบร้อย`);
    } else {
      toast.success("คำนวณเสร็จสิ้น");
    }
  } catch (error: any) {
    console.error("[HybridPipeSizing] Error:", error);
    toast.error(error.message || "คำนวณไม่สำเร็จ");
  } finally {
    calculating.value = false;
  }
};

const getVelocityColor = (velocity: number) => {
  if (velocity < 1.2) return "text-yellow-600";
  if (velocity > 2.4) return "text-red-600";
  return "text-green-600";
};

const getFixtureDisplayName = (type: string): string => {
  const fixtureNames: Record<string, string> = {
    LAVATORY: "อ่างล้างหน้า (LAV)",
    WC_TANK: "ชักโครกแบบ Flush Tank (WC Flush Tank)",
    WC_VALVE: "ชักโครกแบบ Flush Valve (WC Flush Valve)",
    SHOWER: "ฝักบัว (Shower)",
    BATHTUB: "อ่างอาบน้ำ (Bathtub)",
    KITCHEN_SINK: "อ่างล้างจาน (Kitchen Sink)",
    LAUNDRY_TRAY: "อ่างซักผ้า (Laundry Tray)",
    HOSE_BIBB: "ก๊อกสนาม (Hose Bibb)",
    WATER_HEATER: "ถังน้ำร้อน (Water Heater)"
  };

  return fixtureNames[type] || type;
};

const emitSelection = () => {
  if (!selectedMethod.value || !hybridResult.value) return;

  const result =
    selectedMethod.value === "table26"
      ? hybridResult.value.tableSizing
      : hybridResult.value.formulaSizing;

  emit("select", selectedMethod.value, result);
};

const applySelected = () => {
  if (!selectedMethod.value || !hybridResult.value) return;

  const sizeMM =
    selectedMethod.value === "table26"
      ? hybridResult.value.tableSizing.mm
      : hybridResult.value.formulaSizing.mm;

  emit("apply", selectedMethod.value, sizeMM);
  toast.success(`ใช้ขนาดท่อ ${sizeMM}mm เรียบร้อย`);
};

// Auto-calculate on mount if props available
onMounted(() => {
  // Load network nodes first
  loadNetworkNodes();

  // Then calculate if needed
  if (canCalculate.value) {
    calculateHybrid();
  }
});
</script>
