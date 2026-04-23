<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-3 text-left">เวลา</th>
          <th class="px-4 py-3 text-left">ชื่อ</th>
          <th class="px-4 py-3 text-left">อีเมลล</th>
          <th class="px-4 py-3 text-left">Action</th>
          <th class="px-4 py-3 text-left">รายละเอียด</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50">
          <td class="px-4 py-3 whitespace-nowrap">
            {{ formatTimestamp(log.timestamp) }}
          </td>
          <td class="px-4 py-3">
            {{ log.user?.name || log.user }}
          </td>
          <td class="px-4 py-3 text-gray-600">
            {{ log.user?.email || '-' }}
          </td>
          <td class="px-4 py-3">
            <span
              class="px-2 py-1 text-xs rounded"
              :class="getActionClass(log.action)"
            >
              {{ log.action }}
            </span>
          </td>
          <td class="px-4 py-3">
            {{ log.details }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <div v-if="logs.length === 0" class="text-center py-8 text-gray-500">
      <svg class="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p>ไม่มี Audit Log</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AuditLog {
  id: number
  timestamp: Date
  user: string
  action: string
  details: string
}

interface Props {
  logs: AuditLog[]
}

defineProps<Props>()

const formatTimestamp = (date: Date) => {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getActionClass = (action: string) => {
  switch (action) {
    case 'CREATE_VERSION':
      return 'bg-blue-100 text-blue-800'
    case 'UPDATE_NETWORK':
    case 'UPDATE_FIXTURE':
    case 'UPDATE_PIPE_SIZE':
      return 'bg-orange-100 text-orange-800'
    case 'RESTORE':
      return 'bg-purple-100 text-purple-800'
    case 'DELETE_VERSION':
      return 'bg-red-100 text-red-800'
    case 'APPROVE':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
