<template>
  <div class="bg-white border-b border-slate-200 px-6 py-3">
    <div class="max-w-[1400px] mx-auto">
      <div class="flex items-center justify-between gap-1">
        <div
          v-for="(step, index) in STEPS"
          :key="step.id"
          class="flex items-center flex-shrink-0"
        >
          <!-- Step Circle -->
          <div class="flex flex-col items-center">
            <button
              @click="handleStepClick(step)"
              :disabled="!projectId"
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
            v-if="index < STEPS.length - 1"
            class="w-8 h-0.5 mx-1 mb-6 transition-all"
            :class="{
              'bg-green-500': isCompleted(STEPS[index + 1].id) || isCompleted(step.id),
              'bg-slate-200': !isCompleted(STEPS[index + 1].id) && !isCompleted(step.id)
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkflowStore, type ProjectStep } from '~/stores/workflowStore'

interface Step {
  id: ProjectStep
  label: string
  order: number
  path: string
}

const STEPS: Step[] = [
  { id: 'parameters', label: 'Parameters', order: 1, path: '' },
  { id: 'documents', label: 'Documents', order: 2, path: 'documents' },
  { id: 'network', label: 'Network', order: 3, path: 'network' },
  { id: 'fixtures', label: 'Fixtures', order: 4, path: 'fixtures' },
  { id: 'calculation', label: 'Calculate', order: 5, path: 'calculation' },
  { id: 'versions', label: 'Versions', order: 6, path: 'versions' },
]

const props = defineProps<{
  projectId?: string
}>()

const workflowStore = useWorkflowStore()
const route = useRoute()
const router = useRouter()

// Computed
const isCompleted = (stepId: ProjectStep) => {
  return workflowStore.isStepCompleted(stepId)
}

const isCurrent = (stepId: ProjectStep) => {
  return workflowStore.isCurrentStep(stepId)
}

// Methods
const handleStepClick = (step: Step) => {
  if (!props.projectId) return

  const basePath = `/projects/${props.projectId}`
  const fullPath = step.path ? `${basePath}/${step.path}` : basePath

  router.push(fullPath)
}
</script>
