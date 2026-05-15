<template>
  <div class="min-h-screen bg-gray-50">
    <VersionSteps :version-id="versionId" />

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                สรุปผลการคำนวณ (Report)
              </h1>
              <p class="mt-1 text-sm text-gray-600">
                ส่งออกรายงานเป็น PDF เพื่อบันทึกหรือพิมพ์
              </p>
            </div>

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

              <div class="flex gap-3">
                <button
                  @click="exportPDF"
                  :disabled="loading || !calculationResults"
                  class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l-3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Export PDF</span>
                </button>
                <button
                  @click="printReport"
                  :disabled="loading || !calculationResults"
                  class="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"
            ></div>
            <p class="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
          </div>
        </div>

        <div
          v-else-if="!calculationResults"
          class="bg-white rounded-lg shadow-sm p-12 text-center"
        >
          <svg
            class="w-24 h-24 text-gray-300 mx-auto mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            ยังไม่มีข้อมูลการคำนวณ
          </h3>
          <p class="text-gray-600 mb-6">กรุณาทำการคำนวณก่อนที่จะสร้างรายงาน</p>
          <NuxtLink
            :to="`/projects/${projectId}/versions/${versionId}/calculation`"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            ไปที่หน้าคำนวณ
          </NuxtLink>
        </div>

        <div v-else class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
              class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Nodes</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">
                    {{ networkData?.nodes?.length || 0 }}
                  </p>
                </div>
                <div
                  class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Pipes</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">
                    {{ networkData?.pipes?.length || 0 }}
                  </p>
                </div>
                <div
                  class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Fixtures</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">
                    {{ totalFixtures }}
                  </p>
                </div>
                <div
                  class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Length</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">
                    {{ totalPipeLength.toFixed(1) }}m
                  </p>
                </div>
                <div
                  class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b">
              <h2 class="text-lg font-semibold text-gray-900">
                ตัวอย่างเอกสาร (A4)
              </h2>
              <p class="text-sm text-gray-600">
                รายงานจะถูกสร้างในรูปแบบ PDF ขนาด A4 โดยอัตโนมัติ
              </p>
            </div>

            <div class="p-8 bg-gray-100">
              <div
                class="bg-white shadow-lg mx-auto"
                style="
                  width: 210mm;
                  min-height: 297mm;
                  padding: 20mm;
                  transform: scale(0.7);
                  transform-origin: top center;
                "
              >
                <div class="text-center mb-8">
                  <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">
                      CW PIPE CALCULATOR
                    </h1>
                    <h2 class="text-2xl font-semibold text-gray-700 mb-6">
                      CALCULATION RESULTS REPORT
                    </h2>
                    <div class="w-32 h-1 bg-blue-600 mx-auto mb-8"></div>
                  </div>

                  <div class="space-y-4 text-left max-w-md mx-auto">
                    <div class="flex justify-between py-2 border-b">
                      <span class="font-semibold text-gray-700"
                        >Project Name:</span
                      >
                      <span class="text-gray-900">{{
                        projectData?.name || "-"
                      }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                      <span class="font-semibold text-gray-700">Version:</span>
                      <span class="text-gray-900">{{
                        version?.name || "-"
                      }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                      <span class="font-semibold text-gray-700">Date:</span>
                      <span class="text-gray-900">{{
                        new Date().toLocaleDateString("th-TH")
                      }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                      <span class="font-semibold text-gray-700">Time:</span>
                      <span class="text-gray-900">{{
                        new Date().toLocaleTimeString("th-TH")
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="mb-8 p-6 bg-gray-50 rounded-lg border">
                  <h3
                    class="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300"
                  >
                    DESIGN CRITERIA
                  </h3>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">System Type:</span>
                      <span class="font-semibold text-gray-900">{{
                        criteria?.systemType || "-"
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Building Type:</span>
                      <span class="font-semibold text-gray-900">{{
                        criteria?.buildingType || "-"
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">C-Factor:</span>
                      <span class="font-semibold text-gray-900">{{
                        criteria?.cFactor || "-"
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Static Head:</span>
                      <span class="font-semibold text-gray-900"
                        >{{ criteria?.staticHead || "-" }} m</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Velocity Range:</span>
                      <span class="font-semibold text-gray-900"
                        >{{ criteria?.velocityMin || "-" }} -
                        {{ criteria?.velocityMax || "-" }} m/s</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Recommended Velocity:</span>
                      <span class="font-semibold text-gray-900"
                        >{{ criteria?.velocityRec || "-" }} m/s</span
                      >
                    </div>
                  </div>
                </div>

                <div class="mb-8">
                  <h3
                    class="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300"
                  >
                    NETWORK SUMMARY
                  </h3>
                  <div class="grid grid-cols-4 gap-4">
                    <div
                      class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <p class="text-2xl font-bold text-blue-900">
                        {{ networkData?.nodes?.length || 0 }}
                      </p>
                      <p class="text-xs text-gray-600 mt-1">Nodes</p>
                    </div>
                    <div
                      class="text-center p-4 bg-green-50 rounded-lg border border-green-200"
                    >
                      <p class="text-2xl font-bold text-green-900">
                        {{ networkData?.pipes?.length || 0 }}
                      </p>
                      <p class="text-xs text-gray-600 mt-1">Pipes</p>
                    </div>
                    <div
                      class="text-center p-4 bg-purple-50 rounded-lg border border-purple-200"
                    >
                      <p class="text-2xl font-bold text-purple-900">
                        {{ totalFixtures }}
                      </p>
                      <p class="text-xs text-gray-600 mt-1">Fixtures</p>
                    </div>
                    <div
                      class="text-center p-4 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <p class="text-2xl font-bold text-orange-900">
                        {{ totalPipeLength.toFixed(1) }}m
                      </p>
                      <p class="text-xs text-gray-600 mt-1">Total Length</p>
                    </div>
                  </div>
                </div>

                <div class="mb-8">
                  <h3
                    class="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300"
                  >
                    PIPE SIZING RESULTS
                  </h3>
                  <div class="overflow-x-auto">
                    <table
                      class="w-full text-sm border-collapse border border-gray-300"
                    >
                      <thead>
                        <tr class="bg-gray-100">
                          <th
                            class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 text-xs"
                          >
                            Pipe ID
                          </th>
                          <th
                            class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 text-xs"
                          >
                            From
                          </th>
                          <th
                            class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 text-xs"
                          >
                            To
                          </th>
                          <th
                            class="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 text-xs"
                          >
                            Size (mm)
                          </th>
                          <th
                            class="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 text-xs"
                          >
                            Velocity (m/s)
                          </th>
                          <th
                            class="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 text-xs"
                          >
                            Head Loss (m)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="pipe in (networkData?.pipes || []).slice(0, 5)"
                          :key="pipe.id"
                          class="hover:bg-gray-50"
                        >
                          <td class="border border-gray-300 px-3 py-2">
                            {{ pipe.id }}
                          </td>
                          <td class="border border-gray-300 px-3 py-2">
                            {{ getNodeName(pipe.sourceNodeId) }}
                          </td>
                          <td class="border border-gray-300 px-3 py-2">
                            {{ getNodeName(pipe.targetNodeId) }}
                          </td>
                          <td
                            class="border border-gray-300 px-3 py-2 text-right"
                          >
                            {{ pipe.nominalDiameter || "-" }}
                          </td>
                          <td
                            class="border border-gray-300 px-3 py-2 text-right"
                          >
                            {{ getPipeVelocity(pipe.id)?.toFixed(2) || "-" }}
                          </td>
                          <td
                            class="border border-gray-300 px-3 py-2 text-right"
                          >
                            {{ getPipeHeadLoss(pipe.id)?.toFixed(3) || "-" }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p class="text-xs text-gray-500 mt-2 text-center">
                    Showing first 5 pipes of
                    {{ networkData?.pipes?.length || 0 }} total pipes
                  </p>
                </div>

                <div class="mt-12 pt-6 border-t-2 border-gray-900">
                  <p class="text-xs text-gray-500 text-center">
                    This report was generated by CW Pipe Calculator v2.0
                  </p>
                  <p class="text-xs text-gray-500 text-center mt-1">
                    Generated: {{ new Date().toLocaleString("th-TH") }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                ข้อมูลเพิ่มเติม
              </h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">จำนวน blueprints:</span>
                  <span class="font-semibold text-gray-900">{{
                    blueprints.length
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">จำนวน audit logs:</span>
                  <span class="font-semibold text-gray-900">{{
                    auditLogs.length
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">สถานะ version:</span>
                  <span
                    :class="
                      version?.isCurrent
                        ? 'text-green-600 font-semibold'
                        : 'text-gray-600'
                    "
                  >
                    {{ version?.isCurrent ? "Current" : "Archived" }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                ดำเนินการ
              </h3>
              <div class="space-y-3">
                <button
                  @click="goToCalculation"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  แก้ไขการคำนวณ
                </button>
                <button
                  @click="goToAudit"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  ไปที่หน้า Audit Log
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-between items-center">
            <div class="flex gap-3">
              <BackButton @click="goToPrevStep" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="pdf-content" class="hidden"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import BackButton from "~/components/navigation/BackButton.vue";
import VersionSteps from "~/components/workflow/VersionSteps.vue";
import { useApi } from "~/composables/useApi";
import { useVersionStore } from "~/stores/versionStore";
import { useWorkflowStore } from "~/stores/workflowStore";

const route = useRoute();
const router = useRouter();
const api = useApi();
const versionStore = useVersionStore();
const workflowStore = useWorkflowStore();

// Make IDs computed directly from route parameters so they match calculation.vue formatting
const projectId = computed(() => parseInt(route.params.id as string));
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
const loading = ref(true);
const projectData = ref<any>(null);
const version = ref<any>(null);
const criteria = ref<any>(null);
const networkData = ref<any>(null);
const fixtures = ref<any[]>([]);
const calculationResults = ref<any>(null);
const blueprints = ref<any[]>([]);
const auditLogs = ref<any[]>([]);

// Computed
const totalFixtures = computed(() => {
  if (!networkData.value?.nodes) return 0;
  let total = 0;
  networkData.value.nodes.forEach((node: any) => {
    if (node.fixtures) {
      node.fixtures.forEach((fixture: any) => {
        total += fixture.quantity || 1;
      });
    }
  });
  return total;
});

const totalPipeLength = computed(() => {
  if (!networkData.value?.pipes) return 0;
  return networkData.value.pipes.reduce((sum: number, pipe: any) => {
    return sum + (pipe.length || 0);
  }, 0);
});

// Methods
const getNodeName = (nodeId: string) => {
  const node = networkData.value?.nodes?.find((n: any) => n.id === nodeId);
  return node?.name || nodeId;
};

const getPipeVelocity = (pipeId: string) => {
  return calculationResults.value?.pipeResults?.find(
    (r: any) => r.pipeId === pipeId
  )?.velocity;
};

const getPipeHeadLoss = (pipeId: string) => {
  return calculationResults.value?.pipeResults?.find(
    (r: any) => r.pipeId === pipeId
  )?.headLoss;
};

const loadData = async () => {
  try {
    loading.value = true;

    // Use .value to correctly unwrap refs
    const pId = projectId.value;
    const vId = versionId.value;

    // Load project data
    const projectRes = await api.get(`/projects/${pId}`);
    projectData.value = projectRes.data;

    // Load version data
    const versionRes = await api.get(`/projects/${pId}/versions/${vId}`);
    version.value = versionRes.data;

    // Load criteria
    const criteriaRes = await api.get(`/projects/${pId}/criteria`);
    criteria.value = criteriaRes.data;

    // Load network data
    const networkRes = await api.get(
      `/projects/${pId}/versions/${vId}/network`
    );
    networkData.value = networkRes.data;

    // Load fixtures
    const fixturesRes = await api.get(
      `/projects/${pId}/versions/${vId}/fixtures`
    );
    fixtures.value = fixturesRes.data;

    // Load calculation results
    const calcRes = await api.get(
      `/projects/${pId}/versions/${vId}/calculation`
    );
    calculationResults.value = calcRes.data;

    // Load blueprints
    const blueprintsRes = await api.get(
      `/projects/${pId}/versions/${vId}/blueprints`
    );
    blueprints.value = blueprintsRes.data;

    // Load audit logs
    const auditRes = await api.get(`/projects/${pId}/audit-logs`);
    auditLogs.value = auditRes.data;
  } catch (error) {
    console.error("Error loading report data:", error);
  } finally {
    loading.value = false;
  }
};

const exportPDF = async () => {
  try {
    // TODO: Implement PDF export using html2pdf.js
    alert("PDF Export feature will be implemented soon!");
  } catch (error) {
    console.error("Error exporting PDF:", error);
  }
};

const printReport = () => {
  window.print();
};

const goToCalculation = () => {
  router.push(
    `/projects/${projectId.value}/versions/${versionId.value}/calculation`
  );
};

const goToAudit = () => {
  router.push(`/projects/${projectId.value}/versions/${versionId.value}/audit`);
};

const goToPrevStep = () => {
  // นำทางกลับไปยังหน้าก่อนหน้าตาม Flow (หน้า Audit)
  router.push(`/projects/${projectId.value}/versions/${versionId.value}/audit`);
};

onMounted(() => {
  loadData();
  // อัปเดตสถานะ step ของ store หากมี
  workflowStore.setCurrentStep("versionReport");
});

// กำหนดให้ใช้ layout เดียวกันกับ calculate
definePageMeta({
  layout: "dashboard"
});
</script>

<style scoped>
@media print {
  .print\:hidden {
    display: none !important;
  }
}
</style>
