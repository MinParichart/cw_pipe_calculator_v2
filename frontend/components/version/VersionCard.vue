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

      <div class="flex items-center gap-2">
        <!-- Current Badge -->
        <span v-if="version.isCurrent" class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Current
        </span>

        <!-- Edit Button -->
        <button
          @click="openEditModal"
          class="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          แก้ไข
        </button>
      </div>
    </div>

    <!-- Version Info -->
    <div class="space-y-2 mb-4">
      <p v-if="version.description" class="text-sm text-gray-600">
        {{ version.description }}
      </p>

      <!-- Dates -->
      <div class="flex flex-wrap gap-3 text-xs text-gray-500">
        <div class="flex items-center gap-1">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Created: {{ formatDate(version.createdAt) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Updated: {{ formatDate(version.updatedAt) }}</span>
        </div>
      </div>

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

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background-color: rgba(0, 0, 0, 0.5);"
      @keydown.escape="closeEditModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          แก้ไข Version
        </h3>

        <form @submit.prevent="saveEdit">
          <!-- Name Field -->
          <div class="mb-4">
            <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อ Version <span class="text-red-500">*</span>
            </label>
            <input
              id="edit-name"
              ref="nameInput"
              v-model="editForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="เช่น Version 1 - แบบร่างแรก"
            />
          </div>

          <!-- Description Field -->
          <div class="mb-6">
            <label for="edit-description" class="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียด
            </label>
            <textarea
              id="edit-description"
              v-model="editForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับ Version นี้"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="!editForm.name.trim()"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVersionStore } from '~/stores/versionStore'

interface Version {
  id: number
  name: string
  description?: string
  versionNumber: number
  isCurrent: boolean
  createdAt: string
  updatedAt: string
  snapshotNetwork?: string
  snapshotFixtures?: string
  snapshotResults?: string
  referenceLayer?: string
}

interface Props {
  version: Version
}

const props = defineProps<Props>()

const emit = defineEmits<{
  continue: [version: Version]
  duplicate: [version: Version]
  delete: [version: Version]
  update: [versionId: number, data: { name?: string; description?: string }]
}>()

// Store
const versionStore = useVersionStore()

// State for edit modal
const showEditModal = ref(false)
const editForm = ref({
  name: '',
  description: ''
})
const nameInput = ref<HTMLInputElement | null>(null)

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

// Modal functions
const openEditModal = () => {
  console.log('🔧 [VersionCard] openEditModal called')
  console.log('🔧 [VersionCard] Current version:', props.version)

  editForm.value = {
    name: props.version.name,
    description: props.version.description || ''
  }

  console.log('🔧 [VersionCard] editForm initialized:', editForm.value)

  showEditModal.value = true

  nextTick(() => {
    nameInput.value?.focus()
    console.log('🔧 [VersionCard] Modal opened, input focused')
  })
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    name: '',
    description: ''
  }
}

const saveEdit = async () => {
  console.log('🔧 [VersionCard] saveEdit called')
  console.log('🔧 [VersionCard] editForm:', editForm.value)
  console.log('🔧 [VersionCard] props.version.id:', props.version.id)

  if (!editForm.value.name.trim()) {
    console.log('❌ [VersionCard] Name is empty, returning')
    return
  }

  const updateData = {
    name: editForm.value.name.trim(),
    description: editForm.value.description.trim() || undefined
  }

  console.log('🔧 [VersionCard] Calling store.updateVersion with:', props.version.id, updateData)

  try {
    // Call store action directly
    const result = await versionStore.updateVersion(props.version.id, updateData)

    console.log('🔧 [VersionCard] Store result:', result)

    if (result.success) {
      console.log('✅ [VersionCard] Update successful, closing modal')
      // Only close modal after successful update
      closeEditModal()
    } else {
      console.error('❌ [VersionCard] Update failed:', result.error)
      alert('ไม่สามารถบันทึกชื่อ Version ได้: ' + (result.error?.message || 'Unknown error'))
    }
  } catch (error: any) {
    console.error('❌ [VersionCard] Update error:', error)
    alert('เกิดข้อผิดพลาดในการบันทึก: ' + (error.message || 'Unknown error'))
  }
}
</script>
