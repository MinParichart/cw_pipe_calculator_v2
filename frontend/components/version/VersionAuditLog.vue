<template>
  <div class="audit-log-container">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-800">
        📊 Version Audit Log
      </h2>
      <p class="text-slate-600 mt-1">
        Track all changes and activities for this version
      </p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">Total Changes</p>
            <p class="text-2xl font-bold text-slate-800">{{ auditLogs.length }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-xl">📋</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">Today</p>
            <p class="text-2xl font-bold text-slate-800">{{ todayChanges }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span class="text-xl">📅</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">This Week</p>
            <p class="text-2xl font-bold text-slate-800">{{ weekChanges }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span class="text-xl">📆</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">Last Edited</p>
            <p class="text-sm font-semibold text-slate-800">{{ lastEdited }}</p>
          </div>
          <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <span class="text-xl">⏰</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg p-4 shadow-sm border border-slate-200 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-slate-700">Filter:</label>
          <select
            v-model="selectedFilter"
            class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Changes</option>
            <option value="CREATE_VERSION">Created</option>
            <option value="UPDATE_NETWORK">Network</option>
            <option value="UPDATE_FIXTURES">Fixtures</option>
            <option value="CALCULATE">Calculation</option>
            <option value="APPLY_PIPE_SIZE">Pipe Size</option>
            <option value="UPLOAD_REFERENCE">Reference</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-slate-700">Search:</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search logs..."
            class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <button
          @click="refreshLogs"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          🔄 Refresh
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-slate-600 mt-4">Loading audit logs...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <span class="text-2xl mr-3">❌</span>
        <div>
          <h3 class="font-semibold text-red-800">Error loading audit logs</h3>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredLogs.length === 0" class="bg-white rounded-lg p-12 shadow-sm border border-slate-200">
      <div class="text-center">
        <span class="text-6xl">📭</span>
        <h3 class="text-xl font-semibold text-slate-800 mt-4">No audit logs found</h3>
        <p class="text-slate-600 mt-2">
          {{ selectedFilter !== 'all' ? 'Try changing your filter' : 'No activities recorded for this version yet' }}
        </p>
      </div>
    </div>

    <!-- Audit Log Timeline -->
    <div v-else class="space-y-4">
      <div v-for="(group, date) in groupedLogs" :key="date" class="bg-white rounded-lg shadow-sm border border-slate-200">
        <!-- Date Header -->
        <div class="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <h3 class="font-semibold text-slate-800">{{ date }}</h3>
        </div>

        <!-- Log Entries -->
        <div class="divide-y divide-slate-100">
          <div
            v-for="log in group"
            :key="log.id"
            class="p-6 hover:bg-slate-50 transition-colors"
          >
            <div class="flex items-start gap-4">
              <!-- Icon -->
              <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" :class="getActionColor(log.action)">
                <span class="text-xl">{{ getActionIcon(log.action) }}</span>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-semibold text-slate-800">{{ getActionTitle(log.action) }}</p>
                    <p class="text-sm text-slate-600 mt-1">{{ getActionDescription(log) }}</p>

                    <!-- Metadata -->
                    <div class="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                      <span class="flex items-center gap-1">
                        <span>👤</span>
                        {{ log.user?.name || log.user?.email || 'System' }}
                      </span>
                      <span class="flex items-center gap-1">
                        <span>⏰</span>
                        {{ formatTime(log.createdAt) }}
                      </span>
                      <span v-if="log.ipAddress" class="flex items-center gap-1">
                        <span>🌐</span>
                        {{ log.ipAddress }}
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2 ml-4">
                    <button
                      v-if="canViewDetails(log)"
                      @click="viewDetails(log)"
                      class="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      v-if="canRevert(log)"
                      @click="revertChange(log)"
                      class="px-3 py-1 text-xs font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded transition-colors"
                    >
                      Revert
                    </button>
                  </div>
                </div>

                <!-- Expandable Details -->
                <div v-if="expandedLogId === log.id" class="mt-4 p-4 bg-slate-50 rounded-lg">
                  <pre class="text-xs text-slate-700 whitespace-pre-wrap">{{ formatDetails(log) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" @click.stop>
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-800">Audit Log Details</h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <pre class="text-sm text-slate-700 whitespace-pre-wrap">{{ selectedLogDetails }}</pre>
        </div>
        <div class="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            @click="showModal = false"
            class="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { versionsApi } from '~/composables/useApi'

interface AuditLog {
  id: number
  projectId: number
  versionId: number
  userId: number
  action: string
  entity: string
  entityId?: number
  details?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    email: string
    name?: string
  }
}

const route = useRoute()
const versionId = computed(() => route.params.versionId as string)

// State
const auditLogs = ref<AuditLog[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedFilter = ref('all')
const searchQuery = ref('')
const expandedLogId = ref<number | null>(null)
const showModal = ref(false)
const selectedLogDetails = ref('')

// Computed
const filteredLogs = computed(() => {
  let logs = auditLogs.value

  // Filter by action type
  if (selectedFilter.value !== 'all') {
    logs = logs.filter(log => log.action === selectedFilter.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    logs = logs.filter(log =>
      log.action.toLowerCase().includes(query) ||
      log.entity.toLowerCase().includes(query) ||
      log.details?.toLowerCase().includes(query) ||
      log.user?.email?.toLowerCase().includes(query) ||
      log.user?.name?.toLowerCase().includes(query)
    )
  }

  return logs
})

const groupedLogs = computed(() => {
  const groups: Record<string, AuditLog[]> = {}

  filteredLogs.value.forEach(log => {
    const date = formatDate(log.createdAt)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(log)
  })

  // Sort groups by date (newest first)
  const sortedGroups: Record<string, AuditLog[]> = {}
  Object.keys(groups).sort((a, b) => {
    // Custom sort to handle "TODAY", "YESTERDAY", etc.
    const dateA = groups[a][0].createdAt
    const dateB = groups[b][0].createdAt
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  }).forEach(key => {
    sortedGroups[key] = groups[key]
  })

  return sortedGroups
})

const todayChanges = computed(() => {
  const today = new Date().toDateString()
  return auditLogs.value.filter(log =>
    new Date(log.createdAt).toDateString() === today
  ).length
})

const weekChanges = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return auditLogs.value.filter(log =>
    new Date(log.createdAt) >= weekAgo
  ).length
})

const lastEdited = computed(() => {
  if (auditLogs.value.length === 0) return 'Never'

  const latestLog = auditLogs.value.reduce((latest, log) =>
    new Date(log.createdAt) > new Date(latest.createdAt) ? log : latest
  )

  return formatRelativeTime(latestLog.createdAt)
})

// Methods
const loadAuditLogs = async () => {
  try {
    loading.value = true
    error.value = null

    const logs = await versionsApi.getAuditLogs(parseInt(versionId.value))
    auditLogs.value = logs
  } catch (err: any) {
    error.value = err.message || 'Failed to load audit logs'
    console.error('Error loading audit logs:', err)
  } finally {
    loading.value = false
  }
}

const refreshLogs = () => {
  loadAuditLogs()
}

const getActionIcon = (action: string): string => {
  const icons: Record<string, string> = {
    CREATE_VERSION: '✨',
    UPDATE_NETWORK: '🌐',
    UPDATE_FIXTURES: '📝',
    CALCULATE: '🧮',
    APPLY_PIPE_SIZE: '🔧',
    UPLOAD_REFERENCE: '📁',
    DUPLICATE: '📋',
    RESTORE: '⏪',
    DELETE: '🗑️',
  }
  return icons[action] || '📌'
}

const getActionColor = (action: string): string => {
  const colors: Record<string, string> = {
    CREATE_VERSION: 'bg-green-100',
    UPDATE_NETWORK: 'bg-blue-100',
    UPDATE_FIXTURES: 'bg-purple-100',
    CALCULATE: 'bg-yellow-100',
    APPLY_PIPE_SIZE: 'bg-orange-100',
    UPLOAD_REFERENCE: 'bg-indigo-100',
    DUPLICATE: 'bg-cyan-100',
    RESTORE: 'bg-pink-100',
    DELETE: 'bg-red-100',
  }
  return colors[action] || 'bg-slate-100'
}

const getActionTitle = (action: string): string => {
  const titles: Record<string, string> = {
    CREATE_VERSION: 'Version Created',
    UPDATE_NETWORK: 'Network Updated',
    UPDATE_FIXTURES: 'Fixtures Modified',
    CALCULATE: 'System Calculated',
    APPLY_PIPE_SIZE: 'Pipe Size Changed',
    UPLOAD_REFERENCE: 'Reference Uploaded',
    DUPLICATE: 'Version Duplicated',
    RESTORE: 'Version Restored',
    DELETE: 'Item Deleted',
  }
  return titles[action] || action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getActionDescription = (log: AuditLog): string => {
  if (log.details) {
    try {
      const details = JSON.parse(log.details)
      if (typeof details === 'object') {
        return Object.entries(details)
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join(', ')
      }
      return details
    } catch {
      return log.details
    }
  }
  return `${log.entity} ${log.action.toLowerCase()}`
}

const canViewDetails = (log: AuditLog): boolean => {
  return !!log.details
}

const canRevert = (log: AuditLog): boolean => {
  return ['UPDATE_NETWORK', 'UPDATE_FIXTURES', 'APPLY_PIPE_SIZE'].includes(log.action)
}

const viewDetails = (log: AuditLog) => {
  if (expandedLogId.value === log.id) {
    expandedLogId.value = null
  } else {
    expandedLogId.value = log.id
  }
}

const revertChange = async (log: AuditLog) => {
  // TODO: Implement revert functionality
  console.log('Revert change:', log)
  alert(`Revert functionality for ${log.action} will be implemented soon`)
}

const formatDetails = (log: AuditLog): string => {
  if (!log.details) return 'No details available'

  try {
    const details = JSON.parse(log.details)
    return JSON.stringify(details, null, 2)
  } catch {
    return log.details
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'TODAY'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'YESTERDAY'
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

// Lifecycle
onMounted(() => {
  loadAuditLogs()
})
</script>

<style scoped>
.audit-log-container {
  @apply max-w-7xl mx-auto px-4 py-6;
}

/* Custom scrollbar for timeline */
.audit-log-container ::-webkit-scrollbar {
  width: 8px;
}

.audit-log-container ::-webkit-scrollbar-track {
  @apply bg-slate-100;
}

.audit-log-container ::-webkit-scrollbar-thumb {
  @apply bg-slate-300 rounded-full;
}

.audit-log-container ::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400;
}
</style>
