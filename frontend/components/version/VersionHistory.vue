<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-medium text-gray-900">
        ประวัติเวอร์ชัน
      </h2>
      <button
        @click="showSaveModal = true"
        class="btn btn-primary btn-sm"
      >
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        บันทึกเวอร์ชัน
      </button>
    </div>

    <!-- Version List -->
    <div v-if="versions.length > 0" class="space-y-3">
      <div
        v-for="version in sortedVersions"
        :key="version.id"
        class="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        :class="{ 'ring-2 ring-primary-500': selectedVersionId === version.id }"
        @click="selectVersion(version)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-medium text-gray-900">
                {{ version.name }}
              </h3>
              <span
                v-if="version.isCurrent"
                class="badge badge-success badge-xs"
              >
                ปัจจุบัน
              </span>
            </div>
            <p v-if="version.description" class="mt-1 text-sm text-gray-600">
              {{ version.description }}
            </p>
            <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(version.createdAt) }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                v{{ version.versionNumber }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click.stop="startCompare(version)"
              class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              :disabled="compareWithId === version.id || !compareWithId"
              title="เปรียบเทียบ"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
            <button
              @click.stop="restoreVersion(version)"
              class="p-2 text-gray-400 hover:text-success-600 transition-colors"
              title="คืนค่า"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              @click.stop="duplicateVersion(version)"
              class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              title="คัดลอก"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              v-if="!version.isCurrent"
              @click.stop="deleteVersion(version)"
              class="p-2 text-gray-400 hover:text-danger-600 transition-colors"
              title="ลบ"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>ยังไม่มีประวัติเวอร์ชัน</p>
      <p class="text-sm">บันทึกเวอร์ชันแรกของคุณเพื่อเริ่มต้น</p>
    </div>

    <!-- Compare Button -->
    <div
      v-if="compareWithId && selectedVersionId && compareWithId !== selectedVersionId"
      class="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-between"
    >
      <span class="text-sm text-primary-700">
        เปรียบเทียบเวอร์ชัน v{{ getVersionNumber(compareWithId) }} และ v{{ getVersionNumber(selectedVersionId) }}
      </span>
      <button
        @click="compareVersions"
        class="btn btn-primary btn-sm"
      >
        เปรียบเทียบ
      </button>
    </div>

    <!-- Save Version Modal -->
    <div
      v-if="showSaveModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          บันทึกเวอร์ชันใหม่
        </h3>
        <div class="space-y-4">
          <div>
            <label class="label">ชื่อเวอร์ชัน <span class="text-danger-500">*</span></label>
            <input
              v-model="saveForm.name"
              type="text"
              class="input"
              placeholder="เช่น ออกแบบเบื้องต้น"
            />
          </div>
          <div>
            <label class="label">รายละเอียด (ไม่บังคับ)</label>
            <textarea
              v-model="saveForm.description"
              rows="3"
              class="input"
              placeholder="ระบุรายละเอียดเพิ่มเติม..."
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="showSaveModal = false" class="btn btn-secondary">
            ยกเลิก
          </button>
          <button
            @click="saveVersion"
            :disabled="saving || !saveForm.name"
            class="btn btn-primary"
          >
            <span v-if="saving">กำลังบันทึก...</span>
            <span v-else>บันทึก</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Compare Modal -->
    <div
      v-if="showCompareModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
    >
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            เปรียบเทียบเวอร์ชัน
          </h3>
          <button @click="showCompareModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="compareResult" class="grid grid-cols-2 gap-6">
          <!-- Version 1 -->
          <div class="border rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-2">
              {{ compareResult.version1.name }}
            </h4>
            <p class="text-sm text-gray-500 mb-3">
              {{ formatDate(compareResult.version1.createdAt) }}
            </p>

            <!-- Differences -->
            <div v-if="compareResult.differences.criteria.changes.length > 0" class="space-y-2">
              <h5 class="text-sm font-medium text-gray-700">Design Criteria</h5>
              <div
                v-for="change in compareResult.differences.criteria.changes"
                :key="change.path"
                class="text-xs p-2 bg-gray-50 rounded"
              >
                <span class="font-medium">{{ change.path }}:</span>
                <span class="line-through text-gray-400 ml-1">{{ change.oldValue }}</span>
                <span class="text-success-600 ml-1">→ {{ change.newValue }}</span>
              </div>
            </div>
          </div>

          <!-- Version 2 -->
          <div class="border rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-2">
              {{ compareResult.version2.name }}
            </h4>
            <p class="text-sm text-gray-500 mb-3">
              {{ formatDate(compareResult.version2.createdAt) }}
            </p>

            <!-- Summary -->
            <div class="text-sm text-gray-600">
              <p v-if="compareResult.differences.criteria.hasChanges">
                มีการเปลี่ยนแปลง Design Criteria
              </p>
              <p v-if="compareResult.differences.network.hasChanges">
                มีการเปลี่ยนแปลง Network
              </p>
              <p v-if="compareResult.differences.results.hasChanges">
                มีการเปลี่ยนแปลงผลการคำนวณ
              </p>
              <p v-if="!compareResult.differences.criteria.hasChanges &&
                       !compareResult.differences.network.hasChanges &&
                       !compareResult.differences.results.hasChanges">
                ไม่มีการเปลี่ยนแปลง
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button @click="showCompareModal = false" class="btn btn-secondary">
            ปิด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { versionsApi } from '~/composables/useApi'

const props = defineProps<{
  projectId: number
}>()

const toast = useToast()

// State
const versions = ref<any[]>([])
const loading = ref(false)
const selectedVersionId = ref<number | null>(null)
const compareWithId = ref<number | null>(null)

const showSaveModal = ref(false)
const showCompareModal = ref(false)
const saving = ref(false)

const saveForm = ref({
  name: '',
  description: '',
})

const compareResult = ref<any>(null)

// Computed
const sortedVersions = computed(() => {
  return [...versions.value].sort((a, b) => {
    if (a.isCurrent) return -1
    if (b.isCurrent) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

// Methods
const loadVersions = async () => {
  loading.value = true
  try {
    versions.value = await versionsApi.list(props.projectId)
  } catch (error: any) {
    toast.error(error.message || 'Failed to load versions')
  } finally {
    loading.value = false
  }
}

const selectVersion = (version: any) => {
  if (compareWithId.value && !selectedVersionId.value) {
    // Start comparison mode
    selectedVersionId.value = version.id
  } else if (compareWithId.value && selectedVersionId.value) {
    // Change selection
    selectedVersionId.value = version.id
  } else {
    selectedVersionId.value = version.id
  }
}

const startCompare = (version: any) => {
  if (!compareWithId.value) {
    compareWithId.value = version.id
    toast.info('เลือกเวอร์ชันที่ต้องการเปรียบเทียบ')
  } else if (compareWithId.value === version.id) {
    compareWithId.value = null
    selectedVersionId.value = null
  } else {
    selectedVersionId.value = version.id
  }
}

const compareVersions = async () => {
  if (!compareWithId.value || !selectedVersionId.value) return

  try {
    compareResult.value = await versionsApi.compare(compareWithId.value, selectedVersionId.value)
    showCompareModal.value = true
  } catch (error: any) {
    toast.error(error.message || 'Failed to compare versions')
  }
}

const getVersionNumber = (versionId: number) => {
  const version = versions.value.find(v => v.id === versionId)
  return version?.versionNumber || '?'
}

const saveVersion = async () => {
  if (!saveForm.value.name) return

  saving.value = true

  try {
    await versionsApi.create(props.projectId, {
      name: saveForm.value.name,
      description: saveForm.value.description,
    })

    toast.success('Version saved successfully')
    showSaveModal.value = false
    saveForm.value = { name: '', description: '' }

    await loadVersions()
  } catch (error: any) {
    toast.error(error.message || 'Failed to save version')
  } finally {
    saving.value = false
  }
}

const restoreVersion = async (version: any) => {
  if (!confirm(`คืนค่าเวอร์ชัน "${version.name}"?`)) return

  try {
    await versionsApi.restore(version.id)
    toast.success('Version restored successfully')
  } catch (error: any) {
    toast.error(error.message || 'Failed to restore version')
  }
}

const duplicateVersion = async (version: any) => {
  try {
    await versionsApi.duplicate(version.id)
    toast.success('Version duplicated successfully')
    await loadVersions()
  } catch (error: any) {
    toast.error(error.message || 'Failed to duplicate version')
  }
}

const deleteVersion = async (version: any) => {
  if (!confirm(`ลบเวอร์ชัน "${version.name}"?`)) return

  try {
    await versionsApi.delete(version.id)
    toast.success('Version deleted successfully')
    await loadVersions()
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete version')
  }
}

const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Load versions on mount
onMounted(() => {
  loadVersions()
})
</script>
