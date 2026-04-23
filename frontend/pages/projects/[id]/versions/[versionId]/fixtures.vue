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

    <!-- Fixtures Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Main Fixture List Area -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-medium text-gray-900">Fixtures List</h2>
              <button
                @click="saveFixtures"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                :disabled="saving"
              >
                <span v-if="saving">Saving...</span>
                <span v-else>Save Fixtures</span>
              </button>
            </div>

            <!-- Fixture List Placeholder -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg h-[400px] flex items-center justify-center">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p class="mt-2 text-sm text-gray-500">
                  Fixtures Setup
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
                  {{ hasReference() ? 'Uploaded' : 'Not uploaded' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Network:</span>
                <span :class="hasNetwork() ? 'text-green-600' : 'text-gray-400'">
                  {{ hasNetwork() ? 'Saved' : 'Not saved' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Fixtures:</span>
                <span :class="hasFixtures() ? 'text-green-600' : 'text-gray-400'">
                  {{ hasFixtures() ? 'Saved' : 'Not saved' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Add Fixture Button -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <button
              class="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              + Add Fixture
            </button>
          </div>

          <!-- Fixture Types -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Fixture Types</h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <span class="text-lg mr-2">🚽</span>
                <span>Water Closet</span>
              </div>
              <div class="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <span class="text-lg mr-2">🚿</span>
                <span>Shower</span>
              </div>
              <div class="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <span class="text-lg mr-2">🚰</span>
                <span>Lavatory</span>
              </div>
              <div class="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <span class="text-lg mr-2">🍳</span>
                <span>Kitchen Sink</span>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="bg-green-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Next Steps</h3>
            <ol class="text-xs text-green-800 space-y-1 list-decimal list-inside">
              <li>Add fixtures to network</li>
              <li>Configure fixture units</li>
              <li>Save fixtures</li>
              <li>Go to Calculation</li>
            </ol>
          </div>

          <!-- Navigation -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <button
              @click="goToCalculation"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!hasFixtures()"
            >
              Next: Calculate →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVersionStore } from '~/stores/versionStore'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const versionStore = useVersionStore()

// State
const loading = ref(true)
const version = ref<any>(null)
const saving = ref(false)

// Methods
const loadVersion = async () => {
  loading.value = true
  try {
    const versionId = parseInt(route.params.versionId as string)
    const result = await versionStore.loadVersions(parseInt(route.params.id as string))

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
        }
      } else {
        toast.error('Version not found')
        goBack()
      }
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

const saveFixtures = async () => {
  saving.value = true
  try {
    // TODO: Implement actual fixtures save
    // For now, just simulate
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('บันทึก Fixtures สำเร็จ')
    await loadVersion() // Reload to get updated data
  } catch (err: any) {
    toast.error(err.message || 'บันทึก Fixtures ไม่สำเร็จ')
  } finally {
    saving.value = false
  }
}

const goToCalculation = () => {
  router.push(`/projects/${route.params.id}/versions/${version.value.id}/calculation`)
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
