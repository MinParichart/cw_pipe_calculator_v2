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

          <!-- Project Info Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Project Details Card -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">
                  รายละเอียดโปรเจกต์
                </h3>
                <button
                  v-if="!editingProjectDetails"
                  @click="editProjectDetails"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  แก้ไข
                </button>
              </div>

              <!-- View Mode -->
              <div v-if="!editingProjectDetails">
                <div class="space-y-3 text-sm">
                  <div>
                    <dt class="text-gray-600">ชื่อโปรเจกต์:</dt>
                    <dd class="font-medium text-gray-900 mt-1">
                      {{ project.name }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-gray-600">รายละเอียด:</dt>
                    <dd class="text-gray-700 mt-1">
                      {{ project.description || "-" }}
                    </dd>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <dt class="text-gray-600">ประเภทอาคาร:</dt>
                      <dd class="font-medium text-gray-900 mt-1">
                        {{ getBuildingTypeText(criteria?.buildingType) }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-gray-600">จำนวนชั้น:</dt>
                      <dd class="font-medium text-gray-900 mt-1">
                        {{ criteria?.floors || "-" }} ชั้น
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit Mode -->
              <ProjectDetailsForm
                v-else
                :project="project"
                :criteria="criteria"
                @submit="saveProjectDetails"
                @cancel="editingProjectDetails = false"
              />
            </div>

            <!-- Versions Card -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">Versions</h3>
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <dl class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <dt class="text-gray-600">จำนวน Versions:</dt>
                  <dd class="font-medium text-gray-900">
                    {{ versions.length }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-600">วันที่สร้าง:</dt>
                  <dd class="font-medium text-gray-900">
                    {{ formatDate(project.createdAt) }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-600">อัปเดตล่าสุด:</dt>
                  <dd class="font-medium text-gray-900">
                    {{ formatDate(project.updatedAt) }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Design Criteria Section - Separate Card -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">เกณฑ์การออกแบบ</h3>
              <button
                v-if="!editingCriteria"
                @click="editingCriteria = true"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                แก้ไข
              </button>
            </div>

            <!-- View Mode -->
            <div
              v-if="!editingCriteria && criteria"
              class="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <!-- Velocity Card -->
              <div class="border rounded-lg p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">
                  ความเร็วน้ำในท่อ
                </h4>
                <dl class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <dt class="text-gray-600">ต่ำสุด:</dt>
                    <dd class="font-medium text-gray-900">
                      {{ criteria?.velocityMinimum || "-" }} m/s
                    </dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-600">เหมาะสม:</dt>
                    <dd class="font-medium text-gray-900">
                      {{ criteria?.velocityRecommended || "-" }} m/s
                    </dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-600">สูงสุด:</dt>
                    <dd class="font-medium text-gray-900">
                      {{ criteria?.velocityMaximum || "-" }} m/s
                    </dd>
                  </div>
                </dl>
              </div>

              <!-- Calculation Mode Card -->
              <div class="border rounded-lg p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">
                  โหมดการคำนวณ
                </h4>
                <dl class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <dt class="text-gray-600">Curve:</dt>
                    <dd class="font-medium text-gray-900">Hunter's Curve</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-600">C-Factor:</dt>
                    <dd class="font-medium text-gray-900">
                      {{ criteria?.cFactor || "-" }} ({{
                        getCFactorText(criteria?.cFactor)
                      }})
                    </dd>
                  </div>
                  <!-- PVC Class (แสดงเฉพาะเมื่อเป็น PVC) -->
                  <div v-if="criteria?.cFactor === 150" class="flex justify-between">
                    <dt class="text-gray-600">PVC Class:</dt>
                    <dd class="font-medium text-blue-900">
                      {{ criteria?.pvcClass || 7 }} bar
                    </dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-600">Demand:</dt>
                    <dd class="font-medium text-gray-900">
                      {{ getDemandModeText(criteria?.demandMode) }}
                    </dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-600">Minor Loss:</dt>
                    <dd class="font-medium text-gray-900">
                      {{ criteria?.minorLossFactor || "-" }}%
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!criteria" class="text-center py-8">
              <p class="text-gray-500 text-sm">ยังไม่ได้ตั้งค่าเกณฑ์การคำนวณ</p>
              <button
                @click="editingCriteria = true"
                class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                เริ่มตั้งค่า
              </button>
            </div>

            <!-- Edit Mode -->
            <CriteriaForm
              v-else
              :criteria="criteria"
              :project-id="parseInt(route.params.id as string)"
              @submit="saveCriteria"
              @cancel="editingCriteria = false"
            />
          </div>

          <!-- Versions List Section -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <VersionList
              :versions="versions"
              :loading="loading"
              @create="showCreateModal = true"
              @continue="handleContinueVersion"
              @duplicate="handleDuplicateVersion"
              @delete="handleDeleteVersion"
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
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
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
                class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
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
              class="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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
const versions = ref<any[]>([]);
const editingCriteria = ref(false);
const editingProjectDetails = ref(false);
const showCreateModal = ref(false);

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
    const result = await versionStore.loadVersions(projectId);
    if (result.success) {
      versions.value = versionStore.versions;
    }
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
