<template>
  <div class="min-h-screen bg-gray-50 print:bg-white">
    <!-- VersionSteps (hidden when printing) -->
    <div class="print:hidden">
      <VersionSteps :version-id="versionId" />
    </div>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 print:max-w-none print:p-0">
      <div class="px-4 py-6 sm:px-0 print:p-0">

        <!-- ===== HEADER BAR (hidden on print) ===== -->
        <div class="mb-6 print:hidden">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">สรุปผลการคำนวณ (Report)</h1>
              <p class="mt-1 text-sm text-gray-600">รายงานครบทุกขั้นตอน — Network, Fixtures, Pipe Sizing</p>
            </div>

            <div class="flex items-center gap-3">
              <!-- Export PDF -->
              <button
                @click="printReport"
                :disabled="loading || !hasData"
                class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print / Export PDF</span>
              </button>

              <!-- Version Badge -->
              <div class="bg-blue-100 border border-blue-200 rounded-lg px-4 py-2">
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <p class="text-xs text-blue-600 font-medium">Version</p>
                    <p class="text-lg font-bold text-blue-900">{{ version?.name || `Version ${version?.versionNumber || '-'}` }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== LOADING ===== -->
        <div v-if="loading" class="flex justify-center py-20 print:hidden">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
          </div>
        </div>

        <!-- ===== NO DATA ===== -->
        <div v-else-if="!hasData" class="bg-white rounded-lg shadow-sm p-12 text-center print:hidden">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">ยังไม่มีข้อมูลการคำนวณ</h3>
          <p class="text-gray-600 mb-6">กรุณาทำการคำนวณก่อนที่จะสร้างรายงาน</p>
          <NuxtLink
            :to="`/projects/${projectId}/versions/${versionId}/calculation`"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ไปที่หน้าคำนวณ
          </NuxtLink>
        </div>

        <div v-else class="space-y-6">

          <!-- ===== SUMMARY STAT CARDS (hidden on print) ===== -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 print:hidden">
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
              <p class="text-xs font-medium text-gray-500 uppercase">Nodes</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ networkData?.nodes?.length || 0 }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
              <p class="text-xs font-medium text-gray-500 uppercase">Pipes</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ networkData?.pipes?.length || 0 }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
              <p class="text-xs font-medium text-gray-500 uppercase">Fixtures</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalFixtureCount }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
              <p class="text-xs font-medium text-gray-500 uppercase">Length (m)</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalPipeLength.toFixed(1) }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
              <p class="text-xs font-medium text-gray-500 uppercase">Total FU</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ calcStats?.totalFU || 0 }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-teal-500">
              <p class="text-xs font-medium text-gray-500 uppercase">Max Flow (GPM)</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ calcStats?.flowRate || '-' }}</p>
            </div>
          </div>

          <!-- ===== PRINTABLE REPORT AREA ===== -->
          <div id="report-printable" class="bg-white shadow-lg overflow-hidden print:shadow-none">

            <!-- PAGE 1: Cover + Design Criteria + Network Summary -->
            <div class="report-page p-10 print:p-8">

              <!-- Cover Header -->
              <div class="text-center mb-10 pb-6 border-b-2 border-gray-800">
                <h1 class="text-3xl font-bold text-gray-900 tracking-wide">CW PIPE CALCULATOR</h1>
                <h2 class="text-xl font-semibold text-gray-600 mt-2">รายงานผลการคำนวณขนาดท่อ</h2>
                <div class="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
              </div>

              <!-- Project Info Grid -->
              <div class="grid grid-cols-2 gap-x-12 gap-y-2 text-sm mb-8">
                <div class="flex justify-between py-1.5 border-b border-gray-200">
                  <span class="text-gray-500 font-medium">Project:</span>
                  <span class="font-semibold text-gray-900">{{ projectData?.name || '-' }}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-gray-200">
                  <span class="text-gray-500 font-medium">Version:</span>
                  <span class="font-semibold text-gray-900">{{ version?.name || '-' }}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-gray-200">
                  <span class="text-gray-500 font-medium">วันที่:</span>
                  <span class="font-semibold text-gray-900">{{ reportDate }}</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-gray-200">
                  <span class="text-gray-500 font-medium">สถานะ:</span>
                  <span :class="version?.isCurrent ? 'text-green-700 font-semibold' : 'text-gray-600'">
                    {{ version?.isCurrent ? 'Current Version' : 'Archived' }}
                  </span>
                </div>
              </div>

              <!-- Design Criteria -->
              <div class="mb-8">
                <h3 class="text-base font-bold text-gray-900 mb-3 pb-1 border-b-2 border-gray-800 uppercase tracking-wide">
                  Design Criteria
                </h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div class="bg-gray-50 rounded p-3 border border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">System Type</p>
                    <p class="font-bold text-gray-900">{{ criteria?.systemType || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded p-3 border border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">Building Type</p>
                    <p class="font-bold text-gray-900">ที่อยู่อาศัย</p>
                  </div>
                  <div class="bg-gray-50 rounded p-3 border border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">C-Factor (Hazen-Williams)</p>
                    <p class="font-bold text-gray-900">{{ criteria?.cFactor || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded p-3 border border-gray-200 flex gap-4">
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Velocity Min (m/s)</p>
                      <p class="font-bold text-gray-900">{{ criteria?.velocityMin ?? '-' }}</p>
                    </div>
                    <div class="border-l border-gray-300 pl-4">
                      <p class="text-xs text-gray-500 mb-1">Velocity Max (m/s)</p>
                      <p class="font-bold text-gray-900">{{ criteria?.velocityMax ?? '-' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Network Summary -->
              <div>
                <h3 class="text-base font-bold text-gray-900 mb-3 pb-1 border-b-2 border-gray-800 uppercase tracking-wide">
                  Network Summary
                </h3>
                <div class="grid grid-cols-4 gap-4">
                  <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p class="text-3xl font-bold text-blue-900">{{ networkData?.nodes?.length || 0 }}</p>
                    <p class="text-xs text-gray-600 mt-1 font-medium">จุดต่อ (Nodes)</p>
                  </div>
                  <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <p class="text-3xl font-bold text-green-900">{{ networkData?.pipes?.length || 0 }}</p>
                    <p class="text-xs text-gray-600 mt-1 font-medium">เส้นท่อ (Pipes)</p>
                  </div>
                  <div class="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p class="text-3xl font-bold text-purple-900">{{ totalFixtureCount }}</p>
                    <p class="text-xs text-gray-600 mt-1 font-medium">สุขภัณฑ์ (Fixtures)</p>
                  </div>
                  <div class="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p class="text-3xl font-bold text-orange-900">{{ totalPipeLength.toFixed(1) }}m</p>
                    <p class="text-xs text-gray-600 mt-1 font-medium">ความยาวรวม</p>
                  </div>
                </div>

                <!-- FU/Flow Summary row -->
                <div class="grid grid-cols-3 gap-4 mt-4">
                  <div class="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <p class="text-2xl font-bold text-red-900">{{ calcStats?.totalFU || 0 }} FU</p>
                    <p class="text-xs text-gray-600 mt-1 font-medium">Fixture Units รวม</p>
                  </div>
                  <div class="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <p class="text-2xl font-bold text-teal-900">{{ calcStats?.flowRate || '-' }} GPM</p>
                    <p class="text-xs text-gray-600 mt-1 font-medium">Flow Rate (Critical Path)</p>
                  </div>
                  <div class="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p class="text-2xl font-bold text-indigo-900">{{ calcStats?.maxPipeSize || '-' }}</p>
                    <p class="text-xs text-gray-600 mt-1 font-medium">ขนาดท่อใหญ่สุด</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- PAGE 2: Critical Path Pipe Sizing Table -->
            <div class="report-page p-10 print:p-8 print:break-before-page border-t-4 border-red-500">
              <h3 class="text-base font-bold text-red-800 mb-4 pb-1 border-b-2 border-red-500 uppercase tracking-wide flex items-center gap-2">
                <span class="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                Critical Path Pipes
                <span class="text-sm font-normal text-red-600">({{ criticalPathPipes.length }} เส้น — เส้นทางหลัก)</span>
              </h3>

              <div v-if="criticalPathPipes.length === 0" class="text-center py-8 text-gray-400">
                <p>ไม่มีข้อมูล Critical Path</p>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-red-700 text-white">
                      <th class="px-3 py-2 text-left text-xs font-semibold w-6"></th>
                      <th class="px-3 py-2 text-left text-xs font-semibold">#</th>
                      <th class="px-3 py-2 text-left text-xs font-semibold">Segment</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Length (m)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">FU</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Flow (GPM)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Flow (LPS)</th>
                      <th class="px-3 py-2 text-center text-xs font-semibold">Size (mm)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Velocity (m/s)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Friction Loss (m)</th>
                      <th class="px-3 py-2 text-center text-xs font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(pipe, idx) in criticalPathPipes" :key="pipe.id">
                      <!-- Main pipe row -->
                      <tr
                        class="cursor-pointer hover:brightness-95 transition-all"
                        :class="[
                          idx % 2 === 0 ? 'bg-white' : 'bg-red-50',
                          pipe.status === 'CRITICAL' ? '!bg-red-100' : '',
                          pipe.status === 'WARNING' ? '!bg-yellow-50' : ''
                        ]"
                        @click="togglePipeRow(pipe.id)"
                      >
                        <td class="px-2 py-2 text-center border-b border-gray-100 print:hidden">
                          <span class="inline-block transition-transform duration-200 text-gray-400 text-xs"
                                :class="expandedPipes.has(String(pipe.id)) ? 'rotate-90' : ''">▶</span>
                        </td>
                        <td class="px-3 py-2 text-gray-500 text-xs border-b border-gray-100">{{ idx + 1 }}</td>
                        <td class="px-3 py-2 font-medium text-gray-800 border-b border-gray-100">{{ pipe.segmentName }}</td>
                        <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.length?.toFixed(1) || '-' }}</td>
                        <td class="px-3 py-2 text-right font-semibold text-gray-800 border-b border-gray-100">{{ pipe.totalFU ?? '-' }}</td>
                        <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.gpm?.toFixed(2) || '-' }}</td>
                        <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.lps?.toFixed(2) || '-' }}</td>
                        <td class="px-3 py-2 text-center border-b border-gray-100">
                          <span class="inline-block bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                            {{ pipe.nominalDiameter || '-' }}mm
                          </span>
                        </td>
                        <td class="px-3 py-2 text-right border-b border-gray-100">
                          <span :class="getVelocityTextClass(pipe.status)" class="font-semibold text-sm">
                            {{ pipe.velocity?.toFixed(2) || '-' }}
                          </span>
                        </td>
                        <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">
                          {{ pipe.frictionLoss != null ? pipe.frictionLoss.toFixed(2) : '-' }}
                        </td>
                        <td class="px-3 py-2 text-center border-b border-gray-100">
                          <span :class="getStatusBadgeClass(pipe.status)" class="text-xs font-medium px-2 py-0.5 rounded-full">
                            {{ getStatusLabel(pipe.status) }}
                          </span>
                        </td>
                      </tr>
                      <!-- Expand row — fixtures at this pipe's nodes -->
                      <template v-if="expandedPipes.has(String(pipe.id))">
                        <tr v-if="getPipeNodeFixtures(pipe).length === 0" class="print:hidden">
                          <td colspan="11" class="px-6 py-2 text-xs text-gray-400 italic border-b border-red-100 bg-red-50/40">
                            ไม่มี fixture ที่ node นี้
                          </td>
                        </tr>
                        <tr v-for="nodeGroup in getPipeNodeFixtures(pipe)" :key="nodeGroup.nodeLabel"
                            class="bg-red-50/60 print:hidden">
                          <td colspan="11" class="px-6 py-3 border-b border-red-100">
                            <p class="text-xs font-semibold text-red-700 mb-2">📍 Node: {{ nodeGroup.nodeLabel }}</p>
                            <table class="w-full text-xs border-collapse">
                              <thead>
                                <tr class="text-gray-500">
                                  <th class="text-left pb-1 pr-4">สุขภัณฑ์</th>
                                  <th class="text-right pb-1 pr-4">FU/ชิ้น</th>
                                  <th class="text-right pb-1 pr-4">จำนวน</th>
                                  <th class="text-right pb-1">FU รวม</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="f in nodeGroup.fixtures" :key="f.type">
                                  <td class="pr-4 py-0.5 text-gray-700">{{ f.label }}</td>
                                  <td class="pr-4 py-0.5 text-right text-gray-600">{{ f.fuPerUnit }}</td>
                                  <td class="pr-4 py-0.5 text-right text-gray-600">{{ f.quantity }}</td>
                                  <td class="py-0.5 text-right font-semibold text-red-800">{{ f.totalFU }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </template>
                    </template>
                  </tbody>
                </table>
              </div>

              <!-- Critical Path Legend -->
              <div class="mt-4 flex gap-6 text-xs text-gray-500">
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span> ✅ ดี (1.2–2.4 m/s)</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> ⚠️ ต่ำ/สูง (0.6–1.2 หรือ 2.4–3.0 m/s)</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span> ❌ วิกฤต (&lt;0.6 หรือ &gt;3.0 m/s)</span>
              </div>
            </div>

            <!-- PAGE 3: Branch Pipes Table -->
            <div class="report-page p-10 print:p-8 print:break-before-page border-t-4 border-blue-500">
              <h3 class="text-base font-bold text-blue-800 mb-4 pb-1 border-b-2 border-blue-500 uppercase tracking-wide flex items-center gap-2">
                <span class="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                Branch Pipes
                <span class="text-sm font-normal text-blue-600">({{ branchPipes.length }} เส้น — เส้นแยก)</span>
              </h3>

              <div v-if="branchPipes.length === 0" class="text-center py-8 text-gray-400">
                <p>ไม่มีข้อมูล Branch Pipes</p>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-blue-700 text-white">
                      <th class="px-3 py-2 text-left text-xs font-semibold w-6 print:hidden"></th>
                      <th class="px-3 py-2 text-left text-xs font-semibold">#</th>
                      <th class="px-3 py-2 text-left text-xs font-semibold">Segment</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Length (m)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">FU</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Flow (GPM)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Flow (LPS)</th>
                      <th class="px-3 py-2 text-center text-xs font-semibold">Size (mm)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Velocity (m/s)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Friction Loss (m)</th>
                      <th class="px-3 py-2 text-center text-xs font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(pipe, idx) in branchPipes" :key="pipe.id">
                      <!-- Main pipe row -->
                      <tr
                        class="cursor-pointer hover:brightness-95 transition-all"
                        :class="[
                          idx % 2 === 0 ? 'bg-white' : 'bg-blue-50',
                          pipe.status === 'CRITICAL' ? '!bg-red-100' : '',
                          pipe.status === 'WARNING' ? '!bg-yellow-50' : ''
                        ]"
                        @click="togglePipeRow(pipe.id)"
                      >
                        <td class="px-2 py-2 text-center border-b border-gray-100 print:hidden">
                          <span class="inline-block transition-transform duration-200 text-gray-400 text-xs"
                                :class="expandedPipes.has(String(pipe.id)) ? 'rotate-90' : ''">▶</span>
                        </td>
                        <td class="px-3 py-2 text-gray-500 text-xs border-b border-gray-100">{{ idx + 1 }}</td>
                        <td class="px-3 py-2 font-medium text-gray-800 border-b border-gray-100">{{ pipe.segmentName }}</td>
                        <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.length?.toFixed(1) || '-' }}</td>
                        <td class="px-3 py-2 text-right font-semibold text-gray-800 border-b border-gray-100">{{ pipe.totalFU ?? '-' }}</td>
                        <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.gpm?.toFixed(2) || '-' }}</td>
                        <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.lps?.toFixed(2) || '-' }}</td>
                        <td class="px-3 py-2 text-center border-b border-gray-100">
                          <span class="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                            {{ pipe.nominalDiameter || '-' }}mm
                          </span>
                        </td>
                        <td class="px-3 py-2 text-right border-b border-gray-100">
                          <span :class="getVelocityTextClass(pipe.status)" class="font-semibold text-sm">
                            {{ pipe.velocity?.toFixed(2) || '-' }}
                          </span>
                        </td>
                        <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">
                          {{ pipe.frictionLoss != null ? pipe.frictionLoss.toFixed(2) : '-' }}
                        </td>
                        <td class="px-3 py-2 text-center border-b border-gray-100">
                          <span :class="getStatusBadgeClass(pipe.status)" class="text-xs font-medium px-2 py-0.5 rounded-full">
                            {{ getStatusLabel(pipe.status) }}
                          </span>
                        </td>
                      </tr>
                      <!-- Expand row — fixtures at this pipe's nodes -->
                      <template v-if="expandedPipes.has(String(pipe.id))">
                        <tr v-if="getPipeNodeFixtures(pipe).length === 0" class="print:hidden">
                          <td colspan="11" class="px-6 py-2 text-xs text-gray-400 italic border-b border-blue-100 bg-blue-50/40">
                            ไม่มี fixture ที่ node นี้
                          </td>
                        </tr>
                        <tr v-for="nodeGroup in getPipeNodeFixtures(pipe)" :key="nodeGroup.nodeLabel"
                            class="bg-blue-50/60 print:hidden">
                          <td colspan="11" class="px-6 py-3 border-b border-blue-100">
                            <p class="text-xs font-semibold text-blue-700 mb-2">📍 Node: {{ nodeGroup.nodeLabel }}</p>
                            <table class="w-full text-xs border-collapse">
                              <thead>
                                <tr class="text-gray-500">
                                  <th class="text-left pb-1 pr-4">สุขภัณฑ์</th>
                                  <th class="text-right pb-1 pr-4">FU/ชิ้น</th>
                                  <th class="text-right pb-1 pr-4">จำนวน</th>
                                  <th class="text-right pb-1">FU รวม</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="f in nodeGroup.fixtures" :key="f.type">
                                  <td class="pr-4 py-0.5 text-gray-700">{{ f.label }}</td>
                                  <td class="pr-4 py-0.5 text-right text-gray-600">{{ f.fuPerUnit }}</td>
                                  <td class="pr-4 py-0.5 text-right text-gray-600">{{ f.quantity }}</td>
                                  <td class="py-0.5 text-right font-semibold text-blue-800">{{ f.totalFU }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </template>
                    </template>
                  </tbody>
                </table>
              </div>

              <div class="mt-4 flex gap-6 text-xs text-gray-500">
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span> ✅ ดี (1.2–2.4 m/s)</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> ⚠️ ต่ำ/สูง</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span> ❌ วิกฤต</span>
              </div>
            </div>

            <!-- PAGE 4: Fixtures Summary -->
            <div class="report-page p-10 print:p-8 print:break-before-page border-t-4 border-purple-500">
              <h3 class="text-base font-bold text-purple-800 mb-4 pb-1 border-b-2 border-purple-500 uppercase tracking-wide">
                Fixtures Summary — สรุปสุขภัณฑ์
              </h3>

              <div v-if="fixtureTypesSummary.length === 0" class="text-center py-8 text-gray-400">
                <p>ไม่มีข้อมูล Fixtures</p>
              </div>

              <div v-else>
                <table class="w-full text-sm border-collapse mb-6">
                  <thead>
                    <tr class="bg-purple-700 text-white">
                      <th class="px-4 py-2 text-left text-xs font-semibold">ประเภทสุขภัณฑ์</th>
                      <th class="px-4 py-2 text-right text-xs font-semibold">FU/หน่วย</th>
                      <th class="px-4 py-2 text-right text-xs font-semibold">จำนวน (ชิ้น)</th>
                      <th class="px-4 py-2 text-right text-xs font-semibold">FU รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(ft, idx) in fixtureTypesSummary"
                      :key="ft.type"
                      :class="idx % 2 === 0 ? 'bg-white' : 'bg-purple-50'"
                    >
                      <td class="px-4 py-2 font-medium text-gray-800 border-b border-gray-100">
                        {{ getFixtureLabel(ft.type) }}
                        <span class="text-xs text-gray-400 ml-1">({{ ft.type }})</span>
                      </td>
                      <td class="px-4 py-2 text-right text-gray-700 border-b border-gray-100">{{ ft.fuPerUnit }}</td>
                      <td class="px-4 py-2 text-right text-gray-700 border-b border-gray-100">{{ ft.count }}</td>
                      <td class="px-4 py-2 text-right font-bold text-purple-800 border-b border-gray-100">{{ ft.totalFU }}</td>
                    </tr>
                    <!-- Total row -->
                    <tr class="bg-purple-100 font-bold">
                      <td class="px-4 py-2 text-gray-900 border-t-2 border-purple-400">รวมทั้งหมด</td>
                      <td class="px-4 py-2 border-t-2 border-purple-400"></td>
                      <td class="px-4 py-2 text-right text-gray-900 border-t-2 border-purple-400">{{ totalFixtureCount }}</td>
                      <td class="px-4 py-2 text-right text-purple-900 border-t-2 border-purple-400">{{ calcStats?.totalFU || 0 }} FU</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Fixture FU note -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 text-xs text-gray-600">
                  <p class="font-semibold text-gray-700 mb-2">ค่า FU มาตรฐาน (อ้างอิง: วริทธิ์ อึ๊งภากรณ์, 2556)</p>
                  <div class="grid grid-cols-3 gap-2">
                    <span>WC (Flush Tank) = 3 FU</span>
                    <span>WC (Flush Valve) = 6 FU</span>
                    <span>Lavatory = 1 FU</span>
                    <span>Bathtub = 2 FU</span>
                    <span>Shower = 2 FU</span>
                    <span>Kitchen Sink = 2 FU</span>
                    <span>Washing Machine 3.5kg = 2 FU</span>
                    <span>Washing Machine 7kg = 4 FU</span>
                    <span>Hose Bibb = 0 FU + 5 GPM</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- REPORT FOOTER -->
            <div class="p-8 border-t-2 border-gray-300 bg-gray-50">
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>CW Pipe Calculator v2.0 — {{ projectData?.name || '' }} / {{ version?.name || '' }}</span>
                <span>Generated: {{ reportDate }}</span>
              </div>
            </div>

          </div>
          <!-- END PRINTABLE -->

          <!-- ===== ACTION PANEL (hidden on print) ===== -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">ข้อมูลเพิ่มเติม</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Critical Path:</span>
                  <span class="font-semibold text-red-700">{{ criticalPathPipes.length }} เส้น</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Branch Pipes:</span>
                  <span class="font-semibold text-blue-700">{{ branchPipes.length }} เส้น</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Version Status:</span>
                  <span :class="version?.isCurrent ? 'text-green-600 font-semibold' : 'text-gray-600'">
                    {{ version?.isCurrent ? 'Current' : 'Archived' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">ดำเนินการ</h3>
              <div class="space-y-3">
                <button
                  @click="goToCalculation"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  แก้ไขการคำนวณ
                </button>
                <button
                  @click="goToAudit"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  ไปที่หน้า Audit Log
                </button>
              </div>
            </div>
          </div>

          <div class="mt-4 flex gap-3 print:hidden">
            <BackButton @click="goToPrevStep" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BackButton from '~/components/navigation/BackButton.vue'
import VersionSteps from '~/components/workflow/VersionSteps.vue'
import { projectsApi, versionsApi } from '~/composables/useApi'
import { useWorkflowStore } from '~/stores/workflowStore'
import { calculateUPCGPM } from '~/shared/constants/hunterCurve.ts'
import { calculatePVCInternalDiameterWorstCase } from '../../../../../../shared/constants/pipes.ts'

// ===== PIPE SIZES TABLE (from Hazen-Williams calc, same as AutoSuggestUpsizing) =====
const PIPE_SIZES = [
  { mm: 15, inches: '1/2', internalDiameterM: 0.0158 },
  { mm: 20, inches: '3/4', internalDiameterM: 0.0209 },
  { mm: 25, inches: '1',   internalDiameterM: 0.0266 },
  { mm: 32, inches: '1-1/4', internalDiameterM: 0.035 },
  { mm: 40, inches: '1-1/2', internalDiameterM: 0.0409 },
  { mm: 50, inches: '2',   internalDiameterM: 0.0525 },
]

const FIXTURE_LABELS: Record<string, string> = {
  WC_TANK: 'โถส้วม (Flush Tank)',
  WC_VALVE: 'โถส้วม (Flush Valve)',
  LAVATORY: 'อ่างล้างหน้า (Lavatory)',
  BATHTUB: 'อ่างอาบน้ำ (Bathtub)',
  SHOWER: 'ฝักบัว (Shower)',
  HOSE_BIBB: 'ก๊อกสนาม (Hose Bibb)',
  KITCHEN_SINK: 'ซิงค์ครัว (Kitchen Sink)',
  WASHING_MACHINE_3_5KG: 'เครื่องซักผ้า 3.5kg',
  WASHING_MACHINE_7KG: 'เครื่องซักผ้า 7kg',
}

const route  = useRoute()
const router = useRouter()
const workflowStore = useWorkflowStore()

const projectId = computed(() => parseInt(route.params.id as string))
const versionId = computed(() => {
  const id = route.params.versionId
  if (typeof id === 'number') return id
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10)
    return isNaN(parsed) ? null : parsed
  }
  return null
})

// ===== STATE =====
const loading     = ref(true)
const projectData = ref<any>(null)
const version     = ref<any>(null)
const criteria    = ref<any>(null)
const networkData = ref<any>(null)    // parsed snapshotNetwork
const fixturesData = ref<any>(null)  // parsed snapshotFixtures
const resultsData  = ref<any>(null)  // parsed snapshotResults

// ===== COMPUTED =====
const hasData = computed(() => !!networkData.value)

const reportDate = computed(() => new Date().toLocaleDateString('th-TH', {
  year: 'numeric', month: 'long', day: 'numeric'
}))

const calcStats = computed(() => {
  const pipes = enrichedPipes.value
  if (!pipes.length) return null

  // Total FU = FU ของ pipe ที่ออกจาก SOURCE node โดยตรง
  // (pipe นี้รองรับ flow จาก fixture ทุกตัวในระบบ)
  const sourceNode = (networkData.value?.nodes || []).find((n: any) =>
    n.type === 'SOURCE' || n.type === 'source'
  )
  let totalFU = 0
  if (sourceNode) {
    const sourcePipe = pipes.find((p: any) =>
      String(p.sourceNodeId) === String(sourceNode.id)
    )
    totalFU = sourcePipe?.totalFU || 0
  }
  // ถ้าหา SOURCE ไม่เจอ ใช้ FU สูงสุดจาก critical path เป็น fallback
  if (totalFU === 0) {
    const criticalPipes = pipes.filter((p: any) => p.isCriticalPath)
    const pool = criticalPipes.length ? criticalPipes : pipes
    totalFU = pool.reduce((max: number, p: any) => Math.max(max, p.totalFU || 0), 0)
  }

  // Flow rate สูงสุดบน Critical Path (pipe ที่อยู่ใกล้ SOURCE ที่สุด)
  const criticalPipes = pipes.filter((p: any) => p.isCriticalPath)
  const gpmPool = criticalPipes.length ? criticalPipes : pipes
  const flowRateVal = gpmPool.reduce((max: number, p: any) => Math.max(max, p.gpm || 0), 0)
  const flowRate = flowRateVal > 0 ? flowRateVal.toFixed(2) : '-'

  // ขนาดท่อใหญ่สุด
  const maxSizeMM = Math.max(...pipes.map((p: any) => p.nominalDiameter || 0))
  const maxPipeSize = maxSizeMM > 0 ? `${maxSizeMM}mm` : '-'

  return { totalFU, flowRate, maxPipeSize }
})

// Total pipe length from networkData
const totalPipeLength = computed(() => {
  if (!networkData.value?.pipes) return 0
  return networkData.value.pipes.reduce((sum: number, p: any) => sum + (p.length || 0), 0)
})

// Aggregate fixture count from snapshotFixtures nodes
const totalFixtureCount = computed(() => {
  if (!fixturesData.value?.nodes) {
    if (!networkData.value?.nodes) return 0
    let total = 0
    networkData.value.nodes.forEach((n: any) => {
      if (n.fixtures) n.fixtures.forEach((f: any) => { total += f.quantity || 1 })
    })
    return total
  }
  let total = 0
  fixturesData.value.nodes.forEach((n: any) => {
    if (n.fixtures) n.fixtures.forEach((f: any) => { total += f.quantity || 1 })
  })
  return total
})

// ===== FIXTURES COMPUTATION (same algorithm as fixtures.vue) =====

const getStandardFU = (type: string): number => {
  const FU: Record<string, number> = {
    WC_TANK: 3, WC_VALVE: 6, LAVATORY: 1, BATHTUB: 2, SHOWER: 2,
    HOSE_BIBB: 0, KITCHEN_SINK: 2, LAUNDRY_TRAY: 3, DISHWASHER: 1,
    WASHING_MACHINE_3_5KG: 2, WASHING_MACHINE_7KG: 4
  }
  return FU[type?.trim().toUpperCase()] ?? 1
}

// Water Factor Table (same as AutoSuggestUpsizing) — applied to Hunter GPM only, not HoseBibb
const WATER_FACTOR_TABLE = [
  { fuMin: 0,    fuMax: 400,  percent: 100 },
  { fuMin: 401,  fuMax: 600,  percent: 87  },
  { fuMin: 601,  fuMax: 900,  percent: 75  },
  { fuMin: 901,  fuMax: 1200, percent: 64  },
  { fuMin: 1201, fuMax: 1500, percent: 63  },
  { fuMin: 1501, fuMax: 2000, percent: 61  },
  { fuMin: 2001, fuMax: 2500, percent: 60  },
  { fuMin: 2501, fuMax: 3000, percent: 59  },
  { fuMin: 3001, fuMax: 4000, percent: 58  },
  { fuMin: 4001, fuMax: 5000, percent: 56  },
  { fuMin: 5001, fuMax: 8000, percent: 55  },
]

const getWaterFactorPercent = (fu: number): number => {
  const row = WATER_FACTOR_TABLE.find(r => fu >= r.fuMin && fu <= r.fuMax)
  return row?.percent ?? 100
}

// Trace downstream from targetNodeId — collect all fixtures (same logic as fixtures.vue)
const traceDownstreamFixtures = (startNodeId: number | string): any[] => {
  const nodes = networkData.value?.nodes || []
  const pipes  = networkData.value?.pipes  || []
  const collected: any[] = []
  const visitedNodes = new Set<string>()
  const visitedPipes = new Set<string>()

  const trace = (nodeId: number | string) => {
    const key = String(nodeId)
    if (visitedNodes.has(key)) return
    visitedNodes.add(key)

    const node = nodes.find((n: any) => String(n.id) === key)
    if (!node) return

    if (node.fixtures?.length) {
      node.fixtures.forEach((f: any) =>
        collected.push({ ...f, nodeName: node.label || `Node ${nodeId}` })
      )
    }

    pipes
      .filter((p: any) => String(p.sourceNodeId) === key)
      .forEach((p: any) => {
        const pk = String(p.id)
        if (!visitedPipes.has(pk)) {
          visitedPipes.add(pk)
          trace(p.targetNodeId)
        }
      })
  }

  trace(startNodeId)
  return collected
}

// Compute FU + GPM for a pipe from network data directly (same as AutoSuggestUpsizing.analyzePipesV2)
// Applies Water Factor to Hunter GPM (consistent with calculation page)
const computePipeFUAndGPM = (targetNodeId: number | string) => {
  const fixtures = traceDownstreamFixtures(targetNodeId)

  let flushTankFU  = 0
  let flushValveFU = 0
  let hoseBibbCount = 0

  fixtures.forEach((f: any) => {
    const qty  = Number(f.quantity) || 1
    const type = f.type?.trim().toUpperCase()
    if (type === 'HOSE_BIBB')  hoseBibbCount += qty
    else if (type === 'WC_VALVE') flushValveFU += getStandardFU(type) * qty
    else                          flushTankFU  += getStandardFU(type) * qty
  })

  const totalFU     = flushTankFU + flushValveFU
  const upc         = calculateUPCGPM(flushTankFU, flushValveFU)
  const hunterGPM   = upc.totalGPM

  // Apply Water Factor to Hunter GPM only (HoseBibb is constant flow, not factored)
  const waterFactorPct   = getWaterFactorPercent(totalFU)
  const adjustedHunterGPM = hunterGPM * (waterFactorPct / 100)

  const hoseBibbGPM = hoseBibbCount * 5
  const totalGPM    = adjustedHunterGPM + hoseBibbGPM   // design flow (matches calc page)

  return { totalFU, hunterGPM: adjustedHunterGPM, hoseBibbGPM, totalGPM, waterFactorPct }
}

// ===== FIXTURE DATA MAP from snapshotFixtures (authoritative FU/GPM source from fixtures page) =====
const fixtureDataMap = computed(() => {
  const map = new Map<string, any>()
  const pipes = fixturesData.value?.pipes || []
  pipes.forEach((p: any) => {
    if (p.pipeId != null) map.set(String(p.pipeId), p)
  })
  return map
})

// Map pipe IDs → results from snapshotResults (exact values saved by step 4 calculate page)
const resultsMap = computed(() => {
  const map = new Map<string, any>()
  if (!resultsData.value) return map
  const allPipes = [
    ...(resultsData.value.criticalPath || []),
    ...(resultsData.value.branch || [])
  ]
  allPipes.forEach((p: any) => {
    if (p.pipeId != null) map.set(String(p.pipeId), p)
  })
  return map
})

// Helper: compute velocity + friction loss from m³/s flow rate and pipe size
// Uses PVC worst-case formula (same as calculate page) when cFactor=150
const calcHydraulics = (m3s: number, nominalDiameter: number, pipeLength: number) => {
  if (m3s <= 0) return { velocity: null, frictionLoss: null, frictionLossRate: null, status: 'OK' as const }

  const cFactor  = criteria.value?.cFactor  || 150
  const pvcClass = criteria.value?.pvcClass || 7

  let d = 0
  if (cFactor === 150) {
    // PVC pipe: use worst-case PVC formula — same internal diameter as calculate page
    d = calculatePVCInternalDiameterWorstCase(nominalDiameter, pvcClass)
  }
  if (!d || d <= 0) {
    // Fallback to nominal-size table (non-PVC materials or PVC lookup failed)
    const pipeSize = PIPE_SIZES.find(s => s.mm === nominalDiameter)
    if (!pipeSize) return { velocity: null, frictionLoss: null, frictionLossRate: null, status: 'OK' as const }
    d = pipeSize.internalDiameterM
  }

  const area     = Math.PI * Math.pow(d / 2, 2)
  const velocity = m3s / area

  let status: 'OK' | 'WARNING' | 'CRITICAL' = 'OK'
  if (velocity < 0.6 || velocity > 3.0)      status = 'CRITICAL'
  else if (velocity < 1.2 || velocity > 2.4) status = 'WARNING'

  // Hazen-Williams rate: (10.583 / D^4.87) × (Q/C)^1.85 × 100  [m/100m]
  const frictionLossRate = (10.583 / Math.pow(d, 4.87)) * Math.pow(m3s / cFactor, 1.85) * 100
  const frictionLoss = pipeLength > 0 ? frictionLossRate * pipeLength / 100 : null

  return { velocity, frictionLoss, frictionLossRate, status }
}

// Build enriched pipe list
// Source priority:
//   1. snapshotResults  — exact values from step 4 (velocity/frictionLoss guaranteed to match)
//   2. snapshotFixtures — FU/GPM for recalculation (fallback for pipes not yet in results)
//   3. BFS from nodes   — last resort for pipes not in either snapshot
const enrichedPipes = computed(() => {
  if (!networkData.value?.pipes) return []

  const nodesMap = new Map<string, any>()
  ;(networkData.value.nodes || []).forEach((n: any) => nodesMap.set(String(n.id), n))

  return networkData.value.pipes.map((pipe: any) => {
    const srcNode  = nodesMap.get(String(pipe.sourceNodeId))
    const tgtNode  = nodesMap.get(String(pipe.targetNodeId))
    const srcLabel = srcNode?.label || srcNode?.name || `Node${pipe.sourceNodeId}`
    const tgtLabel = tgtNode?.label || tgtNode?.name || `Node${pipe.targetNodeId}`
    const segmentName = `${srcLabel} → ${tgtLabel}`

    // Always convert nominalSize to number (NetworkBuilder stores it as string "15")
    const nominalDiameter: number | null =
      pipe.nominalSize != null ? Number(pipe.nominalSize) :
      pipe.nominalDiameter != null ? Number(pipe.nominalDiameter) : null

    // ── PRIMARY: snapshotResults — exact values from step 4 calculate page ──────────────
    const resultRecord = resultsMap.value.get(String(pipe.id))
    if (resultRecord) {
      const gpm  = resultRecord.gpm  ?? 0
      const lps  = resultRecord.lps  ?? (gpm * 0.0630902)
      const velocity        = resultRecord.velocity        ?? null
      const frictionLoss    = resultRecord.frictionLoss    ?? null  // total m (majorLoss)
      const frictionLossRate = resultRecord.frictionLossRate ?? null // m/100m rate
      const totalFU         = resultRecord.totalFU         ?? 0
      const isCriticalPath  = resultRecord.isCriticalPath  ?? (pipe.isCriticalPath ?? false)

      let status: 'OK' | 'WARNING' | 'CRITICAL' = 'OK'
      if (velocity != null) {
        if (velocity < 0.6 || velocity > 3.0)      status = 'CRITICAL'
        else if (velocity < 1.2 || velocity > 2.4) status = 'WARNING'
      }

      return {
        id:              pipe.id,
        sourceNodeId:    pipe.sourceNodeId,
        targetNodeId:    pipe.targetNodeId,
        segmentName,
        length:          pipe.length,
        nominalDiameter: nominalDiameter ?? resultRecord.sizeMM ?? resultRecord.nominalDiameter,
        isCriticalPath,
        totalFU,
        gpm,
        lps,
        velocity,
        frictionLoss,
        frictionLossRate,
        status,
      }
    }

    // ── FALLBACK: snapshotFixtures or BFS → recalculate hydraulics ───────────────────────
    let totalFU = 0
    let gpm: number | null = null
    let lps: number | null = null
    let m3s: number | null = null

    const fixData = fixtureDataMap.value.get(String(pipe.id))
    if (fixData) {
      totalFU = fixData.totalFU || 0
      const rawHunterGPM = fixData.hunterGPM || 0
      const hoseBibbGPM  = fixData.hoseBibbGPM || 0
      const wf = getWaterFactorPercent(totalFU) / 100
      const adjustedGPM = rawHunterGPM * wf + hoseBibbGPM
      if (adjustedGPM > 0) {
        gpm = adjustedGPM
        lps = gpm * 0.0630902
        m3s = gpm * 6.30902e-5
      }
    } else {
      const bfs = computePipeFUAndGPM(pipe.targetNodeId)
      totalFU = bfs.totalFU
      if (bfs.totalGPM > 0) {
        gpm = bfs.totalGPM
        lps = gpm * 0.0630902
        m3s = gpm * 6.30902e-5
      }
    }

    const hydraulics = (m3s != null && nominalDiameter)
      ? calcHydraulics(m3s, nominalDiameter, pipe.length || 0)
      : { velocity: null, frictionLoss: null, frictionLossRate: null, status: 'OK' as const }

    return {
      id:              pipe.id,
      sourceNodeId:    pipe.sourceNodeId,
      targetNodeId:    pipe.targetNodeId,
      segmentName,
      length:          pipe.length,
      nominalDiameter,
      isCriticalPath:  pipe.isCriticalPath ?? false,
      totalFU,
      gpm,
      lps,
      velocity:        hydraulics.velocity,
      frictionLoss:    hydraulics.frictionLoss,
      frictionLossRate: hydraulics.frictionLossRate,
      status:          hydraulics.status,
    }
  })
})

const criticalPathPipes = computed(() => enrichedPipes.value.filter(p => p.isCriticalPath))
const branchPipes       = computed(() => enrichedPipes.value.filter(p => !p.isCriticalPath))

const pipesNeedingUpsize = computed(() =>
  enrichedPipes.value.filter(p => p.status === 'WARNING' || p.status === 'CRITICAL').length
)

// Aggregate fixtures by type from all nodes
const fixtureTypesSummary = computed(() => {
  const groups: Record<string, { type: string; count: number; fuPerUnit: number; totalFU: number }> = {}

  const FU_MAP: Record<string, number> = {
    WC_TANK: 3, WC_VALVE: 6, LAVATORY: 1, BATHTUB: 2, SHOWER: 2,
    HOSE_BIBB: 0, KITCHEN_SINK: 2, WASHING_MACHINE_3_5KG: 2, WASHING_MACHINE_7KG: 4
  }

  const collectFixtures = (nodes: any[]) => {
    nodes.forEach((n: any) => {
      ;(n.fixtures || []).forEach((f: any) => {
        const type = (f.type || 'UNKNOWN').trim().toUpperCase()
        const qty  = f.quantity || 1
        const fu   = FU_MAP[type] ?? 1
        if (!groups[type]) groups[type] = { type, count: 0, fuPerUnit: fu, totalFU: 0 }
        groups[type].count   += qty
        groups[type].totalFU += fu * qty
      })
    })
  }

  if (fixturesData.value?.nodes?.length) {
    collectFixtures(fixturesData.value.nodes)
  } else if (networkData.value?.nodes?.length) {
    collectFixtures(networkData.value.nodes)
  }

  return Object.values(groups).sort((a, b) => b.totalFU - a.totalFU)
})

// ===== EXPAND ROW STATE =====
const expandedPipes = ref(new Set<string>())

const togglePipeRow = (pipeId: string | number) => {
  const key = String(pipeId)
  if (expandedPipes.value.has(key)) {
    expandedPipes.value.delete(key)
  } else {
    expandedPipes.value.add(key)
  }
  // trigger reactivity
  expandedPipes.value = new Set(expandedPipes.value)
}

const FU_MAP_GLOBAL: Record<string, number> = {
  WC_TANK: 3, WC_VALVE: 6, LAVATORY: 1, BATHTUB: 2, SHOWER: 2,
  HOSE_BIBB: 0, KITCHEN_SINK: 2, WASHING_MACHINE_3_5KG: 2, WASHING_MACHINE_7KG: 4
}

// ดึง fixtures จาก node ปลายทาง (targetNodeId) และ node ต้นทาง (sourceNodeId) ของท่อนั้น
const getPipeNodeFixtures = (pipe: any): { nodeLabel: string; fixtures: any[] }[] => {
  const nodes = networkData.value?.nodes || []
  const result: { nodeLabel: string; fixtures: any[] }[] = []

  const ids = [pipe.targetNodeId, pipe.sourceNodeId].filter(Boolean)
  for (const nid of ids) {
    const node = nodes.find((n: any) => String(n.id) === String(nid))
    if (!node || !node.fixtures?.length) continue
    const enriched = node.fixtures.map((f: any) => ({
      type: f.type,
      label: FIXTURE_LABELS[f.type] || f.type,
      quantity: f.quantity || 1,
      fuPerUnit: FU_MAP_GLOBAL[f.type] ?? 1,
      totalFU: (FU_MAP_GLOBAL[f.type] ?? 1) * (f.quantity || 1),
    }))
    result.push({ nodeLabel: node.label || node.name || `Node ${nid}`, fixtures: enriched })
  }
  return result
}

// ===== HELPERS =====
const getStatusBadgeClass = (status?: string) => {
  if (status === 'OK')       return 'bg-green-100 text-green-800'
  if (status === 'WARNING')  return 'bg-yellow-100 text-yellow-800'
  if (status === 'CRITICAL') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-600'
}
const getVelocityTextClass = (status?: string) => {
  if (status === 'OK')       return 'text-green-700'
  if (status === 'WARNING')  return 'text-yellow-700'
  if (status === 'CRITICAL') return 'text-red-700'
  return 'text-gray-500'
}
const getStatusLabel = (status?: string) => {
  if (status === 'OK')       return '✅ ดี'
  if (status === 'WARNING')  return '⚠️ ต้องตรวจสอบ'
  if (status === 'CRITICAL') return '❌ วิกฤต'
  return '-'
}
const getFixtureLabel = (type: string) => FIXTURE_LABELS[type] || type

// ===== LOAD DATA =====
const loadData = async () => {
  try {
    loading.value = true
    const pId = projectId.value
    const vId = versionId.value

    const versionData = await versionsApi.get(vId)
    if (versionData) {
      version.value = versionData
      if (versionData.snapshotNetwork) {
        try { networkData.value = JSON.parse(versionData.snapshotNetwork) } catch {}
      }
      if (versionData.snapshotFixtures) {
        try { fixturesData.value = JSON.parse(versionData.snapshotFixtures) } catch {}
      }
      if (versionData.snapshotResults) {
        try { resultsData.value = JSON.parse(versionData.snapshotResults) } catch {}
      }
    }

    const [projectRes, criteriaRes] = await Promise.all([
      projectsApi.get(pId),
      projectsApi.getCriteria(pId).catch(() => null)
    ])
    projectData.value = projectRes
    criteria.value    = criteriaRes

  } catch (error) {
    console.error('Error loading report data:', error)
  } finally {
    loading.value = false
  }
}

// ===== ACTIONS =====
const printReport = () => window.print()

const goToCalculation = () =>
  router.push(`/projects/${projectId.value}/versions/${versionId.value}/calculation`)

const goToAudit = () =>
  router.push(`/projects/${projectId.value}/versions/${versionId.value}/audit`)

const goToPrevStep = () =>
  router.push(`/projects/${projectId.value}/versions/${versionId.value}/audit`)

onMounted(() => {
  loadData()
  workflowStore.setCurrentStep('versionReport')
})

definePageMeta({ layout: 'dashboard' })
</script>

<style scoped>
@media print {
  @page { size: A4; margin: 15mm; }
  .print\:hidden { display: none !important; }
  body { background: white !important; }
  .report-page { page-break-after: always; break-after: page; }
  .report-page:last-of-type { page-break-after: avoid; break-after: avoid; }
  #report-printable { box-shadow: none !important; width: 100% !important; }
  tr { page-break-inside: avoid; break-inside: avoid; }
}
</style>
