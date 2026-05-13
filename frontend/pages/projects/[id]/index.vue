<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-center">
            <svg
              class="animate-spin h-8 w-8 text-blue-600 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p class="mt-2 text-gray-600">กำลังโหลดโปรเจกต์...</p>
          </div>
        </div>

        <!-- Project Content -->
        <div v-else-if="project">
          <!-- Header -->
          <div class="mb-6">
            <button
              @click="$router.back()"
              class="flex items-center text-sm text-gray-600 hover:text-gray-900"
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
              ย้อนกลับ
            </button>
            <div class="mt-4">
              <h1 class="text-3xl font-bold text-gray-900">
                {{ project.name }}
              </h1>
              <p class="mt-1 text-sm text-gray-600">
                {{ project.description }}
              </p>
            </div>
          </div>

          <!-- Project & Criteria Section - Combined Card with 2-Column Layout -->
          <div class="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
            <!-- Card Header -->
            <div class="bg-gradient-to-r from-blue-50 to-green-50 px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ข้อมูลโปรเจกต์และเกณฑ์การออกแบบ
                  </h3>
                  <p class="text-xs text-gray-600 mt-1">Project Information & Design Criteria</p>
                </div>
              </div>
            </div>

            <!-- 2-Column Grid Layout -->
            <div class="p-6">
              <!-- View Mode (Both sections visible in 2 columns) -->
              <div v-if="!editingProjectDetails && !editingCriteria" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column: Project Details -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      รายละเอียดโปรเจกต์
                    </h4>
                    <button
                      @click="editProjectDetails"
                      class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      แก้ไข
                    </button>
                  </div>

                  <!-- Project Info Card -->
                  <div class="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                    <div>
                      <label class="text-xs text-gray-500 block mb-1">ชื่อโปรเจกต์</label>
                      <p class="text-sm font-medium text-gray-900">{{ project.name }}</p>
                    </div>

                    <div>
                      <label class="text-xs text-gray-500 block mb-1">รายละเอียด</label>
                      <p class="text-sm text-gray-700">{{ project.description || "-" }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="text-xs text-gray-500 block mb-1">ประเภทอาคาร</label>
                        <p class="text-sm font-medium text-gray-900">{{ getBuildingTypeText(criteria?.buildingType) }}</p>
                      </div>
                      <div>
                        <label class="text-xs text-gray-500 block mb-1">จำนวนชั้น</label>
                        <p class="text-sm font-medium text-gray-900">{{ criteria?.floors || "-" }} ชั้น</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Column: Design Criteria -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <span class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      เกณฑ์การออกแบบ
                    </h4>
                    <button
                      @click="editingCriteria = true"
                      class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      แก้ไข
                    </button>
                  </div>

                  <!-- Empty State -->
                  <div v-if="!criteria" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <svg class="h-10 w-10 text-yellow-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="text-sm text-yellow-800 font-medium mb-1">ยังไม่ได้ตั้งค่าเกณฑ์การคำนวณ</p>
                    <button
                      @click="editingCriteria = true"
                      class="mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 font-medium"
                    >
                      เริ่มตั้งค่า
                    </button>
                  </div>

                  <!-- Criteria Display (if exists) -->
                  <div v-else class="space-y-3">
                    <!-- Velocity Card -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div class="flex items-center gap-2 mb-2">
                        <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <h5 class="text-xs font-bold text-blue-900 uppercase">Velocity</h5>
                      </div>
                      <div class="grid grid-cols-3 gap-2 text-xs">
                        <div class="text-center">
                          <div class="text-gray-600">ต่ำสุด</div>
                          <div class="font-bold text-blue-900">{{ criteria?.velocityMinimum || "-" }} <span class="text-xs text-gray-500">m/s</span></div>
                        </div>
                        <div class="text-center border-l border-r border-blue-200">
                          <div class="text-gray-600">เหมาะสม</div>
                          <div class="font-bold text-green-700">{{ criteria?.velocityRecommended || "-" }} <span class="text-xs text-gray-500">m/s</span></div>
                        </div>
                        <div class="text-center">
                          <div class="text-gray-600">สูงสุด</div>
                          <div class="font-bold text-blue-900">{{ criteria?.velocityMaximum || "-" }} <span class="text-xs text-gray-500">m/s</span></div>
                        </div>
                      </div>
                    </div>

                    <!-- Calculation Card -->
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div class="flex items-center gap-2 mb-2">
                        <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <h5 class="text-xs font-bold text-green-900 uppercase">Calculation</h5>
                      </div>
                      <div class="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span class="text-gray-600">Curve:</span>
                          <span class="font-medium text-gray-900 ml-1">Hunter's</span>
                        </div>
                        <div>
                          <span class="text-gray-600">C-Factor:</span>
                          <span class="font-medium text-gray-900 ml-1">{{ criteria?.cFactor || "-" }}</span>
                        </div>
                        <div v-if="criteria?.cFactor === 150">
                          <span class="text-gray-600">PVC Class:</span>
                          <span class="font-bold text-blue-900 ml-1">{{ criteria?.pvcClass || 7 }} <span class="text-gray-500">bar</span></span>
                        </div>
                        <div>
                          <span class="text-gray-600">Minor Loss:</span>
                          <span class="font-medium text-gray-900 ml-1">{{ criteria?.minorLossFactor || "-" }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit Mode - Project Details -->
              <div v-else-if="editingProjectDetails">
                <div class="mb-4">
                  <button
                    @click="editingProjectDetails = false"
                    class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    กลับ
                  </button>
                </div>
                <ProjectDetailsForm
                  :project="project"
                  :criteria="criteria"
                  @submit="saveProjectDetails"
                  @cancel="editingProjectDetails = false"
                />
              </div>

              <!-- Edit Mode - Criteria -->
              <div v-else-if="editingCriteria">
                <div class="mb-4">
                  <button
                    @click="editingCriteria = false"
                    class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    กลับ
                  </button>
                </div>
                <CriteriaForm
                  :criteria="criteria"
                  :project-id="parseInt(route.params.id as string)"
                  @submit="saveCriteria"
                  @cancel="editingCriteria = false"
                />
              </div>
            </div>
          </div>

          <!-- Versions List Section -->
          <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <VersionList
              :versions="versions"
              :loading="loading"
              @create="showCreateModal = true"
              @continue="handleContinueVersion"
              @duplicate="handleDuplicateVersion"
              @delete="handleDeleteVersion"
              @update="handleUpdateVersion"
            />

            <!-- Create Version Modal -->
            <CreateVersionModal
              :show="showCreateModal"
              :project-id="parseInt(route.params.id)"
              @close="showCreateModal = false"
              @created="handleVersionCreated"
            />
          </div>

          <!-- Actions Card -->
          <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">การจัดการ</h3>
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div class="flex flex-wrap gap-3">
              <BackButton @click="$router.back()" />
              <button
                @click="goToCompare"
                class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="versions.length < 2"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                เปรียบเทียบ Version
              </button>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="flex items-center justify-center h-64">
          <div class="text-center">
            <svg
              class="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p class="text-lg font-medium text-gray-900">ไม่พบโปรเจกต์</p>
            <p class="text-sm text-gray-600 mt-1">
              โปรเจกต์อาจถูกลบหรือคุณไม่มีสิทธิ์เข้าถึง
            </p>
            <button
              @click="$router.push('/projects')"
              class="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              กลับไปหน้าโปรเจกต์
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CriteriaForm from "~/components/criteria/CriteriaForm.vue";
import ProjectDetailsForm from "~/components/project/ProjectDetailsForm.vue";
import BackButton from "~/components/navigation/BackButton.vue";
import VersionList from "~/components/version/VersionList.vue";
import CreateVersionModal from "~/components/version/CreateVersionModal.vue";
import { projectsApi } from "~/composables/useApi";
import { useWorkflowStore } from "~/stores/workflowStore";
import { useVersionStore } from "~/stores/versionStore";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const workflowStore = useWorkflowStore();
const versionStore = useVersionStore();

// State
const loading = ref(true);
const project = ref<any>(null);
const criteria = ref<any>(null);
// Use computed to react to store changes
const versions = computed(() => versionStore.versions);
const editingCriteria = ref(false);
const editingProjectDetails = ref(false);
const showCreateModal = ref(false);

// Computed - Latest version (sorted by updatedAt)
const latestVersion = computed(() => {
  if (versions.value.length === 0) return null;

  // Sort by updatedAt descending (most recent first)
  const sorted = [...versions.value].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

  return sorted[0];
});

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const getBuildingTypeText = (type?: string) => {
  const types: Record<string, string> = {
    APARTMENT: "อาคารพักอาศัย/คอนโด",
    HOUSE: "บ้านเดี่ยว/ทาวน์โฮม",
    OFFICE: "อาคารสำนักงาน",
    HOSPITAL: "โรงพยาบาล",
    SCHOOL: "โรงเรียน",
    HOTEL: "โรงแรม",
    FACTORY: "โรงงาน",
    OTHER: "อื่นๆ"
  };
  return types[type || ""] || "-";
};

const getDemandModeText = (mode?: string) => {
  const modes: Record<string, string> = {
    FLUSH_TANK: "Flush Tank Only",
    FLUSH_VALVE: "Flush Valve Only",
    MIXED: "Flush Tank + Flush Valve"
  };
  return modes[mode || ""] || "-";
};

const getCFactorText = (cFactor?: number) => {
  const factors: Record<number, string> = {
    150: "PVC",
    130: "Copper",
    100: "Steel"
  };
  return factors[cFactor || 150] || "-";
};

// Methods
const loadProject = async () => {
  loading.value = true;
  try {
    const projectId = parseInt(route.params.id as string);
    project.value = await projectsApi.get(projectId);

    // Get design criteria
    try {
      criteria.value = await projectsApi.getCriteria(projectId);
    } catch (error) {
      // No criteria set yet, use defaults
    }

    // Load versions
    await loadVersions();
  } catch (error: any) {
    toast.error(error.message || "Failed to load project");
    router.push("/projects");
  } finally {
    loading.value = false;
  }
};

const loadVersions = async () => {
  try {
    const projectId = parseInt(route.params.id as string);
    await versionStore.loadVersions(projectId);
    // versions is now computed, so it will automatically update from the store
  } catch (error: any) {
    console.error("Failed to load versions:", error);
  }
};

// Version handlers
const handleVersionCreated = (versionId: number) => {
  // Navigate to Step 2: Documents
  router.push(`/projects/${route.params.id}/versions/${versionId}/upload`);
};

const handleContinueVersion = (version: any) => {
  versionStore.setCurrentVersion(version);

  // Determine next step based on workflow
  if (!version.referenceLayer) {
    // Go to Step 2: Documents (upload reference)
    router.push(`/projects/${route.params.id}/versions/${version.id}/upload`);
  } else if (!version.snapshotNetwork) {
    // Go to Step 3: Network
    router.push(`/projects/${route.params.id}/versions/${version.id}/network`);
  } else if (!version.snapshotFixtures) {
    // Go to Step 4: Fixtures
    router.push(`/projects/${route.params.id}/versions/${version.id}/fixtures`);
  } else if (!version.snapshotResults) {
    // Go to Step 5: Calculate
    router.push(`/projects/${route.params.id}/versions/${version.id}/calculation`);
  } else {
    // All complete, view results
    router.push(`/projects/${route.params.id}/versions/${version.id}/calculation`);
  }
};

const handleDuplicateVersion = async (version: any) => {
  try {
    const result = await versionStore.duplicateVersion(version.id);
    if (result.success) {
      toast.success('คัดลอกเวอร์ชันสำเร็จ');
      await loadVersions();
    } else {
      toast.error(result.error?.message || 'ล้มเหลือ');
    }
  } catch (error: any) {
    toast.error(error.message || 'ล้มเหลือ');
  }
};

const handleDeleteVersion = async (version: any) => {
  if (!confirm(`ยืนยันที่จะลบเวอร์ชัน "${version.name}"?`)) {
    return;
  }

  try {
    const result = await versionStore.deleteVersion(version.id);
    if (result.success) {
      toast.success('ลบเวอร์ชันสำเร็จ');
      await loadVersions();
    } else {
      toast.error(result.error?.message || 'ล้มเหลือ');
    }
  } catch (error: any) {
    toast.error(error.message || 'ล้มเหลือ');
  }
};

const handleUpdateVersion = async (versionId: number, data: { name?: string; description?: string }) => {
  console.log('🔧 handleUpdateVersion called:', { versionId, data });

  try {
    const result = await versionStore.updateVersion(versionId, data);

    console.log('🔧 versionStore.updateVersion result:', result);

    if (result.success) {
      toast.success('บันทึกการเปลี่ยนแปลงสำเร็จ');
      await loadVersions();
    } else {
      console.error('❌ Update failed:', result.error);
      toast.error(result.error?.message || 'ล้มเหลือ');
    }
  } catch (error: any) {
    console.error('❌ Update error:', error);
    toast.error(error.message || 'ล้มเหลือ');
  }
};

const editCriteria = () => {
  editingCriteria.value = true;
};

const saveCriteria = async (newCriteria: any) => {
  try {
    const projectId = parseInt(route.params.id as string);
    await projectsApi.updateCriteria(projectId, newCriteria);

    // Reload criteria from backend
    criteria.value = await projectsApi.getCriteria(projectId);

    editingCriteria.value = false;
    toast.success("บันทึกเกณฑ์การคำนวณเรียบร้อย");
  } catch (error: any) {
    toast.error(error.message || "Failed to save criteria");
  }
};

const editProjectDetails = () => {
  editingProjectDetails.value = true;
};

const saveProjectDetails = async (updatedProject: any) => {
  try {
    const projectId = parseInt(route.params.id as string);

    // Update project details (name, description)
    await projectsApi.update(projectId, {
      name: updatedProject.name,
      description: updatedProject.description
    });

    // Update buildingType and floors via criteria API
    await projectsApi.updateCriteria(projectId, {
      buildingType: updatedProject.buildingType,
      floors: updatedProject.floors
    });

    // Reload project and criteria from backend
    project.value = await projectsApi.get(projectId);
    criteria.value = await projectsApi.getCriteria(projectId);

    editingProjectDetails.value = false;
    toast.success("บันทึกรายละเอียดโปรเจกต์เรียบร้อย");
  } catch (error: any) {
    toast.error(error.message || "Failed to save project details");
  }
};

const goToCompare = () => {
  router.push(`/projects/${route.params.id}/compare`);
};

// Load project on mount
onMounted(() => {
  loadProject();
  workflowStore.setCurrentStep("parameters");
});

// Define page meta for layout
definePageMeta({
  layout: "dashboard"
});
</script>
