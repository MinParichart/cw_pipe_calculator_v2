<template>
  <div
    class="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out shadow-xl"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between h-16 px-6 border-b">
      <div class="flex items-center">
        <svg
          class="h-8 w-8 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v18M8 7h8M8 12h8M8 17h8"
          />
        </svg>
        <span class="ml-2 text-lg font-bold text-gray-900"> CW Pipe Calc </span>
      </div>
      <!-- Close button (mobile only) -->
      <button
        @click="$emit('close')"
        class="md:hidden p-1 rounded-md hover:bg-gray-100"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Sidebar Content -->
    <div class="overflow-y-auto h-[calc(100vh-4rem)] px-3 py-4">
      <!-- Projects Section -->
      <div class="mb-6">
        <!-- Projects Header (Clickable) -->
        <div class="flex items-center justify-between mb-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="flex items-center gap-2 flex-1">
            <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <NuxtLink
              to="/projects"
              class="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              @click="$emit('navigate')"
            >
              โปรเจกต์ [{{ totalProjectCount }}]
            </NuxtLink>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink
              to="/projects/new"
              class="px-2 py-0.5 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              @click.stop="$emit('navigate')"
            >
              +new
            </NuxtLink>
            <button
              @click="toggleProjectsMenu"
              class="p-1 rounded hover:bg-gray-200 transition-colors"
            >
              <svg
                class="h-4 w-4 text-gray-400 transform transition-transform duration-200"
                :class="{ 'rotate-90': showProjectsMenu }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingProjects && showProjectsMenu" class="px-3 py-4 text-center text-sm text-gray-500">
          กำลังโหลด...
        </div>

        <!-- Projects List (Collapsible) -->
        <div v-else-if="showProjectsMenu" class="space-y-1">
          <!-- Empty State -->
          <div v-if="projects.length === 0" class="px-3 py-4 text-center text-sm text-gray-500">
            ยังไม่มีโปรเจกต์
          </div>

          <!-- Project Items -->
          <div
            v-for="project in projects"
            :key="project.id"
            class="border border-gray-200 rounded-lg overflow-hidden mb-2 ml-2"
          >
            <!-- Project Header (Clickable) -->
            <button
              @click="toggleProject(project.id)"
              class="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div class="flex items-center gap-2">
                <span class="text-lg">{{ getProjectIcon(project.buildingType) }}</span>
                <div>
                  <p class="text-sm font-semibold text-gray-900 truncate max-w-[140px]">{{ project.name }}</p>
                  <p class="text-xs text-gray-500">
                    {{ projectVersions[project.id]?.length || 0 }} versions
                  </p>
                </div>
              </div>
              <svg
                class="h-4 w-4 text-gray-400 transform transition-transform duration-200"
                :class="{ 'rotate-90': expandedProjects.has(project.id) }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Versions List (Collapsible) -->
            <div
              v-if="expandedProjects.has(project.id)"
              class="border-t border-gray-200 bg-white"
            >
              <!-- Loading State for Versions -->
              <div v-if="loadingVersions[project.id]" class="px-3 py-4 text-center text-sm text-gray-500">
                กำลังโหลด versions...
              </div>

              <!-- Versions Loaded -->
              <div v-else-if="projectVersions[project.id]?.length > 0" class="divide-y divide-gray-100">
                <!-- Version Items -->
                <button
                  v-for="version in projectVersions[project.id]"
                  :key="version.id"
                  @click="navigateToVersion(project.id, version.id)"
                  class="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 transition-colors text-left group"
                >
                  <div :class="`w-6 h-6 rounded-full ${getVersionBadgeClasses(version.versionNumber).bg} flex items-center justify-center flex-shrink-0`">
                    <span :class="`text-xs font-semibold ${getVersionBadgeClasses(version.versionNumber).text}`">
                      v{{ version.versionNumber }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ version.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(version.createdAt) }}</p>
                  </div>
                  <span
                    v-if="version.isCurrent"
                    class="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700"
                  >
                    current
                  </span>
                </button>

                <!-- Version Compare Link -->
                <NuxtLink
                  v-if="projectVersions[project.id]?.length > 1"
                  :to="`/projects/${project.id}/compare`"
                  @click="$emit('navigate')"
                  class="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 transition-colors text-left group border-t border-gray-200"
                >
                  <div class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-purple-600">เปรียบเทียบ Version</p>
                  </div>
                </NuxtLink>
              </div>

              <!-- No Versions State -->
              <div v-else class="px-3 py-4 text-center text-sm text-gray-500">
                ยังไม่มี version
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tools Section -->
      <div class="mb-6">
        <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          เครื่องมือ
        </p>
        <nav class="space-y-1">
          <NuxtLink
            to="/reference"
            class="sidebar-link"
            :class="{ 'sidebar-link-active': isActive('/reference') }"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>ตารางอ้างอิง</span>
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- User Info (Display Only) -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
      <div class="flex items-center">
        <div
          class="h-10 w-10 rounded-full bg-blue-600 bg-opacity-10 flex items-center justify-center"
        >
          <span class="text-sm font-medium text-blue-600">
            {{ userInitials }}
          </span>
        </div>
        <div class="ml-3 min-w-0 flex-1">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ user?.name || "ผู้ใช้" }}
          </p>
          <p class="text-xs text-gray-500 truncate">
            {{ user?.email || "" }}
          </p>
        </div>
        <NuxtLink
          to="/profile"
          class="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 hover:text-blue-600 transition-colors"
          title="ตั้งค่าโปรไฟล์"
          @click="$emit('navigate')"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Overlay (mobile) -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
        @click="$emit('close')"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { projectsApi, versionsApi } from '~/composables/useApi'

const { user } = useAuth();
const route = useRoute();

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  close: [];
  navigate: [];
}>();

const userInitials = computed(() => {
  if (!user.value?.name) return "U";
  return user.value.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const isActive = (path: string) => {
  return route.path.startsWith(path);
};

// Projects & Versions State
const projects = ref<any[]>([])
const loadingProjects = ref(false)
const showProjectsMenu = ref(false)
const expandedProjects = ref<Set<string>>(new Set())
const projectVersions = ref<Record<string, any[]>>({})
const loadingVersions = ref<Record<string, boolean>>({})

// Computed
const totalProjectCount = computed(() => projects.length)

// Toggle projects menu
const toggleProjectsMenu = () => {
  showProjectsMenu.value = !showProjectsMenu.value
  // ถ้าเปิดเมนูครั้งแรกและยังไม่โหลด projects ให้โหลด
  if (showProjectsMenu.value && projects.value.length === 0) {
    fetchProjects()
  }
}

const fetchProjects = async () => {
  loadingProjects.value = true
  try {
    const data = await projectsApi.list()
    projects.value = data

    // Fetch versions count สำหรับทุก project เพื่อแสดงจำนวน
    for (const project of data) {
      await fetchVersionsForProject(String(project.id))
    }
  } catch (error: any) {
    console.error('Failed to load projects:', error)
  } finally {
    loadingProjects.value = false
  }
}

const fetchVersionsForProject = async (projectId: string) => {
  loadingVersions.value[projectId] = true
  try {
    const versions = await versionsApi.list(parseInt(projectId))
    projectVersions.value[projectId] = versions
  } catch (error: any) {
    console.error(`Failed to load versions for project ${projectId}:`, error)
    projectVersions.value[projectId] = []
  } finally {
    loadingVersions.value[projectId] = false
  }
}

const toggleProject = (projectId: string) => {
  const newSet = new Set(expandedProjects.value)
  if (newSet.has(projectId)) {
    newSet.delete(projectId)
  } else {
    newSet.add(projectId)
    // Load versions if not already loaded
    if (!projectVersions.value[projectId]) {
      fetchVersionsForProject(projectId)
    }
  }
  expandedProjects.value = newSet
}

const getVersionBadgeColor = (versionNumber: number) => {
  const colors = {
    1: 'blue',
    2: 'purple',
    3: 'orange',
  }
  return colors[versionNumber as keyof typeof colors] || 'green'
}

const getProjectIcon = (buildingType?: string) => {
  if (!buildingType) return '🏠'

  const typeIcons: Record<string, string> = {
    'TOWNHOME': '🏠',
    'CONDO': '🏢',
    'HOUSING_ESTATE': '🏡',
    'RESTAURANT': '🏪',
    'HOSPITAL': '🏥',
    'OFFICE': '🏢',
    'SCHOOL': '🏫',
    'HOTEL': '🏨',
  }

  return typeIcons[buildingType] || '🏠'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear() + 543 // Thai year

  const thaiMonths = [
    '', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ]

  return `วันที่ ${day} ${thaiMonths[month]} ${year}`
}

const navigateToVersion = (projectId: string, versionId: string) => {
  navigateTo(`/projects/${projectId}/versions/${versionId}`)
}

// Tailwind color classes for version badges
const getVersionBadgeClasses = (versionNumber: number) => {
  const color = getVersionBadgeColor(versionNumber)
  const colorMap: Record<string, { bg: string, text: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
  }
  return colorMap[color] || colorMap.green
}
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-colors;
}

.sidebar-link-active {
  @apply bg-blue-50 bg-opacity-10 text-blue-600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
