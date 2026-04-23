<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            กลับ
          </button>

      </div>
    </div>
  </div>

    <!-- Calculation Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Main Calculation Area -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Input Parameters -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Design Parameters</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  C-Factor
                </label>
                <input
                  :value="criteria?.cFactor || 150"
                  type="text"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Velocity (m/s)
                </label>
                <input
                  :value="`${criteria?.velocityMinimum || 0.6} - ${criteria?.velocityMaximum || 3.0}`"
                  type="text"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Demand Mode
                </label>
                <input
                  :value="criteria?.demandMode || 'MIXED'"
                  type="text"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>
          </div>

          <!-- Calculate Button -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium text-gray-900">Calculation</h2>
                <p class="text-sm text-gray-600 mt-1">
                  Calculate pipe sizes based on Hunter's Curve
                </p>
              </div>
              <button
                @click="runCalculation"
                class="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="calculating || !canCalculate()"
              >
                <span v-if="calculating">
                  <svg class="animate-spin inline-block h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
                <span v-else>🧮 Calculate</span>
              </button>
            </div>
          </div>

          <!-- Results -->
          <div v-if="hasResults()" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Calculation Results</h2>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div class="border rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">-</div>
                <div class="text-xs text-gray-600 mt-1">Total Pipes</div>
              </div>
              <div class="border rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">-</div>
                <div class="text-xs text-gray-600 mt-1">Total Fixtures</div>
              </div>
              <div class="border rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-green-600">-</div>
                <div class="text-xs text-gray-600 mt-1">Max Flow (L/min)</div>
              </div>
              <div class="border rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-orange-600">-</div>
                <div class="text-xs text-gray-600 mt-1">Total Head Loss (m)</div>
              </div>
            </div>

            <!-- Results Table Placeholder -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg h-[300px] flex items-center justify-center">
              <div class="text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
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
                <p class="mt-2 text-sm text-gray-500">
                  Calculation Results
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  (Will be implemented in next phase)
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Status Card -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Status</h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Reference:</span>
                <span :class="hasReference() ? 'text-green-600' : 'text-gray-400'">
                  {{ hasReference() ? '✓' : '○' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Network:</span>
                <span :class="hasNetwork() ? 'text-green-600' : 'text-gray-400'">
                  {{ hasNetwork() ? '✓' : '○' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Fixtures:</span>
                <span :class="hasFixtures() ? 'text-green-600' : 'text-gray-400'">
                  {{ hasFixtures() ? '✓' : '○' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Calculated:</span>
                <span :class="hasResults() ? 'text-green-600' : 'text-gray-400'">
                  {{ hasResults() ? '✓' : '○' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Prerequisites Warning -->
          <div v-if="!canCalculate()" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-yellow-800 mb-2">⚠️ Prerequisites</h3>
            <ul class="text-xs text-yellow-700 space-y-1">
              <li v-if="!hasReference()" class="flex items-start">
                <span class="mr-1">○</span>
                <span>Upload reference file</span>
              </li>
              <li v-if="!hasNetwork()" class="flex items-start">
                <span class="mr-1">○</span>
                <span>Create network diagram</span>
              </li>
              <li v-if="!hasFixtures()" class="flex items-start">
                <span class="mr-1">○</span>
                <span>Add fixtures</span>
              </li>
            </ul>
          </div>

          <!-- Actions -->
          <div v-if="hasResults()" class="bg-white rounded-lg shadow-sm p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Actions</h3>
            <div class="space-y-2">
              <button
                @click="exportResults"
                class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                📄 Export Report
              </button>
              <button
                @click="goBack"
                class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                กลับไปหน้าโปรเจกต์
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVersionStore } from '~/stores/versionStore'
import { projectsApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const versionStore = useVersionStore()

// State
const loading = ref(true)
const version = ref<any>(null)
const criteria = ref<any>(null)
const calculating = ref(false)

// Methods
const loadVersion = async () => {
  loading.value = true
  try {
    const versionId = parseInt(route.params.versionId as string)
    const projectId = parseInt(route.params.id as string)

    // Load version
    const result = await versionStore.loadVersions(projectId)
    if (result.success) {
      const found = versionStore.versions.find(v => v.id === versionId)
      if (found) {
        version.value = found
        // Check prerequisites
        if (!found.referenceLayer) {
          toast.info('Please upload reference file first')
          router.replace(`/projects/${route.params.id}/versions/${versionId}/upload`)
        } else if (!found.snapshotNetwork) {
          toast.info('Please create network first')
          router.replace(`/projects/${route.params.id}/versions/${versionId}/network`)
        } else if (!found.snapshotFixtures) {
          toast.info('Please add fixtures first')
          router.replace(`/projects/${route.params.id}/versions/${versionId}/fixtures`)
        }
      } else {
        toast.error('Version not found')
        goBack()
      }
    }

    // Load project criteria
    try {
      criteria.value = await projectsApi.getCriteria(projectId)
    } catch (error) {
      // No criteria, use defaults
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to load version')
    goBack()
  } finally {
    loading.value = false
  }
}

const hasReference = () => {
  return !!version.value?.referenceLayer
}

const hasNetwork = () => {
  return !!version.value?.snapshotNetwork
}

const hasFixtures = () => {
  return !!version.value?.snapshotFixtures
}

const hasResults = () => {
  return !!version.value?.snapshotResults
}

const canCalculate = () => {
  return hasReference() && hasNetwork() && hasFixtures()
}

const runCalculation = async () => {
  if (!canCalculate()) {
    toast.error('Please complete all previous steps first')
    return
  }

  calculating.value = true
  try {
    // TODO: Implement actual calculation
    // For now, just simulate
    await new Promise(resolve => setTimeout(resolve, 2000))

    toast.success('คำนวณเสร็จสิ้น')
    await loadVersion() // Reload to get updated data
  } catch (err: any) {
    toast.error(err.message || 'คำนวณไม่สำเร็จ')
  } finally {
    calculating.value = false
  }
}

const exportResults = () => {
  toast.info('Export feature coming soon')
}

const goBack = () => {
  router.push(`/projects/${route.params.id}`)
}

// Load version on mount
onMounted(() => {
  loadVersion()
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard'
})
</script>
