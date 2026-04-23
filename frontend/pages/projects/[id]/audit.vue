<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Audit Log</h1>
          <p class="mt-1 text-sm text-gray-600">ประวัติการกระทำทั้งหมดในโปรเจกต์</p>
        </div>

        <AuditLog
          v-if="projectId"
          :project-id="projectId"
          :limit="1000"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuditLog from '~/components/audit/AuditLog.vue'
import { useWorkflowStore } from '~/stores/workflowStore'

const route = useRoute()
const workflowStore = useWorkflowStore()

const projectId = computed(() => parseInt(route.params.id as string))

onMounted(() => {
  workflowStore.setCurrentStep('audit')
})

definePageMeta({
  layout: 'dashboard',
})
</script>
