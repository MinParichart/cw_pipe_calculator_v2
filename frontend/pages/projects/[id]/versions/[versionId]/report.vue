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
                <div class="grid grid-cols-3 gap-4 text-sm">
                  <div class="bg-gray-50 rounded p-3 border border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">System Type</p>
                    <p class="font-bold text-gray-900">{{ criteria?.systemType || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded p-3 border border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">Building Type</p>
                    <p class="font-bold text-gray-900">{{ criteria?.buildingType || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded p-3 border border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">C-Factor (Hazen-Williams)</p>
                    <p class="font-bold text-gray-900">{{ criteria?.cFactor || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded p-3 border border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">Velocity Min (m/s)</p>
                    <p class="font-bold text-gray-900">{{ criteria?.velocityMin ?? '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded p-3 border border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">Velocity Max (m/s)</p>
                    <p class="font-bold text-gray-900">{{ criteria?.velocityMax ?? '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded p-3 border border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">Static Head (m)</p>
                    <p class="font-bold text-gray-900">{{ criteria?.staticHead ?? '-' }}</p>
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
                      <th class="px-3 py-2 text-left text-xs font-semibold">#</th>
                      <th class="px-3 py-2 text-left text-xs font-semibold">Segment</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Length (m)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">FU</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Flow (GPM)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Flow (LPS)</th>
                      <th class="px-3 py-2 text-center text-xs font-semibold">Size (mm)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Velocity (m/s)</th>
                      <th class="px-3 py-2 text-center text-xs font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(pipe, idx) in criticalPathPipes"
                      :key="pipe.id"
                      :class="[
                        idx % 2 === 0 ? 'bg-white' : 'bg-red-50',
                        pipe.status === 'CRITICAL' ? 'bg-red-100' : '',
                        pipe.status === 'WARNING' ? 'bg-yellow-50' : ''
                      ]"
                    >
                      <td class="px-3 py-2 text-gray-500 text-xs border-b border-gray-100">{{ idx + 1 }}</td>
                      <td class="px-3 py-2 font-medium text-gray-800 border-b border-gray-100">{{ pipe.segmentName }}</td>
                      <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.length?.toFixed(1) || '-' }}</td>
                      <td class="px-3 py-2 text-right font-semibold text-gray-800 border-b border-gray-100">{{ pipe.totalFU ?? '-' }}</td>
                      <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.gpm?.toFixed(2) || '-' }}</td>
                      <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.lps?.toFixed(3) || '-' }}</td>
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
                      <td class="px-3 py-2 text-center border-b border-gray-100">
                        <span :class="getStatusBadgeClass(pipe.status)" class="text-xs font-medium px-2 py-0.5 rounded-full">
                          {{ getStatusLabel(pipe.status) }}
                        </span>
                      </td>
                    </tr>
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
                      <th class="px-3 py-2 text-left text-xs font-semibold">#</th>
                      <th class="px-3 py-2 text-left text-xs font-semibold">Segment</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Length (m)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">FU</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Flow (GPM)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Flow (LPS)</th>
                      <th class="px-3 py-2 text-center text-xs font-semibold">Size (mm)</th>
                      <th class="px-3 py-2 text-right text-xs font-semibold">Velocity (m/s)</th>
                      <th class="px-3 py-2 text-center text-xs font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(pipe, idx) in branchPipes"
                      :key="pipe.id"
                      :class="[
                        idx % 2 === 0 ? 'bg-white' : 'bg-blue-50',
                        pipe.status === 'CRITICAL' ? 'bg-red-100' : '',
                        pipe.status === 'WARNING' ? 'bg-yellow-50' : ''
                      ]"
                    >
                      <td class="px-3 py-2 text-gray-500 text-xs border-b border-gray-100">{{ idx + 1 }}</td>
                      <td class="px-3 py-2 font-medium text-gray-800 border-b border-gray-100">{{ pipe.segmentName }}</td>
                      <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.length?.toFixed(1) || '-' }}</td>
                      <td class="px-3 py-2 text-right font-semibold text-gray-800 border-b border-gray-100">{{ pipe.totalFU ?? '-' }}</td>
                      <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.gpm?.toFixed(2) || '-' }}</td>
                      <td class="px-3 py-2 text-right text-gray-700 border-b border-gray-100">{{ pipe.lps?.toFixed(3) || '-' }}</td>
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
                      <td class="px-3 py-2 text-center border-b border-gray-100">
                        <span :class="getStatusBadgeClass(pipe.status)" class="text-xs font-medium px-2 py-0.5 rounded-full">
                          {{ getStatusLabel(pipe.status) }}
                        </span>
                      </td>
                    </tr>
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
                  <span class="text-gray-600">Pipes ต้องการ Upsize:</span>
                  <span class="font-semibold" :class="pipesNeedingUpsize > 0 ? 'text-yellow-700' : 'text-green-700'">
                    {{ pipesNeedingUpsize }} เส้น
                  </span>
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
import { versionsApi, useApi } from '~/composables/useApi'
import { useWorkflowStore } from '~/stores/workflowStore'

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
const api    = useApi()
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
const hasData = computed(() => !!networkData.value && !!resultsData.value)

const reportDate = computed(() => new Date().toLocaleDateString('th-TH', {
  year: 'numeric', month: 'long', day: 'numeric'
}))

const calcStats = computed(() => resultsData.value?.pipeSizesSummary?.stats || null)

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

// Build enriched pipe list: join networkData.pipes + fixturesData.pipes, compute velocity
const enrichedPipes = computed(() => {
  if (!networkData.value?.pipes) return []

  const nodesMap = new Map<string, any>()
  ;(networkData.value.nodes || []).forEach((n: any) => nodesMap.set(String(n.id), n))

  const fixtureMap = new Map<string, any>()
  ;(fixturesData.value?.pipes || []).forEach((p: any) => fixtureMap.set(String(p.id), p))

  return networkData.value.pipes.map((pipe: any) => {
    const srcNode = nodesMap.get(String(pipe.sourceNodeId))
    const tgtNode = nodesMap.get(String(pipe.targetNodeId))
    const srcLabel = srcNode?.label || srcNode?.name || `Node${pipe.sourceNodeId}`
    const tgtLabel = tgtNode?.label || tgtNode?.name || `Node${pipe.targetNodeId}`
    const segmentName = `${srcLabel} → ${tgtLabel}`

    const fixPipe = fixtureMap.get(String(pipe.id))
    const totalFU = fixPipe?.totalFU ?? pipe.totalFU ?? null
    const gpm     = fixPipe?.hunterGPM ?? pipe.hunterGPM ?? null
    const lps     = gpm != null ? gpm * 0.0630902 : null

    let velocity: number | null = null
    let status: 'OK' | 'WARNING' | 'CRITICAL' = 'OK'
    if (lps != null && pipe.nominalDiameter) {
      const pipeSize = PIPE_SIZES.find(s => s.mm === pipe.nominalDiameter)
      if (pipeSize) {
        const m3s = lps / 1000
        const area = Math.PI * Math.pow(pipeSize.internalDiameterM / 2, 2)
        velocity = m3s / area
        if (velocity < 0.6 || velocity > 3.0) status = 'CRITICAL'
        else if (velocity < 1.2 || velocity > 2.4) status = 'WARNING'
        else status = 'OK'
      }
    }

    return {
      id: pipe.id,
      segmentName,
      length: pipe.length,
      nominalDiameter: pipe.nominalDiameter,
      isCriticalPath: pipe.isCriticalPath || false,
      totalFU,
      gpm,
      lps,
      velocity,
      status,
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
      api.get(`/projects/${pId}`),
      api.get(`/projects/${pId}/criteria`).catch(() => ({ data: null }))
    ])
    projectData.value = projectRes.data
    criteria.value    = criteriaRes.data

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
