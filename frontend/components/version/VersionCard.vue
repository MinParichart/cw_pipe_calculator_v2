<template>
  <div class="version-card bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <!-- Version Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
          <span class="text-sm font-bold">{{ version.versionNumber }}</span>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ version.name }}</h3>
          <p class="text-sm text-gray-500">
            {{ formatDate(version.createdAt) }}
          </p>
        </div>
      </div>

      <!-- Current Badge -->
      <span v-if="version.isCurrent" class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Current
      </span>
    </div>

    <!-- Version Info -->
    <div class="space-y-2 mb-4">
      <p v-if="version.description" class="text-sm text-gray-600">
        {{ version.description }}
      </p>

      <!-- Snapshot Status -->
      <div class="flex flex-wrap gap-2 text-xs">
        <span v-if="hasSnapshot('network')" class="px-2 py-1 bg-blue-50 text-blue-700 rounded">
          ✓ Network
        </span>
        <span v-if="hasSnapshot('fixtures')" class="px-2 py-1 bg-purple-50 text-purple-700 rounded">
          ✓ Fixtures
        </span>
        <span v-if="hasSnapshot('results')" class="px-2 py-1 bg-green-50 text-green-700 rounded">
          ✓ Results
        </span>
        <span v-if="hasReference()" class="px-2 py-1 bg-orange-50 text-orange-700 rounded">
          ✓ Reference
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 pt-3 border-t border-gray-200">
      <button
        @click="$emit('continue', version)"
        class="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
      >
        {{ getNextStepText(version) }}
      </button>

      <button
        @click="$emit('duplicate', version)"
        class="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
        title="Duplicate"
      >
        📋
      </button>

      <button
        @click="$emit('delete', version)"
        class="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
        title="Delete"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  version: Version
}

const props = defineProps<Props>()

defineEmits<{
  continue: [version: Version]
  duplicate: [version: Version]
  delete: [version: Version]
}>()

const hasSnapshot = (type: 'network' | 'fixtures' | 'results') => {
  const snapshotMap = {
    network: props.version.snapshotNetwork,
    fixtures: props.version.snapshotFixtures,
    results: props.version.snapshotResults
  }
  return !!snapshotMap[type]
}

const hasReference = () => {
  return !!props.version.referenceLayer
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const getNextStepText = (version: Version) => {
  if (!version.referenceLayer) return 'Step 2: Documents →'
  if (!version.snapshotNetwork) return 'Step 3: Network →'
  if (!version.snapshotFixtures) return 'Step 4: Fixtures →'
  if (!version.snapshotResults) return 'Step 5: Calculate →'
  return 'View Results →'
}
</script>
