<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Version Control</h1>
          <p class="mt-1 text-sm text-gray-600">
            บันทึกและเปรียบเทียบ version ต่างๆ ของระบบท่อน้ำดี
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="mb-6 flex gap-3">
          <button
            @click="showSaveVersionModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            บันทึก Version
          </button>
        </div>

        <!-- Versions Grid -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-sm text-gray-600">กำลังโหลด...</p>
        </div>
        <div v-else-if="versions.length === 0" class="text-center py-12">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">ยังไม่มี Version</h3>
          <p class="text-gray-600">กดปุ่มบันทึก Version เพื่อบันทึกสถานะปัจจุบัน</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div
            v-for="version in versions"
            :key="version.id"
            @click="selectVersion(version)"
            class="bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-lg"
            :class="isVersionSelected(version)
              ? 'border-blue-500 shadow-md'
              : 'border-gray-300 hover:border-blue-400'"
          >
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-bold">
                  {{ version.name }}
                </span>
                <span v-if="version.isCurrent" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Current
                </span>
              </div>

              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ version.description }}</h3>

              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>Fixtures:</span>
                  <span class="font-medium">{{ version.fixtureCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Pipes:</span>
                  <span class="font-medium">{{ version.pipeCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Pressure:</span>
                  <span class="font-medium">{{ version.avgPressure }} bar</span>
                </div>
              </div>

              <div class="mt-3 pt-3 border-t border-gray-200">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs text-gray-500">{{ formatTimestamp(version.createdAt) }}</span>
                </div>
                <div class="flex gap-2">
                  <button
                    @click.stop="editVersion(version)"
                    :disabled="isRestoring || isDeleting"
                    class="flex-1 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    แก้ไข
                  </button>
                  <button
                    @click.stop="deleteVersion(version)"
                    :disabled="isRestoring || isDeleting"
                    class="flex-1 text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison Section -->
        <div v-if="selectedVersions.length === 2" class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">เปรียบเทียบ Version</h3>

          <!-- Selected Versions Header -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="p-3 bg-purple-50 rounded-lg">
              <p class="text-xs text-purple-700">Version 1</p>
              <p class="font-bold text-purple-900">{{ selectedVersions[0].name }}</p>
              <p class="text-xs text-purple-600">{{ formatTimestamp(selectedVersions[0].createdAt) }}</p>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg">
              <p class="text-xs text-blue-700">Version 2</p>
              <p class="font-bold text-blue-900">{{ selectedVersions[1].name }}</p>
              <p class="text-xs text-blue-600">{{ formatTimestamp(selectedVersions[1].createdAt) }}</p>
            </div>
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-4 gap-3 mb-6">
            <div class="p-3 bg-green-50 rounded-lg text-center">
              <p class="text-xs text-green-700">Fixtures</p>
              <p class="font-bold text-green-900">+{{ comparisonData.fixtureDiff }}</p>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg text-center">
              <p class="text-xs text-blue-700">Pipes</p>
              <p class="font-bold text-blue-900">+{{ comparisonData.pipeDiff }}</p>
            </div>
            <div class="p-3 bg-orange-50 rounded-lg text-center">
              <p class="text-xs text-orange-700">Pressure</p>
              <p class="font-bold text-orange-900">{{ comparisonData.pressureDiff }} bar</p>
            </div>
            <div class="p-3 bg-red-50 rounded-lg text-center">
              <p class="text-xs text-red-700">Cost</p>
              <p class="font-bold text-red-900">{{ comparisonData.costDiff }}%</p>
            </div>
          </div>

          <!-- Comparison Table -->
          <VersionComparison
            :version1="selectedVersions[0]"
            :version2="selectedVersions[1]"
          />

          <!-- Close Comparison Button -->
          <div class="mt-4 text-center">
            <button
              @click="clearSelection"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ปิดการเปรียบเทียบ
            </button>
          </div>
        </div>

        <!-- Select for Comparison Hint -->
        <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p class="text-sm text-yellow-800">
            เลือก 2 versions เพื่อเปรียบเทียบ (เลือกแล้ว {{ selectedVersions.length }}/2)
          </p>
        </div>

        <!-- Audit Log Section -->
        <div class="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Audit Log</h3>
          <AuditLogViewer :logs="auditLogs" />
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-6 flex gap-3">
          <BackButton @click="goToPrevStep" />
          <button
            @click="goToDashboard"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>

    <!-- Save Version Modal -->
    <div
      v-if="showSaveVersionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">บันทึก Version</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ Version</label>
            <input
              v-model="newVersion.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="เช่น Version 1"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
            <textarea
              v-model="newVersion.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="อธิบายการเปลี่ยนแปลงใน version นี้"
            />
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            @click="saveVersion"
            :disabled="isSaving || !newVersion.name"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
          <button
            @click="showSaveVersionModal = false"
            :disabled="isSaving"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Version Modal -->
    <div
      v-if="showEditVersionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">แก้ไข Version</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ Version</label>
            <input
              v-model="editVersionForm.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="เช่น Version 1"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
            <textarea
              v-model="editVersionForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="อธิบายการเปลี่ยนแปลงใน version นี้"
            />
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            @click="updateVersion"
            :disabled="isSaving || !editVersionForm.name"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
          <button
            @click="showEditVersionModal = false"
            :disabled="isSaving"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VersionComparison from '~/components/versions/VersionComparison.vue'
import AuditLogViewer from '~/components/versions/AuditLogViewer.vue'
import NextStepButton from '~/components/navigation/NextStepButton.vue'
import BackButton from '~/components/navigation/BackButton.vue'
import { versionsApi, projectsApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// State
const projectId = computed(() => parseInt(route.params.id as string))
const versions = ref<any[]>([])
const selectedVersions = ref<any[]>([])
const auditLogs = ref<any[]>([])
const showSaveVersionModal = ref(false)
const newVersion = ref({
  name: '',
  description: ''
})
const showEditVersionModal = ref(false)
const editingVersion = ref<any>(null)
const editVersionForm = ref({
  name: '',
  description: ''
})
const isLoading = ref(true)
const isSaving = ref(false)
const isRestoring = ref(false)
const isDeleting = ref(false)

// Helper: Parse network snapshot
const parseNetwork = (version: any) => {
  if (!version.snapshotNetwork) return null

  try {
    const network = JSON.parse(version.snapshotNetwork)

    // Debug: Log parsed network for specific version
    if (version.name?.includes('88') || version.description?.includes('88') || version.id === 88) {
      console.log(`🔍 Parsing network for version ${version.name} (ID: ${version.id}):`)
      console.log(`  Nodes: ${network.nodes?.length || 0}`)
      console.log(`  Pipes: ${network.pipes?.length || 0}`)

      // Check for duplicate pipe IDs
      const pipeIds = network.pipes?.map((p: any) => p.id) || []
      const uniqueIds = new Set(pipeIds)
      if (pipeIds.length !== uniqueIds.size) {
        console.log(`  ⚠️ DUPLICATE PIPE IDS IN PARSED NETWORK!`)
        console.log(`     Total: ${pipeIds.length}, Unique: ${uniqueIds.size}`)
        console.log(`     Duplicate IDs:`, [...new Set(pipeIds.filter((id, index) => pipeIds.indexOf(id) !== index))])

        // Show all pipe IDs
        console.log(`     All pipe IDs:`, pipeIds)
      }

      // Count fixtures in parsed network
      const fixtureCount = network.nodes?.reduce((sum: number, n: any) => sum + (n.fixtures?.length || 0), 0) || 0
      console.log(`  Fixtures (by length): ${fixtureCount}`)

      // Count fixtures by quantity
      const fixturesByQuantity = network.nodes?.reduce((sum: number, n: any) => {
        return sum + (n.fixtures?.reduce((fSum: number, f: any) => fSum + (f.quantity || 1), 0) || 0)
      }, 0) || 0
      console.log(`  Fixtures (by quantity): ${fixturesByQuantity}`)

      // Log each node's fixtures
      network.nodes?.forEach((n: any) => {
        const nodeFixtures = n.fixtures || []
        if (nodeFixtures.length > 0) {
          console.log(`  Node ${n.label || n.id}:`)
          nodeFixtures.forEach((f: any) => {
            console.log(`    - ${f.type} x${f.quantity}`)
          })
        }
      })

      // Log all pipes
      network.pipes?.forEach((p: any, idx: number) => {
        console.log(`  Pipe ${idx + 1}: ID=${p.id}, ${p.sourceNodeId} → ${p.targetNodeId}, ${p.nominalSize}`)
      })
    }

    return network
  } catch (error) {
    console.error('❌ Failed to parse network snapshot:', error)
    return null
  }
}

// Helper: Parse results snapshot
const parseResults = (version: any) => {
  if (!version.snapshotResults) return []
  try {
    return JSON.parse(version.snapshotResults)
  } catch {
    return []
  }
}

// Helper: Get fixture count from snapshot
const getFixtureCount = (version: any) => {
  const network = parseNetwork(version)
  if (!network) return 0

  // Count by fixtures.length (number of fixture records)
  const countByRecords = network.nodes?.reduce((sum: number, n: any) => sum + (n.fixtures?.length || 0), 0) || 0

  // Count by quantity (actual number of fixtures)
  const countByQuantity = network.nodes?.reduce((sum: number, n: any) => {
    return sum + (n.fixtures?.reduce((fSum: number, f: any) => fSum + (f.quantity || 1), 0) || 0)
  }, 0) || 0

  // Log all versions for debugging
  console.log(`📊 Version "${version.name || version.id}" Fixture Count:`)
  console.log(`   - By records: ${countByRecords} (number of fixture entries)`)
  console.log(`   - By quantity: ${countByQuantity} ✅ (actual fixture count)`)

  // Log each node's fixtures
  network.nodes?.forEach((node: any) => {
    if (node.fixtures && node.fixtures.length > 0) {
      const nodeFixturesCount = node.fixtures.reduce((sum: number, f: any) => sum + (f.quantity || 1), 0)
      console.log(`   - Node "${node.label || node.id}": ${nodeFixturesCount} fixtures (${node.fixtures.length} records)`)
      node.fixtures.forEach((f: any) => {
        console.log(`     • ${f.type} x${f.quantity || 1}`)
      })
    }
  })

  // Log if this is the version we're investigating
  if (version.name?.includes('88') || version.description?.includes('88') || version.id === 88) {
    console.log(`🔍 Version ${version.name} (ID: ${version.id})`)
    console.log(`  Count by records: ${countByRecords}`)
    console.log(`  Count by quantity: ${countByQuantity}`)
    console.log(`  Using: ${countByQuantity} (countByQuantity with quantity sum) ✅`)
  }

  return countByQuantity
}

// Helper: Get pipe count from snapshot
const getPipeCount = (version: any) => {
  const network = parseNetwork(version)
  if (!network) return 0

  const pipeCount = network.pipes?.length || 0

  // Log if this is the version we're investigating
  if (version.name?.includes('88') || version.description?.includes('88') || version.id === 88) {
    console.log(`🔍 Version ${version.name} (ID: ${version.id}) - Pipes`)
    console.log(`  Pipe count: ${pipeCount}`)
    console.log(`  Pipe IDs:`, network.pipes?.map((p: any) => p.id))

    // Check for duplicate pipe IDs
    const pipeIds = network.pipes?.map((p: any) => p.id) || []
    const uniqueIds = new Set(pipeIds)
    if (pipeIds.length !== uniqueIds.size) {
      console.log(`  ⚠️ DUPLICATE PIPE IDS! Total: ${pipeIds.length}, Unique: ${uniqueIds.size}`)
    }
  }

  return pipeCount
}

// Helper: Get average pressure from results
const getAvgPressure = (version: any) => {
  const results = parseResults(version)
  if (!results || results.length === 0) return 0
  const avgVelocity = results.reduce((sum: number, r: any) => sum + (r.velocity || 0), 0) / results.length
  return (avgVelocity * 0.15).toFixed(1)
}

// Load versions
const loadVersions = async () => {
  try {
    isLoading.value = true
    const data = await versionsApi.list(projectId.value)

    console.log('📋 Loaded versions:', data.length)

    // Enrich versions with computed properties
    versions.value = data.map((v: any) => {
      const fixtureCount = getFixtureCount(v)
      const pipeCount = getPipeCount(v)
      const avgPressure = parseFloat(getAvgPressure(v))

      // Debug all versions
      console.log(`📦 Version ${v.name} (ID: ${v.id}, v${v.versionNumber}):`)
      console.log(`  Fixtures: ${fixtureCount}`)
      console.log(`  Pipes: ${pipeCount}`)
      console.log(`  Avg Pressure: ${avgPressure} bar`)
      console.log(`  Created: ${formatTimestamp(v.createdAt)}`)

      return {
        ...v,
        fixtureCount,
        pipeCount,
        avgPressure,
      }
    })

    console.log(`✅ Total versions displayed: ${versions.value.length}`)
  } catch (error: any) {
    console.error('❌ Failed to load versions:', error)
    toast.error(error.message || 'Failed to load versions')
  } finally {
    isLoading.value = false
  }
}

// Load audit logs
const loadAuditLogs = async () => {
  try {
    const data = await projectsApi.getAuditLogs(projectId.value)
    auditLogs.value = data
  } catch (error: any) {
    console.error('Failed to load audit logs:', error)
  }
}

// Refresh all data
const refreshData = async () => {
  await Promise.all([loadVersions(), loadAuditLogs()])
}

// Computed comparison data
const comparisonData = computed(() => {
  if (selectedVersions.value.length !== 2) return {}

  const v1 = selectedVersions.value[0]
  const v2 = selectedVersions.value[1]

  return {
    fixtureDiff: v2.fixtureCount - v1.fixtureCount,
    pipeDiff: v2.pipeCount - v1.pipeCount,
    pressureDiff: (v2.avgPressure - v1.avgPressure).toFixed(1),
    costDiff: '+15' // Mock - TODO: Calculate from pipe sizes
  }
})

// Methods
const isVersionSelected = (version: any) => {
  return selectedVersions.value.some(v => v.id === version.id)
}

const selectVersion = (version: any) => {
  const index = selectedVersions.value.findIndex(v => v.id === version.id)

  if (index >= 0) {
    // Deselect
    selectedVersions.value.splice(index, 1)
  } else {
    // Select (max 2)
    if (selectedVersions.value.length < 2) {
      selectedVersions.value.push(version)
    } else {
      // Replace first selection
      selectedVersions.value.shift()
      selectedVersions.value.push(version)
    }
  }
}

const clearSelection = () => {
  selectedVersions.value = []
}

const saveVersion = async () => {
  if (!newVersion.value.name) {
    toast.error('กรุณาระบุชื่อ Version')
    return
  }

  try {
    isSaving.value = true
    await versionsApi.create(projectId.value, newVersion.value)
    toast.success(`บันทึก "${newVersion.value.name}" เรียบร้อย`)
    showSaveVersionModal.value = false
    newVersion.value = { name: '', description: '' }
    await refreshData()
  } catch (error: any) {
    toast.error(error.message || 'บันทึก Version ไม่สำเร็จ')
  } finally {
    isSaving.value = false
  }
}

const restoreVersion = async (version: any) => {
  if (!confirm(`ยืนยันที่จะกู้คืน "${version.name}"?`)) {
    return
  }

  try {
    isRestoring.value = true
    await versionsApi.restore(version.id)
    toast.success(`กู้คืน "${version.name}" เรียบร้อย`)
    await refreshData()
  } catch (error: any) {
    toast.error(error.message || 'กู้คืน Version ไม่สำเร็จ')
  } finally {
    isRestoring.value = false
  }
}

const editVersion = (version: any) => {
  editingVersion.value = version
  editVersionForm.value = {
    name: version.name,
    description: version.description || ''
  }
  showEditVersionModal.value = true
}

const updateVersion = async () => {
  if (!editVersionForm.value.name) {
    toast.error('กรุณาระบุชื่อ Version')
    return
  }

  try {
    isSaving.value = true
    await versionsApi.update(editingVersion.value.id, {
      name: editVersionForm.value.name,
      description: editVersionForm.value.description
    })
    toast.success(`แก้ไข "${editVersionForm.value.name}" เรียบร้อย`)
    showEditVersionModal.value = false
    editingVersion.value = null
    editVersionForm.value = { name: '', description: '' }
    await refreshData()
  } catch (error: any) {
    toast.error(error.message || 'แก้ไข Version ไม่สำเร็จ')
  } finally {
    isSaving.value = false
  }
}

const deleteVersion = async (version: any) => {
  if (!confirm(`ยืนยันที่จะลบ "${version.name}"?\n\nการกระทำนี้ไม่สามารถย้อนกลับได้!`)) {
    return
  }

  try {
    isDeleting.value = true
    await versionsApi.delete(version.id)
    toast.success(`ลบ "${version.name}" เรียบร้อย`)
    await refreshData()
  } catch (error: any) {
    toast.error(error.message || 'ลบ Version ไม่สำเร็จ')
  } finally {
    isDeleting.value = false
  }
}

const formatTimestamp = (date: any) => {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return '-'

    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  } catch {
    return '-'
  }
}

const goToDashboard = () => {
  router.push('/projects')
}

const goToPrevStep = () => {
  router.push(`/projects/${route.params.id}/calculation`)
}

// Load data on mount
onMounted(async () => {
  await refreshData()
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard',
})
</script>
