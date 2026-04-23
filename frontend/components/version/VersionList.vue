<template>
  <div class="version-list space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Versions</h2>
        <p class="text-sm text-gray-600 mt-1">
          {{ totalVersions }} version{{ totalVersions !== 1 ? 's' : '' }}
        </p>
      </div>

      <button
        @click="$emit('create')"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        + Create Version
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-sm text-gray-600">Loading versions...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="versions.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
      <div class="text-gray-400 text-6xl mb-4">📦</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No versions yet</h3>
      <p class="text-sm text-gray-600 mb-4">
        Create your first version to start tracking your work
      </p>
      <button
        @click="$emit('create')"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create First Version
      </button>
    </div>

    <!-- Version Cards -->
    <div v-else class="grid gap-4">
      <VersionCard
        v-for="version in sortedVersions"
        :key="version.id"
        :version="version"
        @continue="$emit('continue', $event)"
        @duplicate="$emit('duplicate', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-sm text-red-800">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VersionCard from './VersionCard.vue'

interface Version {
  id: number
  name: string
  description?: string
  versionNumber: number
  isCurrent: boolean
  createdAt: string
  snapshotNetwork?: string
  snapshotFixtures?: string
  snapshotResults?: string
  referenceLayer?: string
}

interface Props {
  versions: Version[]
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

defineEmits<{
  create: []
  continue: [version: Version]
  duplicate: [version: Version]
  delete: [version: Version]
}>()

const totalVersions = computed(() => props.versions.length)

const sortedVersions = computed(() => {
  return [...props.versions].sort((a, b) => {
    // Sort by version number descending
    if (b.versionNumber !== a.versionNumber) {
      return b.versionNumber - a.versionNumber
    }
    // Then by date descending
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})
</script>
