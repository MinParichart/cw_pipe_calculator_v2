<template>
  <div class="version-list space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
          <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Versions</h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ totalVersions }} version{{ totalVersions !== 1 ? "s" : "" }}
          </p>
        </div>
      </div>

      <button
        @click="$emit('create')"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Version
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
      <p class="mt-2 text-sm text-gray-600">Loading versions...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="versions.length === 0"
      class="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-md border-2 border-dashed border-gray-300"
    >
      <div class="text-gray-300 text-7xl mb-4">📦</div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">ยังไม่มี Versions</h3>
      <p class="text-sm text-gray-600 mb-6">
        สร้าง Version แรกเพื่อเริ่มติดตามโปรเจกต์ของคุณ
      </p>
      <button
        @click="$emit('create')"
        class="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md inline-flex items-center gap-2"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        สร้าง Version แรก
      </button>
    </div>

    <!-- Version Cards - Grid Layout -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <VersionCard
        v-for="version in sortedVersions"
        :key="version.id"
        :version="version"
        @continue="(version) => $emit('continue', version)"
        @duplicate="(version) => $emit('duplicate', version)"
        @delete="(version) => $emit('delete', version)"
        @update="(id, data) => $emit('update', id, data)"
      />
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-sm text-red-800">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VersionCard from "./VersionCard.vue";

interface Version {
  id: number;
  name: string;
  description?: string;
  versionNumber: number;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
  snapshotNetwork?: string;
  snapshotFixtures?: string;
  snapshotResults?: string;
  referenceLayer?: string;
}

interface Props {
  versions: Version[];
  loading?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
});

defineEmits<{
  create: [];
  continue: [version: Version];
  duplicate: [version: Version];
  delete: [version: Version];
  update: [versionId: number, data: { name?: string; description?: string }];
}>();

const totalVersions = computed(() => props.versions.length);

const sortedVersions = computed(() => {
  return [...props.versions].sort((a, b) => {
    // Sort by version number descending
    if (b.versionNumber !== a.versionNumber) {
      return b.versionNumber - a.versionNumber;
    }
    // Then by date descending
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});
</script>
