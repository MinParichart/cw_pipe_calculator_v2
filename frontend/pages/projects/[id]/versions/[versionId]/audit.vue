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
                  Audit Log
                </h1>
                <p class="mt-1 text-sm text-gray-600">
                  ประวัติการเปลี่ยนแปลงของ Version
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

        <!-- Audit Log Component -->
        <VersionAuditLog />

        <!-- Navigation Buttons -->
        <div class="mt-6 flex gap-3">
          <BackButton @click="goToPrevStep" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { versionsApi } from '~/composables/useApi'
import VersionSteps from '~/components/workflow/VersionSteps.vue'
import VersionAuditLog from '~/components/version/VersionAuditLog.vue'
import BackButton from '~/components/navigation/BackButton.vue'
import { useWorkflowStore } from '~/stores/workflowStore'

const route = useRoute()
const router = useRouter()
const workflowStore = useWorkflowStore()

// Computed
const projectId = computed(() => {
  const id = route.params.id;
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
})
const versionId = computed(() => {
  const id = route.params.versionId;
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
})

// State
const version = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Methods
const loadVersion = async () => {
  try {
    loading.value = true
    error.value = null

    version.value = await versionsApi.get(parseInt(versionId.value))
  } catch (err: any) {
    error.value = err.message || 'Failed to load version'
    console.error('Error loading version:', err)
  } finally {
    loading.value = false
  }
}

const goToPrevStep = () => {
  router.push(`/projects/${route.params.id}/versions/${route.params.versionId}/calculation`)
}

onMounted(() => {
  loadVersion()
  workflowStore.setCurrentStep('versionAudit')
})
</script>

<script lang="ts">
definePageMeta({
  layout: "dashboard"
})
</script>
