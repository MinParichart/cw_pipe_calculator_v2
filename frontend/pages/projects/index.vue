<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            โปรเจกต์ของฉัน
          </h1>
          <p class="mt-1 text-sm text-gray-600">
            จัดการและคำนวณขนาดท่อน้ำดีสำหรับโปรเจกต์ของคุณ
          </p>
        </div>
        <button
          @click="createNewProject"
          class="btn btn-primary flex items-center gap-2"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          สร้างโปรเจกต์ใหม่
        </button>
      </div>

      <!-- Projects Grid -->
      <div v-if="projects.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="project in sortedProjects"
          :key="project.id"
          :project="project"
          @click="openProject"
          @delete="deleteProject"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-900">
          ยังไม่มีโปรเจกต์
        </h3>
        <p class="mt-2 text-sm text-gray-500">
          เริ่มต้นสร้างโปรเจกต์ใหม่เพื่อคำนวณขนาดท่อน้ำดี
        </p>
        <div class="mt-6">
          <button @click="createNewProject" class="btn btn-primary">
            สร้างโปรเจกต์แรกของคุณ
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-medium text-gray-900">
        ยืนยันการลบโปรเจกต์
      </h3>
      <p class="mt-2 text-sm text-gray-600">
        การดำเนินการนี้ไม่สามารถย้อนกลับได้ คุณต้องการลบโปรเจกต์นี้หรือไม่?
      </p>
      <div class="mt-6 flex justify-end gap-3">
        <button @click="showDeleteModal = false" class="btn btn-secondary">
          ยกเลิก
        </button>
        <button @click="confirmDelete" class="btn btn-danger">
          ลบโปรเจกต์
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectCard from '~/components/projects/ProjectCard.vue'
import { projectsApi } from '~/composables/useApi'

const { user } = useAuth()
const router = useRouter()
const toast = useToast()

// State
const projects = ref<any[]>([])
const loading = ref(false)
const showDeleteModal = ref(false)
const projectToDelete = ref<number | null>(null)

// Computed
const sortedProjects = computed(() => {
  return [...projects.value].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
})

// Methods
const loadProjects = async () => {
  loading.value = true
  try {
    projects.value = await projectsApi.list()
  } catch (error: any) {
    toast.error(error.message || 'Failed to load projects')
  } finally {
    loading.value = false
  }
}

const createNewProject = () => {
  router.push('/projects/new')
}

const openProject = (id: number) => {
  router.push(`/projects/${id}`)
}

const deleteProject = (id: number) => {
  projectToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (projectToDelete.value) {
    try {
      await projectsApi.delete(projectToDelete.value)
      projects.value = projects.value.filter(p => p.id !== projectToDelete.value)
      showDeleteModal.value = false
      projectToDelete.value = null
      toast.success('Project deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project')
    }
  }
}

// Load projects on mount
onMounted(() => {
  loadProjects()
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard',
})
</script>
