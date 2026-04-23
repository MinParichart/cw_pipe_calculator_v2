<template>
  <div
    class="card hover:shadow-md transition-shadow cursor-pointer"
    @click="$emit('click', project.id)"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-medium text-gray-900">
          {{ project.name }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 line-clamp-2">
          {{ project.description || 'ไม่มีรายละเอียด' }}
        </p>
      </div>
      <span
        v-if="project.isDemo"
        class="badge badge-success"
      >
        Demo
      </span>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center text-sm text-gray-500">
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ formatDate(project.updatedAt) }}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button
          v-if="!project.isDemo"
          @click.stop="$emit('delete', project.id)"
          class="p-2 text-gray-400 hover:text-danger-600 transition-colors"
          title="ลบโปรเจกต์"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  id: number
  name: string
  description?: string
  updatedAt: Date | string
  networksCount?: number
  versionsCount?: number
}

defineProps<{
  project: Project
}>()

defineEmits<{
  click: [id: number]
  delete: [id: number]
}>()

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'วันนี้'
  if (days === 1) return 'เมื่อวาน'
  if (days < 7) return `${days} วันที่แล้ว`
  return d.toLocaleDateString('th-TH')
}
</script>
