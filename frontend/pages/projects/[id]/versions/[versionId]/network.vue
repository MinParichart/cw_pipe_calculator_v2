<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <button
                @click="goBack"
                class="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                ย้อนกลับ
              </button>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Network Builder</h1>
                <p class="mt-1 text-sm text-gray-600">
                  วาดแผนภาพระบบท่อน้ำดีและเลือก Critical Path
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

        <!-- Blueprint Selector -->
        <div v-if="blueprints.length > 0" class="mb-6">
          <div class="bg-white rounded-lg shadow-sm border border-blue-200 overflow-hidden">
            <div class="bg-blue-50 px-6 py-3 border-b border-blue-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 class="text-lg font-semibold text-blue-900">เลือก Blueprint จาก Step Upload</h3>
                </div>
                <span class="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
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
                  :class="isBlueprintSelected(bp)
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-300 hover:border-blue-400'"
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
                      <span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        {{ bp.floorText }}
                      </span>
                      <span class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                        {{ bp.typeText }}
                      </span>
                    </div>
                    <p class="text-sm font-semibold text-gray-900 mb-1 truncate">
                      {{ bp.floorText }} - {{ bp.typeText }}
                    </p>
                    <p class="text-xs text-gray-600">Scale: {{ bp.scale }}</p>
                  </div>
                </div>
              </div>

              <!-- Selected Blueprints Info -->
              <div v-if="selectedBlueprints.length > 0" class="mt-4 p-3 bg-blue-50 rounded-lg">
                <div class="text-sm text-blue-900">
                  <span class="font-semibold">เลือก {{ selectedBlueprints.length }} แบบ:</span>
                  <span class="ml-2">{{ selectedBlueprints.map((bp, i) => `${i + 1}. ${bp.floorText}`).join(', ') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Blueprints Message -->
        <div v-else class="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <svg class="h-12 w-12 mx-auto mb-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="font-medium text-yellow-900">ยังไม่มี Blueprint</p>
          <p class="text-sm text-yellow-700 mt-1">
            กรุณาอัปโหลด Blueprint ที่ Step Upload
          </p>
        </div>

        <!-- Network Builder -->
        <div v-if="networkData && !loadingNetwork" class="mb-6">
          <NetworkBuilder
            :project-id="parseInt(route.params.id as string)"
            :version-id="parseInt(route.params.versionId as string)"
            :network-data="networkData"
            :blueprints="selectedBlueprints"
            @network-change="onNetworkChange"
          />
        </div>

        <!-- Loading State -->
        <div v-else-if="loadingNetwork" class="mb-6 bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p class="text-gray-600">กำลังโหลด Network...</p>
        </div>

        <!-- No Network Message -->
        <div v-else class="mb-6 bg-white rounded-lg shadow-sm p-8 text-center">
          <svg class="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">ยังไม่มี Network</h3>
          <p class="text-gray-600 mb-4">เริ่มต้นวาดแผนภาพระบบท่อน้ำดีของคุณ</p>
          <button
            @click="createNetwork"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            สร้าง Network
          </button>
        </div>

        <!-- Critical Endpoint Selector -->
        <div v-if="networkData && fixtures.length > 0" class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Critical Endpoint Selector</h3>
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Endpoint Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                เลือก Critical Endpoint
              </label>
              <select
                v-model="criticalEndpointId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">-- เลือก Endpoint --</option>
                <option
                  v-for="fixture in fixtures"
                  :key="fixture.id"
                  :value="fixture.id"
                >
                  {{ fixture.name }} ({{ fixture.distance || 0 }}m)
                </option>
              </select>
              <p class="mt-2 text-xs text-gray-500">
                Endpoint ที่อยู่ไกลที่สุดจาก Source จะถูกใช้เป็น Critical Path
              </p>
            </div>

            <!-- Auto Find Button -->
            <div class="flex items-end">
              <button
                @click="findCriticalPath"
                :disabled="findingPath || fixtures.length === 0"
                class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="findingPath">กำลังคำนวณ...</span>
                <span v-else>หา Critical Path อัตโนมัติ</span>
              </button>
            </div>
          </div>

          <!-- Critical Path Info -->
          <div v-if="criticalPath" class="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 class="font-medium text-orange-900 mb-2">Critical Path</h4>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <p class="text-xs text-orange-700">Endpoint</p>
                <p class="font-bold text-orange-900">{{ criticalPath.endpoint }}</p>
              </div>
              <div>
                <p class="text-xs text-orange-700">ระยะทางรวม</p>
                <p class="font-bold text-orange-900">{{ criticalPath.totalDistance }}m</p>
              </div>
              <div>
                <p class="text-xs text-orange-700">จำนวน Segments</p>
                <p class="font-bold text-orange-900">{{ criticalPath.segments }}</p>
              </div>
            </div>
          </div>
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
import NetworkBuilder from '~/components/network/NetworkBuilder.vue'
import NextStepButton from '~/components/navigation/NextStepButton.vue'
import BackButton from '~/components/navigation/BackButton.vue'
import { documentsApi } from '~/composables/useApi'
import { useVersionStore } from '~/stores/versionStore'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const versionStore = useVersionStore()

// State
const version = ref<any>(null)
const networkData = ref<any>(null)
const fixtures = ref<any[]>([])
const criticalEndpointId = ref('')
const findingPath = ref(false)
const criticalPath = ref<any>(null)
const loadingNetwork = ref(true)

// Blueprint state
const blueprints = ref<any[]>([])
const selectedBlueprints = ref<any[]>([])

// Methods
const loadVersion = async () => {
  try {
    const versionId = parseInt(route.params.versionId as string)
    const result = await versionStore.loadVersions(parseInt(route.params.id as string))

    if (result.success) {
      const found = versionStore.versions.find(v => v.id === versionId)
      if (found) {
        version.value = found
      }
    }
  } catch (err: any) {
    console.error('Failed to load version:', err)
  }
}

const loadNetworkFromVersion = () => {
  loadingNetwork.value = true
  try {
    if (version.value?.snapshotNetwork) {
      networkData.value = JSON.parse(version.value.snapshotNetwork)
    }
  } catch (error) {
    console.error('Failed to parse network snapshot:', error)
    networkData.value = null
  } finally {
    loadingNetwork.value = false
  }
}

const loadFixturesFromVersion = () => {
  try {
    if (version.value?.snapshotFixtures) {
      const fixturesData = JSON.parse(version.value.snapshotFixtures)
      // Convert fixtures data to array
      fixtures.value = fixturesData.nodes?.flatMap((node: any) =>
        (node.fixtures || []).map((f: any) => ({
          id: `${node.id}-${f.type}`,
          name: `${node.label || node.id} - ${f.type}`,
          distance: 0, // TODO: Calculate from network
          type: f.type,
          quantity: f.quantity || 1
        }))
      ) || []
    }
  } catch (error) {
    console.error('Failed to parse fixtures snapshot:', error)
    fixtures.value = []
  }
}

const createNetwork = () => {
  networkData.value = {
    nodes: [],
    pipes: []
  }
  toast.success('สร้าง Network เรียบร้อย')
}

const onNetworkChange = (updatedNetwork: any) => {
  networkData.value = updatedNetwork
  // Save to version snapshot
  saveNetworkSnapshot()
}

const saveNetworkSnapshot = async () => {
  try {
    const versionId = parseInt(route.params.versionId as string)
    await versionStore.updateVersion(versionId, {
      snapshotNetwork: JSON.stringify(networkData.value)
    })
  } catch (error) {
    console.error('Failed to save network snapshot:', error)
  }
}

const findCriticalPath = async () => {
  if (fixtures.value.length === 0) {
    toast.error('ไม่พบ Fixtures สำหรับคำนวณ Critical Path')
    return
  }

  findingPath.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock finding the furthest fixture
    const furthestFixture = fixtures.value.reduce((max, fixture) =>
      (fixture.distance || 0) > (max.distance || 0) ? fixture : max
    , fixtures.value[0])

    criticalEndpointId.value = furthestFixture.id
    criticalPath.value = {
      endpoint: furthestFixture.name,
      totalDistance: furthestFixture.distance || 0,
      segments: Math.floor((furthestFixture.distance || 0) / 3) + 1
    }

    toast.success('หา Critical Path เรียบร้อย')
  } catch (error: any) {
    toast.error(error.message || 'Failed to find critical path')
  } finally {
    findingPath.value = false
  }
}

const goToNextStep = () => {
  router.push(`/projects/${route.params.id}/versions/${route.params.versionId}/fixtures`)
}

const goToPrevStep = () => {
  router.push(`/projects/${route.params.id}/versions/${route.params.versionId}/upload`)
}

const goBack = () => {
  router.push(`/projects/${route.params.id}`)
}

// Blueprint methods
const loadBlueprints = async () => {
  try {
    const versionId = parseInt(route.params.versionId as string)
    blueprints.value = await documentsApi.listByVersion(versionId)
    // Auto-select all blueprints if available
    if (blueprints.value.length > 0 && selectedBlueprints.value.length === 0) {
      selectedBlueprints.value = [...blueprints.value]
    }
  } catch (error: any) {
    console.error('Failed to load blueprints from API:', error)
    blueprints.value = []
  }
}

const isBlueprintSelected = (blueprint: any) => {
  return selectedBlueprints.value.some(bp => bp.id === blueprint.id)
}

const getBlueprintLayerNumber = (blueprint: any) => {
  const index = selectedBlueprints.value.findIndex(bp => bp.id === blueprint.id)
  return index >= 0 ? index + 1 : ''
}

const toggleBlueprint = (blueprint: any) => {
  const index = selectedBlueprints.value.findIndex(bp => bp.id === blueprint.id)
  if (index >= 0) {
    // Deselect
    selectedBlueprints.value.splice(index, 1)
    toast.success(`เลิกเลือก: ${blueprint.floorText}`)
  } else {
    // Select
    selectedBlueprints.value.push(blueprint)
    toast.success(`เลือก Blueprint: ${blueprint.floorText}`)
  }
}

// Load data on mount
onMounted(async () => {
  await loadVersion()
  await loadNetworkFromVersion()
  await loadFixturesFromVersion()
  await loadBlueprints()
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard',
})
</script>
