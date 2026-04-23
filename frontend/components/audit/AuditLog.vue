<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h2 class="text-lg font-medium text-gray-900">ประวัติการกระทำ (Audit Log)</h2>
          <p class="text-sm text-gray-500">บันทึกการกระทำทั้งหมดในโปรเจกต์</p>
        </div>
      </div>
      <button
        @click="exportLogs"
        :disabled="loading || auditLogs.length === 0"
        class="btn btn-secondary text-sm flex items-center gap-1"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
      </button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
      <!-- Action Filter -->
      <div>
        <label class="label text-xs">ประเภทการกระทำ</label>
        <select v-model="filters.action" class="input text-sm">
          <option value="">ทั้งหมด</option>
          <option value="create">สร้าง</option>
          <option value="update">แก้ไข</option>
          <option value="delete">ลบ</option>
          <option value="login">เข้าสู่ระบบ</option>
          <option value="logout">ออกจากระบบ</option>
          <option value="calculate">คำนวณ</option>
        </select>
      </div>

      <!-- Entity Filter -->
      <div>
        <label class="label text-xs">เอนทิตี</label>
        <select v-model="filters.entity" class="input text-sm">
          <option value="">ทั้งหมด</option>
          <option value="project">โปรเจกต์</option>
          <option value="network">เครือข่าย</option>
          <option value="node">จุดเชื่อม</option>
          <option value="pipe">ท่อ</option>
          <option value="fixture">สุขภัณฑ์</option>
          <option value="version">เวอร์ชัน</option>
        </select>
      </div>

      <!-- Date From -->
      <div>
        <label class="label text-xs">จากวันที่</label>
        <input
          v-model="filters.dateFrom"
          type="date"
          class="input text-sm"
        >
      </div>

      <!-- Date To -->
      <div>
        <label class="label text-xs">ถึงวันที่</label>
        <input
          v-model="filters.dateTo"
          type="date"
          class="input text-sm"
        >
      </div>

      <!-- Search -->
      <div>
        <label class="label text-xs">ค้นหา</label>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
            placeholder="ค้นหา..."
          >
          <svg class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
      <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div class="text-2xl font-bold text-blue-600">{{ filteredLogs.length }}</div>
        <div class="text-xs text-blue-700">ทั้งหมด</div>
      </div>
      <div class="bg-green-50 rounded-lg p-3 border border-green-200">
        <div class="text-2xl font-bold text-green-600">{{ actionCounts.create || 0 }}</div>
        <div class="text-xs text-green-700">สร้าง</div>
      </div>
      <div class="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
        <div class="text-2xl font-bold text-yellow-600">{{ actionCounts.update || 0 }}</div>
        <div class="text-xs text-yellow-700">แก้ไข</div>
      </div>
      <div class="bg-red-50 rounded-lg p-3 border border-red-200">
        <div class="text-2xl font-bold text-red-600">{{ actionCounts.delete || 0 }}</div>
        <div class="text-xs text-red-700">ลบ</div>
      </div>
      <div class="bg-purple-50 rounded-lg p-3 border border-purple-200">
        <div class="text-2xl font-bold text-purple-600">{{ actionCounts.calculate || 0 }}</div>
        <div class="text-xs text-purple-700">คำนวณ</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    </div>

    <!-- Audit Log Table -->
    <div v-else-if="paginatedLogs.length > 0" class="overflow-x-auto border rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              เวลา
            </th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ผู้ใช้
            </th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              การกระทำ
            </th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              เอนทิตี
            </th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              รายละเอียด
            </th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IP Address
            </th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              สถานะ
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="log in paginatedLogs"
            :key="log.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
              <div class="font-medium text-gray-900">{{ formatDate(log.timestamp) }}</div>
              <div class="text-xs text-gray-500">{{ formatTime(log.timestamp) }}</div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                  <svg class="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ log.userName || 'Unknown' }}</div>
                  <div class="text-xs text-gray-500">{{ log.userEmail || '-' }}</div>
                </div>
              </div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <span class="badge" :class="getActionBadgeClass(log.action)">
                {{ getActionText(log.action) }}
              </span>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-sm">
              <span class="font-medium text-gray-900">{{ getEntityText(log.entityType) }}</span>
              <div v-if="log.entityName" class="text-xs text-gray-500">{{ log.entityName }}</div>
            </td>
            <td class="px-3 py-2 text-sm text-gray-600 max-w-xs truncate" :title="log.description">
              {{ log.description || '-' }}
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600 font-mono text-xs">
              {{ log.ipAddress || '-' }}
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <span class="badge" :class="getStatusBadgeClass(log.status)">
                {{ getStatusText(log.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500">ไม่พบประวัติการกระทำ</p>
      <p class="text-sm text-gray-400 mt-1">ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น</p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredLogs.length > itemsPerPage" class="flex items-center justify-between mt-4 pt-4 border-t">
      <div class="text-sm text-gray-600">
        แสดง {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredLogs.length) }}
        จาก {{ filteredLogs.length }} รายการ
      </div>
      <div class="flex gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="btn btn-secondary btn-sm"
        >
          ก่อนหน้า
        </button>
        <span class="px-3 py-1 bg-gray-100 rounded text-sm">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="btn btn-secondary btn-sm"
        >
          ถัดไป
        </button>
      </div>
    </div>

    <!-- Log Detail Modal -->
    <div
      v-if="selectedLog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="selectedLog = null"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900">รายละเอียดการกระทำ</h3>
          <button @click="selectedLog = null" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Timestamp -->
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div class="text-sm text-gray-600">เวลา</div>
              <div class="font-medium text-gray-900">
                {{ formatDateFull(selectedLog.timestamp) }}
              </div>
            </div>
          </div>

          <!-- User -->
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <div class="text-sm text-gray-600">ผู้ใช้</div>
              <div class="font-medium text-gray-900">
                {{ selectedLog.userName || 'Unknown' }} ({{ selectedLog.userEmail || '-' }})
              </div>
            </div>
          </div>

          <!-- Action -->
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <div class="text-sm text-gray-600">การกระทำ</div>
              <div class="font-medium">
                <span class="badge" :class="getActionBadgeClass(selectedLog.action)">
                  {{ getActionText(selectedLog.action) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Entity -->
          <div v-if="selectedLog.entityType" class="flex items-center gap-3">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <div>
              <div class="text-sm text-gray-600">เอนทิตี</div>
              <div class="font-medium text-gray-900">
                {{ getEntityText(selectedLog.entityType) }}
                <span v-if="selectedLog.entityName" class="text-gray-600">({{ selectedLog.entityName }})</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="selectedLog.description" class="flex items-start gap-3">
            <svg class="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <div class="text-sm text-gray-600">รายละเอียด</div>
              <div class="font-medium text-gray-900 whitespace-pre-wrap">{{ selectedLog.description }}</div>
            </div>
          </div>

          <!-- IP Address -->
          <div v-if="selectedLog.ipAddress" class="flex items-center gap-3">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div class="text-sm text-gray-600">IP Address</div>
              <div class="font-medium text-gray-900 font-mono">{{ selectedLog.ipAddress }}</div>
            </div>
          </div>

          <!-- Status -->
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div class="text-sm text-gray-600">สถานะ</div>
              <div class="font-medium">
                <span class="badge" :class="getStatusBadgeClass(selectedLog.status)">
                  {{ getStatusText(selectedLog.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Changes -->
          <div v-if="selectedLog.changes && Object.keys(selectedLog.changes).length > 0" class="mt-4">
            <h4 class="font-semibold text-gray-900 mb-2">การเปลี่ยนแปลง</h4>
            <div class="bg-gray-50 rounded-lg p-3 text-sm">
              <div v-for="(value, key) in selectedLog.changes" :key="key" class="flex justify-between py-1">
                <span class="text-gray-600">{{ key }}:</span>
                <span class="font-medium text-gray-900">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-end">
          <button @click="selectedLog = null" class="btn btn-secondary">
            ปิด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  projectId?: number
  limit?: number
}>()

const emit = defineEmits<{
  logClick: [log: any]
}>()

const { projectsApi } = useApi()
const toast = useToast()

// State
const loading = ref(false)
const auditLogs = ref<any[]>([])
const selectedLog = ref<any>(null)
const currentPage = ref(1)
const itemsPerPage = 20
const searchQuery = ref('')

const filters = ref({
  action: '',
  entity: '',
  dateFrom: '',
  dateTo: '',
})

// Computed
const filteredLogs = computed(() => {
  let result = auditLogs.value

  // Apply filters
  if (filters.value.action) {
    result = result.filter(log => log.action === filters.value.action)
  }
  if (filters.value.entity) {
    result = result.filter(log => log.entityType === filters.value.entity)
  }
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom)
    result = result.filter(log => new Date(log.timestamp) >= fromDate)
  }
  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo)
    toDate.setHours(23, 59, 59, 999)
    result = result.filter(log => new Date(log.timestamp) <= toDate)
  }

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(log =>
      log.userName?.toLowerCase().includes(query) ||
      log.userEmail?.toLowerCase().includes(query) ||
      log.action?.toLowerCase().includes(query) ||
      log.entityType?.toLowerCase().includes(query) ||
      log.entityName?.toLowerCase().includes(query) ||
      log.description?.toLowerCase().includes(query) ||
      log.ipAddress?.includes(query)
    )
  }

  // Sort by timestamp (newest first)
  result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return result
})

const actionCounts = computed(() => {
  return filteredLogs.value.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1
    return acc
  }, {} as Record<string, number>)
})

const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / itemsPerPage)
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLogs.value.slice(start, end)
})

// Methods
const loadAuditLogs = async () => {
  loading.value = true

  try {
    const limit = props.limit || 1000
    const logs = await projectsApi.getAuditLogs(props.projectId!, limit)
    auditLogs.value = logs || []
  } catch (error: any) {
    console.error('Failed to load audit logs:', error)
    toast.error(error.message || 'โหลดประวัติการกระทำไม่สำเร็จ')

    // Mock data for demo purposes
    auditLogs.value = generateMockLogs()
  } finally {
    loading.value = false
  }
}

const getActionBadgeClass = (action: string) => {
  const classes: Record<string, string> = {
    'create': 'bg-green-100 text-green-800',
    'update': 'bg-yellow-100 text-yellow-800',
    'delete': 'bg-red-100 text-red-800',
    'login': 'bg-blue-100 text-blue-800',
    'logout': 'bg-gray-100 text-gray-800',
    'calculate': 'bg-purple-100 text-purple-800',
  }
  return classes[action] || 'bg-gray-100 text-gray-800'
}

const getActionText = (action: string) => {
  const texts: Record<string, string> = {
    'create': 'สร้าง',
    'update': 'แก้ไข',
    'delete': 'ลบ',
    'login': 'เข้าสู่ระบบ',
    'logout': 'ออกจากระบบ',
    'calculate': 'คำนวณ',
  }
  return texts[action] || action
}

const getEntityText = (entityType: string) => {
  const texts: Record<string, string> = {
    'project': 'โปรเจกต์',
    'network': 'เครือข่าย',
    'node': 'จุดเชื่อม',
    'pipe': 'ท่อ',
    'fixture': 'สุขภัณฑ์',
    'version': 'เวอร์ชัน',
    'criteria': 'เกณฑ์การออกแบบ',
  }
  return texts[entityType] || entityType
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'success': 'bg-green-100 text-green-800',
    'error': 'bg-red-100 text-red-800',
    'pending': 'bg-yellow-100 text-yellow-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'success': 'สำเร็จ',
    'error': 'ผิดพลาด',
    'pending': 'รอดำเนินการ',
  }
  return texts[status] || status
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  })
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDateFull = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const exportLogs = () => {
  const data = filteredLogs.value.map(log => ({
    timestamp: formatDateFull(log.timestamp),
    user: log.userName || 'Unknown',
    email: log.userEmail || '-',
    action: getActionText(log.action),
    entity: getEntityText(log.entityType),
    entityName: log.entityName || '-',
    description: log.description || '-',
    ipAddress: log.ipAddress || '-',
    status: getStatusText(log.status),
  }))

  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).map(v => `"${v}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)

  toast.success('Export ประวัติการกระทำเรียบร้อย')
}

// Generate mock logs for demo
const generateMockLogs = () => {
  const actions = ['create', 'update', 'delete', 'calculate']
  const entities = ['project', 'network', 'node', 'pipe', 'fixture', 'version']
  const users = [
    { name: 'สมชาย ใจดี', email: 'somchai@example.com' },
    { name: 'วิภา สุขใจ', email: 'wipha@example.com' },
    { name: 'Admin User', email: 'admin@example.com' },
  ]

  const logs = []
  const now = new Date()

  for (let i = 0; i < 50; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    const entity = entities[Math.floor(Math.random() * entities.length)]
    const user = users[Math.floor(Math.random() * users.length)]
    const timestamp = new Date(now.getTime() - i * 3600000) // Every hour

    logs.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      userName: user.name,
      userEmail: user.email,
      action: action,
      entityType: entity,
      entityName: `${entity.toUpperCase()}_${Math.floor(Math.random() * 100)}`,
      description: `${getActionText(action)}${getEntityText(entity)} เรียบร้อย`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      status: Math.random() > 0.1 ? 'success' : 'error',
      changes: action === 'update' ? {
        field1: 'old_value → new_value',
        field2: 'old_value → new_value',
      } : null,
    })
  }

  return logs
}

// Watch for changes
watch([filters, searchQuery], () => {
  currentPage.value = 1
})

// Load logs on mount
onMounted(() => {
  if (props.projectId) {
    loadAuditLogs()
  } else {
    // Generate mock logs if no projectId
    auditLogs.value = generateMockLogs()
  }
})
</script>
