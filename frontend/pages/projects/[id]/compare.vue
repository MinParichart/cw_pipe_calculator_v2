<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center gap-4 mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">เปรียบเทียบ Version</h1>
              <p class="mt-1 text-sm text-gray-600">
                เลือก 2 Version เพื่อเปรียบเทียบ Network, Fixtures และ Calculation
              </p>
            </div>
          </div>
        </div>

        <!-- Version Selection -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">เลือก Version ที่ต้องการเปรียบเทียบ</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Version A -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Version A
              </label>
              <select
                v-model="selectedVersionA"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">เลือก Version...</option>
                <option
                  v-for="version in versions"
                  :key="version.id"
                  :value="version.id"
                >
                  {{ version.name || `Version ${version.versionNumber}` }}
                  ({{ formatDate(version.createdAt) }})
                </option>
              </select>
            </div>

            <!-- Version B -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Version B
              </label>
              <select
                v-model="selectedVersionB"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">เลือก Version...</option>
                <option
                  v-for="version in versions"
                  :key="version.id"
                  :value="version.id"
                >
                  {{ version.name || `Version ${version.versionNumber}` }}
                  ({{ formatDate(version.createdAt) }})
                </option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex gap-3">
            <button
              @click="compareVersions"
              :disabled="!selectedVersionA || !selectedVersionB || selectedVersionA === selectedVersionB"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              เปรียบเทียบ
            </button>
            <button
              @click="clearSelection"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ล้างค่า
            </button>
          </div>
        </div>

        <!-- Comparison Result -->
        <div v-if="comparisonResult" class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Network Summary -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-medium text-gray-900">Network</h4>
                <svg class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Version A:</span>
                  <span class="font-medium">{{ versionAData?.nodes?.length || 0 }} nodes, {{ versionAData?.pipes?.length || 0 }} pipes</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Version B:</span>
                  <span class="font-medium">{{ versionBData?.nodes?.length || 0 }} nodes, {{ versionBData?.pipes?.length || 0 }} pipes</span>
                </div>
                <div class="flex justify-between border-t pt-2">
                  <span class="text-gray-600">Difference:</span>
                  <span class="font-bold" :class="getDiffClass(versionBData?.nodes?.length || 0, versionAData?.nodes?.length || 0)">
                    {{ formatDiff(versionBData?.nodes?.length || 0, versionAData?.nodes?.length || 0) }} nodes
                  </span>
                </div>
              </div>
            </div>

            <!-- Fixtures Summary -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-medium text-gray-900">Fixtures</h4>
                <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Version A:</span>
                  <span class="font-medium">{{ countFixtures(versionAData) }} fixtures</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Version B:</span>
                  <span class="font-medium">{{ countFixtures(versionBData) }} fixtures</span>
                </div>
                <div class="flex justify-between border-t pt-2">
                  <span class="text-gray-600">Difference:</span>
                  <span class="font-bold" :class="getDiffClass(countFixtures(versionBData), countFixtures(versionAData))">
                    {{ formatDiff(countFixtures(versionBData), countFixtures(versionAData)) }} fixtures
                  </span>
                </div>
              </div>
            </div>

            <!-- Calculation Summary -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-medium text-gray-900">Calculation</h4>
                <svg class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M15 7h6m-6 0h.01M9 3h6m-6 0h.01M3 21h18M9 3v6m6-6h6m-6 0v6" />
                </svg>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Version A:</span>
                  <span class="font-medium">{{ hasCalculation(versionAData) ? '✅ คำนวณแล้ว' : '❌ ยังไม่คำนวณ' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Version B:</span>
                  <span class="font-medium">{{ hasCalculation(versionBData) ? '✅ คำนวณแล้ว' : '❌ ยังไม่คำนวณ' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Network Diagrams Comparison -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">เปรียบเทียบ Network Diagram</h3>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <!-- Version A Network -->
              <div class="border-2 border-blue-200 rounded-lg overflow-hidden">
                <div class="bg-blue-50 px-4 py-2 border-b border-blue-200">
                  <h4 class="text-sm font-bold text-blue-900">
                    {{ versionA?.name || `Version ${versionA?.versionNumber}` }}
                  </h4>
                </div>
                <div class="p-0 bg-gray-50 h-screen">
                  <NetworkComparisonViewer
                    v-if="versionAData?.snapshotNetwork"
                    :network-data="versionAData.snapshotNetwork"
                    :blueprints="versionABlueprints"
                  />
                  <div v-else class="flex items-center justify-center h-full text-gray-400">
                    <div class="text-center">
                      <svg class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p class="text-sm">ไม่พบ Network</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Version B Network -->
              <div class="border-2 border-orange-200 rounded-lg overflow-hidden">
                <div class="bg-orange-50 px-4 py-2 border-b border-orange-200">
                  <h4 class="text-sm font-bold text-orange-900">
                    {{ versionB?.name || `Version ${versionB?.versionNumber}` }}
                  </h4>
                </div>
                <div class="p-0 bg-gray-50 h-screen">
                  <NetworkComparisonViewer
                    v-if="versionBData?.snapshotNetwork"
                    :network-data="versionBData.snapshotNetwork"
                    :blueprints="versionBBlueprints"
                  />
                  <div v-else class="flex items-center justify-center h-full text-gray-400">
                    <div class="text-center">
                      <svg class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p class="text-sm">ไม่พบ Network</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Audit Logs -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">ประวัติการแก้ไข (Audit Logs)</h3>
            </div>

            <div class="space-y-4">
              <!-- Version A Logs -->
              <div v-if="versionA" class="border-l-4 border-blue-500 pl-4">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-bold text-blue-900">
                    {{ versionA.name || `Version ${versionA.versionNumber}` }}
                  </h4>
                  <span class="text-xs text-gray-500">{{ formatDate(versionA.createdAt) }}</span>
                </div>
                <div class="text-sm text-gray-600 space-y-1">
                  <p>• สร้างเมื่อ: {{ formatDateTime(versionA.createdAt) }}</p>
                  <p>• อัปเดตล่าสุด: {{ formatDateTime(versionA.updatedAt) }}</p>
                  <p v-if="versionA.createdBy">• สร้างโดย: {{ versionA.createdBy }}</p>
                  <p v-if="!versionA.snapshotNetwork">• ยังไม่มี Network</p>
                  <p v-else>• มี Network ({{ getNetworkStats(versionA).nodes }} nodes, {{ getNetworkStats(versionA).pipes }} pipes)</p>
                  <p v-if="!versionA.snapshotFixtures">• ยังไม่มี Fixtures</p>
                  <p v-else>• มี Fixtures ({{ countFixtures(JSON.parse(versionA.snapshotFixtures)) }} fixtures)</p>
                  <p v-if="!versionA.snapshotResults">• ยังไม่มีผลการคำนวณ</p>
                  <p v-else>• มีผลการคำนวณ</p>
                </div>
              </div>

              <!-- Version B Logs -->
              <div v-if="versionB" class="border-l-4 border-orange-500 pl-4">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-bold text-orange-900">
                    {{ versionB.name || `Version ${versionB.versionNumber}` }}
                  </h4>
                  <span class="text-xs text-gray-500">{{ formatDate(versionB.createdAt) }}</span>
                </div>
                <div class="text-sm text-gray-600 space-y-1">
                  <p>• สร้างเมื่อ: {{ formatDateTime(versionB.createdAt) }}</p>
                  <p>• อัปเดตล่าสุด: {{ formatDateTime(versionB.updatedAt) }}</p>
                  <p v-if="versionB.createdBy">• สร้างโดย: {{ versionB.createdBy }}</p>
                  <p v-if="!versionB.snapshotNetwork">• ยังไม่มี Network</p>
                  <p v-else>• มี Network ({{ getNetworkStats(versionB).nodes }} nodes, {{ getNetworkStats(versionB).pipes }} pipes)</p>
                  <p v-if="!versionB.snapshotFixtures">• ยังไม่มี Fixtures</p>
                  <p v-else>• มี Fixtures ({{ countFixtures(JSON.parse(versionB.snapshotFixtures)) }} fixtures)</p>
                  <p v-if="!versionB.snapshotResults">• ยังไม่มีผลการคำนวณ</p>
                  <p v-else>• มีผลการคำนวณ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
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
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            เลือก Version เพื่อเปรียบเทียบ
          </h3>
          <p class="text-gray-600">
            เลือก 2 Version ที่ต้องการเปรียบเทียบ Network, Fixtures และ Calculation Results
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { versionsApi, documentsApi } from '~/composables/useApi'
import NetworkComparisonViewer from '~/components/network/NetworkComparisonViewer.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// State
const versions = ref<any[]>([])
const selectedVersionA = ref<string | number>('')
const selectedVersionB = ref<string | number>('')
const comparisonResult = ref(false)
const versionAData = ref<any>(null)
const versionBData = ref<any>(null)
const versionABlueprints = ref<any[]>([])
const versionBBlueprints = ref<any[]>([])

// Computed
const versionA = computed(() => {
  if (!selectedVersionA.value) return null
  return versions.value.find(v => v.id === selectedVersionA.value)
})

const versionB = computed(() => {
  if (!selectedVersionB.value) return null
  return versions.value.find(v => v.id === selectedVersionB.value)
})

// Methods
const loadVersions = async () => {
  try {
    const projectId = parseInt(route.params.id as string)
    const data = await versionsApi.list(projectId)
    versions.value = data || []
    console.log('✅ Loaded versions:', versions.value.length)
  } catch (error) {
    console.error('Failed to load versions:', error)
    toast.error('ไม่สามารถโหลด Versions ได้')
  }
}

const compareVersions = async () => {
  console.log('[Compare] compareVersions() called')
  console.log('[Compare] versionA:', versionA.value)
  console.log('[Compare] versionB:', versionB.value)

  if (!selectedVersionA.value || !selectedVersionB.value) {
    toast.error('กรุณาเลือก Version ทั้ง 2')
    return
  }

  if (selectedVersionA.value === selectedVersionB.value) {
    toast.error('กรุณาเลือก Version ที่ต่างกัน')
    return
  }

  // Load version data
  console.log('[Compare] Parsing version data...')
  versionAData.value = parseVersionData(versionA.value)
  versionBData.value = parseVersionData(versionB.value)

  console.log('[Compare] versionAData:', versionAData.value)
  console.log('[Compare] versionBData:', versionBData.value)

  // Load blueprints for both versions
  console.log('[Compare] Loading blueprints...')
  await loadBlueprintsForVersion(selectedVersionA.value, 'A')
  await loadBlueprintsForVersion(selectedVersionB.value, 'B')

  console.log('[Compare] versionABlueprints:', versionABlueprints.value)
  console.log('[Compare] versionBBlueprints:', versionBBlueprints.value)

  comparisonResult.value = true
  toast.success('เปรียบเทียบ Version เรียบร้อย')
  console.log('✅ Compared versions:', {
    versionA: versionA.value?.name,
    versionB: versionB.value?.name,
    versionABlueprints: versionABlueprints.value.length,
    versionBBlueprints: versionBBlueprints.value.length
  })
}

const clearSelection = () => {
  selectedVersionA.value = ''
  selectedVersionB.value = ''
  comparisonResult.value = false
  versionAData.value = null
  versionBData.value = null
}

const parseVersionData = (version: any) => {
  if (!version) {
    console.log('[parseVersionData] No version provided')
    return null
  }

  console.log('[parseVersionData] Parsing version:', version.id, version.name)
  console.log('[parseVersionData] Has snapshotNetwork:', !!version.snapshotNetwork)

  try {
    const network = version.snapshotNetwork ? JSON.parse(version.snapshotNetwork) : null

    const data = {
      snapshotNetwork: network,
      snapshotFixtures: version.snapshotFixtures ? JSON.parse(version.snapshotFixtures) : null,
      snapshotResults: version.snapshotResults ? JSON.parse(version.snapshotResults) : null,
    }

    console.log('[parseVersionData] Parsed data:', {
      hasNetwork: !!data.snapshotNetwork,
      nodes: data.snapshotNetwork?.nodes?.length || 0,
      pipes: data.snapshotNetwork?.pipes?.length || 0
    })

    return data
  } catch (error) {
    console.error('[parseVersionData] Error parsing version data:', error)
    return null
  }
}

const countFixtures = (data: any) => {
  if (!data?.snapshotFixtures) return 0
  try {
    const fixtures = typeof data.snapshotFixtures === 'string'
      ? JSON.parse(data.snapshotFixtures)
      : data.snapshotFixtures

    if (fixtures?.nodes) {
      return fixtures.nodes.reduce((total: number, node: any) => {
        return total + (node.fixtures?.length || 0)
      }, 0)
    }
  } catch (error) {
    console.error('Error counting fixtures:', error)
  }
  return 0
}

const hasCalculation = (data: any) => {
  return !!data?.snapshotResults
}

const getNetworkStats = (version: any) => {
  if (!version.snapshotNetwork) return { nodes: 0, pipes: 0 }
  try {
    const network = JSON.parse(version.snapshotNetwork)
    return {
      nodes: network?.nodes?.length || 0,
      pipes: network?.pipes?.length || 0
    }
  } catch (error) {
    return { nodes: 0, pipes: 0 }
  }
}

const formatDiff = (valueB: number, valueA: number) => {
  const diff = valueB - valueA
  if (diff > 0) return `+${diff}`
  if (diff < 0) return `${diff}`
  return '0'
}

const getDiffClass = (valueB: number, valueA: number) => {
  const diff = valueB - valueA
  if (diff > 0) return 'text-green-600'
  if (diff < 0) return 'text-red-600'
  return 'text-gray-600'
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  })
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goBack = () => {
  router.push(`/projects/${route.params.id}`)
}

const loadBlueprintsForVersion = async (versionId: string | number, versionLabel: 'A' | 'B') => {
  console.log(`[loadBlueprintsForVersion] Loading for Version ${versionLabel}, ID: ${versionId}`)

  try {
    const blueprints = await documentsApi.listByVersion(Number(versionId))

    console.log(`[loadBlueprintsForVersion] Got ${blueprints?.length || 0} blueprints for Version ${versionLabel}`)

    if (versionLabel === 'A') {
      versionABlueprints.value = blueprints || []
    } else {
      versionBBlueprints.value = blueprints || []
    }

    console.log(`✅ Loaded blueprints for Version ${versionLabel}:`, blueprints?.length || 0)
  } catch (error) {
    console.error(`Failed to load blueprints for Version ${versionLabel}:`, error)
    if (versionLabel === 'A') {
      versionABlueprints.value = []
    } else {
      versionBBlueprints.value = []
    }
  }
}

// Load data on mount
onMounted(async () => {
  await loadVersions()
})

definePageMeta({
  layout: 'dashboard'
})
</script>
