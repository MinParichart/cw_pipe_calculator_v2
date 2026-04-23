<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="goBack"
          class="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg
            class="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          กลับ
        </button>

        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ version?.name || 'Version' }}
          </h1>
          <p class="mt-1 text-sm text-gray-600">
            Upload reference file (DXF blueprint)
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Loading version...</p>
        </div>
      </div>

      <!-- Upload Form -->
      <div v-else-if="version" class="bg-white rounded-lg shadow-sm p-6">
        <div v-if="!referenceFile">
          <!-- Drop Zone -->
          <div
            @drop.prevent="handleDrop"
            @dragover.prevent
            class="border-2 border-dashed rounded-lg p-12 text-center"
            :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
            @dragenter="isDragging = true"
            @dragleave="isDragging = false"
          >
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="mt-4">
              <label for="file-upload" class="cursor-pointer">
                <span class="mt-2 block text-sm font-medium text-gray-900">
                  Upload a DXF file
                </span>
                <span class="mt-1 block text-sm text-gray-500">
                  or drag and drop
                </span>
                <input
                  id="file-upload"
                  type="file"
                  class="sr-only"
                  accept=".dxf"
                  @change="handleFileSelect"
                />
              </label>
              <p class="mt-2 text-xs text-gray-500">
                DXF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <div v-else class="space-y-6">
          <!-- File Preview -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <svg
                class="h-10 w-10 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">
                  {{ referenceFile.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatFileSize(referenceFile.size) }}
                </p>
              </div>
            </div>
            <button
              @click="removeFile"
              type="button"
              class="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <!-- Options -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Floor
              </label>
              <select
                v-model="uploadOptions.floor"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">Floor 1</option>
                <option value="2">Floor 2</option>
                <option value="3">Floor 3</option>
                <option value="4">Floor 4</option>
                <option value="5">Floor 5</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Scale (optional)
              </label>
              <input
                v-model="uploadOptions.scale"
                type="text"
                placeholder="e.g., 1:100"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            @click="goBack"
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            :disabled="uploading"
          >
            ยกเลิก
          </button>

          <button
            v-if="referenceFile"
            @click="handleUpload"
            type="button"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="uploading"
          >
            <span v-if="uploading">กำลังอัปโหลด...</span>
            <span v-else>ถัดไป → Network Builder</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVersionStore } from '~/stores/versionStore'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const versionStore = useVersionStore()

// State
const loading = ref(true)
const version = ref<any>(null)
const referenceFile = ref<File | null>(null)
const isDragging = ref(false)
const uploading = ref(false)
const error = ref('')

const uploadOptions = ref({
  floor: '1',
  scale: ''
})

// Methods
const loadVersion = async () => {
  loading.value = true
  try {
    const versionId = parseInt(route.params.versionId as string)
    const result = await versionStore.loadVersions(parseInt(route.params.id as string))

    if (result.success) {
      const found = versionStore.versions.find(v => v.id === versionId)
      if (found) {
        version.value = found
        // If already has reference, skip to network
        if (found.referenceLayer) {
          router.replace(`/projects/${route.params.id}/versions/${versionId}/network`)
        }
      } else {
        toast.error('Version not found')
        goBack()
      }
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to load version')
    goBack()
  } finally {
    loading.value = false
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    referenceFile.value = target.files[0]
    error.value = ''
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]
    if (file.name.endsWith('.dxf')) {
      referenceFile.value = file
      error.value = ''
    } else {
      error.value = 'Please upload a DXF file'
    }
  }
}

const removeFile = () => {
  referenceFile.value = null
  error.value = ''
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleUpload = async () => {
  if (!referenceFile.value) return

  uploading.value = true
  error.value = ''

  try {
    // TODO: Implement actual file upload
    // For now, just simulate and navigate to network
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('อัปโหลดไฟล์สำเร็จ')
    router.push(`/projects/${route.params.id}/versions/${version.value.id}/network`)
  } catch (err: any) {
    error.value = err.message || 'อัปโหลดไฟล์ไม่สำเร็จ'
  } finally {
    uploading.value = false
  }
}

const goBack = () => {
  router.push(`/projects/${route.params.id}`)
}

// Load version on mount
onMounted(() => {
  loadVersion()
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard'
})
</script>
