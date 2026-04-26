<template>
  <div class="bg-white border-b border-slate-200 px-6 py-3">
    <div class="max-w-[1400px] mx-auto">
      <div class="flex items-center justify-between gap-1">
        <div
          v-for="(step, index) in VERSION_STEPS"
          :key="step.id"
          class="flex items-center flex-shrink-0"
        >
          <!-- Step Circle -->
          <div class="flex flex-col items-center">
            <button
              @click="handleStepClick(step)"
              :disabled="!versionId"
              class="
                w-9 h-9 rounded-full flex items-center justify-center
                font-medium text-xs transition-all cursor-pointer hover:scale-110
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              :class="{
                'bg-green-500 text-white shadow-md hover:shadow-lg': isCompleted(step.id),
                'bg-orange-600 text-white shadow-md ring-3 ring-orange-100 hover:shadow-lg': isCurrent(step.id),
                'bg-slate-200 text-slate-500 hover:bg-slate-300': !isCompleted(step.id) && !isCurrent(step.id)
              }"
              :title="`คลิกเพื่อไปยัง ${step.label}`"
            >
              <svg v-if="isCompleted(step.id)" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else class="text-[10px]">{{ step.order }}</span>
            </button>
            <div class="mt-1.5 text-center">
              <p
                class="text-[10px] font-medium whitespace-nowrap"
                :class="{
                  'text-green-600': isCompleted(step.id),
                  'text-orange-600': isCurrent(step.id),
                  'text-slate-500': !isCompleted(step.id) && !isCurrent(step.id)
                }"
              >
                {{ step.label }}
              </p>
            </div>
          </div>

          <!-- Connector Line -->
          <div
            v-if="index < VERSION_STEPS.length - 1"
            class="w-8 h-0.5 mx-1 mb-6 transition-all"
            :class="{
              'bg-green-500': isCompleted(VERSION_STEPS[index + 1].id) || isCompleted(step.id),
              'bg-slate-200': !isCompleted(VERSION_STEPS[index + 1].id) && !isCompleted(step.id)
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkflowStore, type VersionStep } from '~/stores/workflowStore'

interface Step {
  id: VersionStep
  label: string
  order: number
  path: string
}

const VERSION_STEPS: Step[] = [
  { id: 'versionUpload', label: 'Upload', order: 1, path: 'upload' },
  { id: 'versionNetwork', label: 'Network', order: 2, path: 'network' },
  { id: 'versionFixtures', label: 'Fixtures', order: 3, path: 'fixtures' },
  { id: 'versionCalculation', label: 'Calculate', order: 4, path: 'calculation' },
  { id: 'versionAudit', label: 'Audit', order: 5, path: 'audit' },
]

const props = defineProps<{
  versionId?: string | number
}>()

const workflowStore = useWorkflowStore()
const route = useRoute()
const router = useRouter()

// Computed
const isCompleted = (stepId: VersionStep) => {
  return workflowStore.isStepCompleted(stepId)
}

const isCurrent = (stepId: VersionStep) => {
  return workflowStore.isCurrentStep(stepId)
}

// Methods
const handleStepClick = (step: Step) => {
  console.log('[VersionSteps] Clicked step:', step)
  console.log('[VersionSteps] versionId:', props.versionId)
  console.log('[VersionSteps] route.params.id:', route.params.id)

  if (!props.versionId) {
    console.log('[VersionSteps] ❌ No versionId, cannot navigate')
    return
  }

  const basePath = `/projects/${route.params.id}/versions/${props.versionId}`
  const fullPath = step.path ? `${basePath}/${step.path}` : basePath

  console.log('[VersionSteps] 🚀 Navigating to:', fullPath)
  router.push(fullPath)
}
</script>
