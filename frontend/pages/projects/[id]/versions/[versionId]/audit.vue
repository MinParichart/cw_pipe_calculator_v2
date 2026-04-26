<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Version Steps Indicator -->
    <VersionSteps :version-id="versionId" />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Version Header -->
      <div v-if="version" class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold text-slate-800">
                {{ version.name }}
              </h1>
              <span
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="version.isCurrent ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'"
              >
                {{ version.isCurrent ? 'Current Version' : `Version ${version.versionNumber}` }}
              </span>
            </div>
            <p v-if="version.description" class="text-slate-600 mt-1">
              {{ version.description }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink
              :to="`/projects/${projectId}/versions/${versionId}`"
              class="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
            >
              ← Back to Version
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Audit Log Component -->
      <VersionAuditLog />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { versionsApi } from '~/composables/useApi'
import VersionSteps from '~/components/workflow/VersionSteps.vue'
import VersionAuditLog from '~/components/version/VersionAuditLog.vue'

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const versionId = computed(() => route.params.versionId as string)

const version = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

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

onMounted(() => {
  loadVersion()
})
</script>
