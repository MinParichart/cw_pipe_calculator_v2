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

    <!-- Network Builder Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Main Canvas Area -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-medium text-gray-900">Network Diagram</h2>
              <div class="flex items-center gap-2">
                <button
                  @click="saveNetwork"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  :disabled="saving"
                >
                  <span v-if="saving">Saving...</span>
                  <span v-else>Save Network</span>
                </button>
              </div>
            </div>

            <!-- Canvas Placeholder -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg h-[600px] flex items-center justify-center">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <p class="mt-2 text-sm text-gray-500">
                  Network Builder Canvas
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
            </div>
          </div>

          <!-- Tools Card -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Tools</h3>
            <div class="grid grid-cols-2 gap-2">
              <button class="p-2 border rounded hover:bg-gray-50 text-xs">
                Select
              </button>
              <button class="p-2 border rounded hover:bg-gray-50 text-xs">
                Pipe
              </button>
              <button class="p-2 border rounded hover:bg-gray-50 text-xs">
                Node
              </button>
              <button class="p-2 border rounded hover:bg-gray-50 text-xs">
                Fitting
              </button>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Next Steps</h3>
            <ol class="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Draw network diagram</li>
              <li>Save the network</li>
              <li>Go to Fixtures setup</li>
            </ol>
          </div>

          <!-- Navigation -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <button
              @click="goToFixtures"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!hasNetwork()"
            >
              Next: Fixtures Setup →
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
        // Check if reference is uploaded
        if (!found.referenceLayer) {
          toast.info('Please upload reference file first')
          router.replace(`/projects/${route.params.id}/versions/${versionId}/upload`)
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

const saveNetwork = async () => {
  saving.value = true
  try {
    // TODO: Implement actual network save
    // For now, just simulate
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('บันทึก Network สำเร็จ')
    await loadVersion() // Reload to get updated data
  } catch (err: any) {
    toast.error(err.message || 'บันทึก Network ไม่สำเร็จ')
  } finally {
    saving.value = false
  }
}

const goToFixtures = () => {
  router.push(`/projects/${route.params.id}/versions/${version.value.id}/fixtures`)
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
