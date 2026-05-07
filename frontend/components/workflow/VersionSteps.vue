<template>
  <div class="bg-white border-b border-slate-200">
    <!-- Project Header (เหนือ Step Indicator) -->
    <div class="px-6 py-2 border-b border-slate-100 bg-slate-50">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between">
        <!-- ชื่อ Project (Click ได้) -->
        <NuxtLink
          :to="`/projects/${route.params.id}`"
          class="flex items-center gap-2 group"
        >
          <svg class="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-base font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
            {{ projectDisplayName }}
          </span>
          <span class="text-xs text-slate-500 group-hover:text-slate-600 transition-colors">
            (กดเพื่อกลับ)
          </span>
        </NuxtLink>

        <!-- เวอร์ชันปัจจุบัน -->
        <div v-if="currentVersionName" class="text-sm text-slate-600">
          <span class="font-medium">{{ currentVersionName }}</span>
        </div>
      </div>
    </div>

    <!-- Step Indicator -->
    <div class="px-6 py-3">
      <div class="max-w-[1400px] mx-auto">
        <div class="relative flex items-center justify-between gap-1">
        <!-- Progress Line Background -->
        <div class="absolute top-[18px] left-9 right-9 h-0.5 bg-slate-200" style="z-index: 0;"></div>

        <!-- Progress Line Fill -->
        <div
          class="absolute top-[18px] left-9 h-0.5 bg-green-500 transition-all duration-500"
          style="z-index: 0;"
          :style="{ width: getProgressWidth() }"
        ></div>

        <!-- Steps -->
        <div
          v-for="(step, index) in VERSION_STEPS"
          :key="step.id"
          class="flex items-center justify-center flex-1 relative"
          style="z-index: 10;"
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
                'bg-blue-600 text-white shadow-md ring-3 ring-blue-100 hover:shadow-lg': isCurrent(step.id),
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
                  'text-blue-600': isCurrent(step.id),
                  'text-slate-500': !isCompleted(step.id) && !isCurrent(step.id)
                }"
              >
                {{ step.label }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useWorkflowStore, type VersionStep } from '~/stores/workflowStore'
import { useVersionStore } from '~/stores/versionStore'
import { useApi } from '~/composables/useApi'

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
const versionStore = useVersionStore()
const route = useRoute()
const router = useRouter()

// State
const projectData = ref<any>(null)

// Computed - ชื่อ Project ที่จะแสดง
const projectDisplayName = computed(() => {
  console.log('[VersionSteps] projectDisplayName computed, projectData:', projectData.value)
  if (projectData.value?.name) {
    return `โปรเจกต์: ${projectData.value.name}`
  }
  return 'กลับสู่หน้าโปรเจกต์'
})

// Computed - ชื่อ Version ปัจจุบัน
const currentVersionName = computed(() => {
  console.log('[VersionSteps] currentVersionName computed, versionId:', props.versionId)
  if (props.versionId && versionStore.versions) {
    const version = versionStore.versions.find((v: any) => v.id === parseInt(props.versionId as string))
    console.log('[VersionSteps] Found version:', version)
    return version?.name || ''
  }
  return ''
})

// Computed
const isCompleted = (stepId: VersionStep) => {
  return workflowStore.isStepCompleted(stepId)
}

const isCurrent = (stepId: VersionStep) => {
  return workflowStore.isCurrentStep(stepId)
}

// Get progress width
const getProgressWidth = () => {
  const totalSteps = VERSION_STEPS.length
  const completedSteps = VERSION_STEPS.filter(step => isCompleted(step.id)).length

  if (totalSteps <= 1) return '0%'
  return `${(completedSteps / (totalSteps - 1)) * 100}%`
}

// Load project data
onMounted(async () => {
  try {
    const projectId = route.params.id
    if (projectId) {
      projectData.value = await useApi().projectsApi.get(parseInt(projectId as string))
    }
  } catch (error) {
    console.error('[VersionSteps] Failed to load project:', error)
  }
})

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
