<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">สรุปข้อมูลโปรแกรมทางชลศาสตร์ที่เลือก</p>
    </div>

    <!-- Quick Access Tiles -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer">
        <h3 class="font-semibold text-gray-800 text-center">รายงานผล</h3>
      </div>
      <div class="bg-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer">
        <h3 class="font-semibold text-gray-800 text-center">ตัวแปร</h3>
      </div>
      <div class="bg-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer">
        <h3 class="font-semibold text-gray-800 text-center">โปรแกรมที่เลือกทำงาน</h3>
      </div>
      <div class="bg-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer">
        <h3 class="font-semibold text-gray-800 text-center">โปรแกรมที่สร้างใหม่</h3>
      </div>
    </div>

    <!-- Program Management Section -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">โปรแกรมที่เลือกทำงาน</h2>
      <p class="text-gray-600 mb-6">แสดงรายการโปรแกรมทางชลศาสตร์ที่เลือกเพื่อดำเนินการ</p>

      <!-- Search Bar -->
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-64">
          <input
            v-model="searchName"
            type="text"
            placeholder="ชื่อโปรแกรม"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div class="w-48">
          <select
            v-model="searchType"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">ทั้งหมด</option>
            <option value="residential">ที่พักอาศัย</option>
            <option value="commercial">อาคารพาณิชย์</option>
            <option value="industrial">อุตสาหกรรม</option>
          </select>
        </div>
        <button
          @click="handleSearch"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          ค้นหา
        </button>
        <button
          @click="handleCreateProgram"
          class="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition flex items-center"
        >
          <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          สร้างโปรแกรม
        </button>
      </div>

      <!-- Program List -->
      <div v-if="loading" class="text-center py-12 text-gray-500">
        กำลังโหลด...
      </div>
      <div v-else-if="filteredPrograms.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="program in filteredPrograms"
          :key="program.id"
          class="bg-gray-100 rounded-lg p-4 hover:shadow-md transition"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-800">{{ program.name }}</h3>
            <button class="w-6 h-6 bg-gray-300 rounded hover:bg-gray-400 transition"></button>
          </div>
          <button
            @click="viewDetails(program.id)"
            class="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
          >
            ดูรายละเอียด
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 text-gray-500">
        {{ searchName || searchType ? 'ไม่พบโปรแกรมที่ค้นหา' : 'ยังไม่มีโปรแกรม' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { projectsApi } from '~/composables/useApi'

// State
const programs = ref<any[]>([])
const loading = ref(true)
const searchName = ref('')
const searchType = ref('')

// Fetch projects
const fetchProjects = async () => {
  try {
    loading.value = true
    const data = await projectsApi.list()
    programs.value = data
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  } finally {
    loading.value = false
  }
}

// Search filter
const filteredPrograms = computed(() => {
  return programs.value.filter(program => {
    const matchName = !searchName.value ||
      program.name.toLowerCase().includes(searchName.value.toLowerCase())
    const matchType = !searchType.value ||
      program.type?.toLowerCase() === searchType.value.toLowerCase()
    return matchName && matchType
  })
})

const handleSearch = () => {
  // Filter is handled by computed
}

const handleCreateProgram = () => {
  navigateTo('/projects/new')
}

const viewDetails = (id: number) => {
  navigateTo(`/projects/${id}`)
}

// Load projects on mount
onMounted(() => {
  fetchProjects()
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard',
})
</script>
