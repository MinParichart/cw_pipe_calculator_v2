<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Project Header (เหนือ Step Indicator) -->
    <div class="px-6 py-2 border-b border-slate-100 bg-slate-50">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between">
        <!-- ชื่อ Project (Click ได้) -->
        <NuxtLink
          :to="`/projects/${route.params.id}`"
          class="flex items-center gap-2 group"
        >
          <svg
            class="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors"
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
          <span
            class="text-base font-semibold text-blue-600 group-hover:text-blue-700 transition-colors"
          >
            โปรเจกต์: {{ projectData?.name || "กลับสู่หน้าโปรเจกต์" }}
          </span>
          <span
            class="text-xs text-slate-500 group-hover:text-slate-600 transition-colors"
          >
            (กดเพื่อกลับ)
          </span>
        </NuxtLink>

        <!-- เวอร์ชันปัจจุบัน -->
        <div v-if="version?.name" class="text-sm text-slate-600">
          <!-- <span class="font-medium">{{ version.name }}</span> -->
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Audit Log</h1>
                <p class="mt-1 text-sm text-gray-600">
                  ประวัติการเปลี่ยนแปลงของ Version
                </p>
              </div>
            </div>

            <!-- Version Badge -->
            <div class="flex items-center gap-3">
              <div
                class="bg-blue-100 border border-blue-200 rounded-lg px-4 py-2"
              >
                <div class="flex items-center gap-2">
                  <svg
                    class="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <div>
                    <p class="text-xs text-blue-600 font-medium">Version</p>
                    <p class="text-lg font-bold text-blue-900">
                      {{
                        version?.name ||
                        `Version ${version?.versionNumber || "-"}`
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Audit Log Component -->
        <VersionAuditLog />

        <!-- Navigation Buttons -->
        <div class="mt-6 flex gap-3">
          <BackButton @click="goToProject" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BackButton from "~/components/navigation/BackButton.vue";
import VersionAuditLog from "~/components/version/VersionAuditLog.vue";
import { projectsApi, versionsApi } from "~/composables/useApi";
import { useWorkflowStore } from "~/stores/workflowStore";

const route = useRoute();
const router = useRouter();
const workflowStore = useWorkflowStore();

// Computed
const projectId = computed(() => {
  const id = route.params.id;
  if (typeof id === "number") return id;
  if (typeof id === "string") {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
});
const versionId = computed(() => {
  const id = route.params.versionId;
  if (typeof id === "number") return id;
  if (typeof id === "string") {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
});

// State
const version = ref<any>(null);
const projectData = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Methods
const loadVersion = async () => {
  try {
    loading.value = true;
    error.value = null;

    version.value = await versionsApi.get(parseInt(versionId.value));
  } catch (err: any) {
    error.value = err.message || "Failed to load version";
    console.error("Error loading version:", err);
  } finally {
    loading.value = false;
  }
};

const loadProject = async () => {
  try {
    if (projectId.value) {
      projectData.value = await projectsApi.get(projectId.value);
    }
  } catch (err: any) {
    console.error("Error loading project:", err);
  }
};

const goToProject = () => {
  router.push(`/projects/${route.params.id}`);
};

onMounted(() => {
  loadVersion();
  loadProject();
  workflowStore.setCurrentStep("versionAudit");
});
</script>

<script lang="ts">
definePageMeta({
  layout: "dashboard"
});
</script>
