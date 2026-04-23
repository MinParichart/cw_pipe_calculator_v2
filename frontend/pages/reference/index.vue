<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                ตารางอ้างอิงวิศวกรรม
              </h1>
              <p class="mt-1 text-sm text-gray-600">
                ข้อมูลอ้างอิงมาตรฐานสำหรับการคำนวณขนาดท่อน้ำดี
              </p>
            </div>
            <!-- <button
              @click="printPage"
              class="btn btn-secondary flex items-center gap-2"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              พิมพ์
            </button> -->
          </div>
        </div>

        <!-- Search Bar -->
        <!-- <div class="mb-6">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="ค้นหาข้อมูล... (เช่น ท่อ PVC, 50mm, WC, FU 3)"
            />
            <svg
              class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div> -->

        <!-- Tables Grid -->
        <div class="space-y-8">
          <!-- 1. Pipe Sizes Table (Table 2.6) -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <svg
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <div>
                  <h2 class="text-lg font-medium text-gray-900">
                    ตาราง 2.6 Water-pips sizes. Number of 15 mm. (1/2 mm.)
                    connections allowed.
                  </h2>
                  <p class="text-sm text-gray-500">
                    อ้างอิงจาก National Standard Plumbing Code
                  </p>
                </div>
              </div>
              <span class="badge badge-info">ขนาดเป็นมิลลิเมตร (mm)</span>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ขนาดท่อ
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      DN (mm)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      นิ้ว (in)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID (mm)*
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Average Demand
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      100% Demand
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="pipe in filteredPipeSizes"
                    :key="pipe.dn"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="font-medium text-gray-900"
                        >{{ pipe.dn }} mm</span
                      >
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ pipe.dn }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ pipe.inches }}"
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ pipe.id }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ pipe.averageDemand }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ pipe.fullDemand }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              * ID = Internal Diameter (เส้นผ่านศูนย์กลางภายใน) สำหรับท่อ PVC
              Schedule 40
            </p>
          </div>

          <!-- 2. Flush Valve Pipe Sizes Table (Table 2.7) -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <svg
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <div>
                  <h2 class="text-lg font-medium text-gray-900">
                    ตาราง 2.7 Water-pipe sizes : Flush Valves*
                  </h2>
                  <p class="text-sm text-gray-500">
                    อ้างอิงจาก National Standard Plumbing Code
                  </p>
                </div>
              </div>
              <span class="badge badge-warning">Flush Valve System</span>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ขนาดท่อ
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      DN (mm)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      นิ้ว (in)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Number of 25 mm. (1 in)<br />in flush valve allowed
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="pipe in filteredFlushValveSizes"
                    :key="pipe.dn"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="font-medium text-gray-900"
                        >{{ pipe.dn }} mm</span
                      >
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ pipe.dn }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ pipe.inches }}"
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="badge badge-primary">{{
                        pipe.allowedValves
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
            >
              <h4 class="text-sm font-semibold text-yellow-900 mb-2">
                คำอธิบาย:
              </h4>
              <ul class="text-xs text-yellow-800 space-y-1">
                <li>
                  • ตารางนี้ใช้สำหรับระบบ <strong>Flush Valve</strong>
                  (ระบบลูกสูบ) เท่านั้น
                </li>
                <li>
                  • แสดงจำนวน Flush Valve ขนาด 25mm (1")
                  สูงสุดที่อนุญาตให้ใช้กับแต่ละขนาดท่อ
                </li>
                <li>• สำหรับระบบ Flush Tank ให้ใช้ตาราง 2.6 แทน</li>
              </ul>
            </div>
          </div>

          <!-- 3. C-Factor Table -->
          <div class="card">
            <div class="flex items-center gap-2 mb-4">
              <svg
                class="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <div>
                <h2 class="text-lg font-medium text-gray-900">
                  ตาราง C-Factor (สัมประสิทธิ์ความหยาบ)
                </h2>
                <p class="text-sm text-gray-500">
                  ใช้ในสูตร Hazen-Williams สำหรับคำนวณความดันลด
                </p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ชนิดท่อ
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ค่า C เฉลี่ย
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ค่า C ที่นิยมใช้
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      คำอธิบาย
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="material in filteredCFactor"
                    :key="material.name"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="font-medium text-gray-900">{{
                        material.name
                      }}</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="badge badge-primary">{{
                        material.avgCFactor
                      }}</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="badge badge-success">{{
                        material.commonCFactor
                      }}</span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600">
                      {{ material.description }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 4. Fixture Units Table -->
          <div class="card">
            <div class="flex items-center gap-2 mb-4">
              <svg
                class="h-6 w-6 text-blue-600"
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
              <div>
                <h2 class="text-lg font-medium text-gray-900">
                  ตาราง Fixture Units (Private Use)
                </h2>
                <p class="text-sm text-gray-500">
                  ค่า FU สำหรับสุขภัณฑ์ในที่พักอาศัย
                </p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      สุขภัณฑ์
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      FU (Cold)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      FU (Total)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ขนาดท่อขั้นต่ำ (mm)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ขนาดท่อขั้นต่ำ (in)
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="fixture in filteredFixtureUnits"
                    :key="fixture.name"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="font-medium text-gray-900">{{
                        fixture.name
                      }}</span>
                      <div class="text-xs text-gray-500">
                        {{ fixture.nameEn }}
                      </div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span
                        v-if="fixture.fuCold !== null"
                        class="badge badge-info"
                      >
                        {{ fixture.fuCold }}
                      </span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="badge badge-primary">{{
                        fixture.fuTotal
                      }}</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ fixture.minSizeMm || "-" }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ fixture.minSizeIn || "-" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 5. Hunter's Curve Tables -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Flush Tank System -->
            <div class="card">
              <div class="flex items-center gap-2 mb-4">
                <svg
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
                <div>
                  <h2 class="text-lg font-medium text-gray-900">
                    Hunter's Curve - Flush Tank
                  </h2>
                  <p class="text-sm text-gray-500">ระบบถังน้ำ</p>
                </div>
              </div>

              <div class="overflow-x-auto max-h-96 overflow-y-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 sticky top-0">
                    <tr>
                      <th
                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        FU
                      </th>
                      <th
                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Demand (GPM)
                      </th>
                      <th
                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        FU
                      </th>
                      <th
                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Demand (GPM)
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="i in Math.ceil(filteredHunterTank.length / 2)"
                      :key="i"
                      class="hover:bg-gray-50"
                    >
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >
                        {{ filteredHunterTank[i - 1]?.fu }}
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600"
                      >
                        {{ filteredHunterTank[i - 1]?.gpm }}
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >
                        {{
                          filteredHunterTank[
                            i + Math.floor(filteredHunterTank.length / 2) - 1
                          ]?.fu
                        }}
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600"
                      >
                        {{
                          filteredHunterTank[
                            i + Math.floor(filteredHunterTank.length / 2) - 1
                          ]?.gpm
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Flush Valve System -->
            <div class="card">
              <div class="flex items-center gap-2 mb-4">
                <svg
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
                <div>
                  <h2 class="text-lg font-medium text-gray-900">
                    Hunter's Curve - Flush Valve
                  </h2>
                  <p class="text-sm text-gray-500">ระบบลูกสูบ</p>
                </div>
              </div>

              <div class="overflow-x-auto max-h-96 overflow-y-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 sticky top-0">
                    <tr>
                      <th
                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        FU
                      </th>
                      <th
                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Demand (GPM)
                      </th>
                      <th
                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        FU
                      </th>
                      <th
                        class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Demand (GPM)
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="i in Math.ceil(filteredHunterValve.length / 2)"
                      :key="i"
                      class="hover:bg-gray-50"
                    >
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >
                        {{ filteredHunterValve[i - 1]?.fu }}
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600"
                      >
                        {{ filteredHunterValve[i - 1]?.gpm }}
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >
                        {{
                          filteredHunterValve[
                            i + Math.floor(filteredHunterValve.length / 2) - 1
                          ]?.fu
                        }}
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600"
                      >
                        {{
                          filteredHunterValve[
                            i + Math.floor(filteredHunterValve.length / 2) - 1
                          ]?.gpm
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 6. Office, School, Apartment Water Factor Table -->
          <div class="card">
            <div class="flex items-center gap-2 mb-4">
              <svg
                class="h-6 w-6 text-blue-600"
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
              <div>
                <h2 class="text-lg font-medium text-gray-900">
                  Water Factor - Office Buildings, School และ Apartment
                </h2>
                <p class="text-sm text-gray-500">
                  ตารางค่า Water Factor สำหรับอาคารสำนักงาน โรงเรียน
                  และอาคารพักอาศัย
                </p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      FU (Fixture Units)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hunter, GPM
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Percent
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Adjusted, GPM
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Minimum, GPM
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="row in filteredOfficeSchoolApartmentWaterFactor"
                    :key="row.fuRange"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="font-medium text-gray-900">{{
                        row.fuRange
                      }}</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="text-gray-600">{{ row.hunterGpm }}</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="badge badge-info">{{ row.percent }}%</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="badge badge-success">{{
                        row.adjustedGpm
                      }}</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="badge badge-warning">{{
                        row.minimumGpm
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 class="text-sm font-semibold text-blue-900 mb-2">
                คำอธิบาย:
              </h4>
              <ul class="text-xs text-blue-800 space-y-1">
                <li>
                  • <strong>Hunter, GPM:</strong> ค่า Hunter's Curve ดั้งเดิม
                  (Gallons Per Minute)
                </li>
                <li>
                  •
                  <strong>Percent:</strong> เปอร์เซ็นต์การใช้งานจริงเทียบกับค่า
                  Hunter
                </li>
                <li>
                  • <strong>Adjusted, GPM:</strong> ค่าที่ปรับแล้ว (แนะนำใช้) ✓
                </li>
                <li>
                  •
                  <strong>Minimum, GPM:</strong>
                  ค่าขั้นต่ำที่ต้องใช้เพื่อความปลอดภัย
                </li>
              </ul>
            </div>
          </div>

          <!-- 7. Pipe Specs Catalog -->
          <PipeSpecsCatalog @select="onPipeSelect" />

          <!-- 8. Fixture Flow Rates & Pressures -->
          <div class="card">
            <div class="flex items-center gap-2 mb-4">
              <svg
                class="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div>
                <h2 class="text-lg font-medium text-gray-900">
                  อัตราการไหลและความดันสำหรับเครื่องสุขภัณฑ์
                </h2>
                <p class="text-sm text-gray-500">
                  Flow Rates & Pressures for Plumbing Fixtures
                </p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      สุขภัณฑ์
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ความดัน (bar)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ความดัน (psi)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      อัตราการไหล (lps)
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      อัตราการไหล (gpm)
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="fixture in filteredFixtureFlowRates"
                    :key="fixture.name"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="flex flex-col">
                        <span class="font-medium text-gray-900">{{
                          fixture.nameTh
                        }}</span>
                        <span class="text-xs text-gray-500">{{
                          fixture.name
                        }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="badge badge-info">{{
                        fixture.pressureBar
                      }}</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ fixture.pressurePsi }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="badge badge-success">{{
                        fixture.flowLps
                      }}</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ fixture.flowGpm }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <h4 class="text-sm font-semibold text-green-900 mb-2">
                คำอธิบาย:
              </h4>
              <ul class="text-xs text-green-800 space-y-1">
                <li>
                  •
                  <strong>ความดัน:</strong>
                  ความดันน้ำขั้นต่ำที่ต้องการเพื่อให้สุขภัณฑ์ทำงานได้ปกติ
                </li>
                <li>
                  •
                  <strong>อัตราการไหล:</strong>
                  อัตราการไหลของน้ำเมื่อเปิดสุขภัณฑ์เต็มที่
                </li>
                <li>
                  • <strong>lps:</strong> Liter Per Second (ลิตรต่อวินาที)
                </li>
                <li>
                  • <strong>gpm:</strong> Gallons Per Minute (แกลลอนต่อนาที)
                </li>
              </ul>
            </div>
          </div>

          <!-- Formula Reference -->
          <div class="card bg-blue-600 bg-opacity-5 border-primary">
            <div class="flex items-center gap-2 mb-4">
              <svg
                class="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h2 class="text-lg font-medium text-gray-900">
                สูตรที่ใช้ในระบบ
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Hazen-Williams Formula -->
              <div class="p-4 bg-white rounded-lg">
                <h3 class="font-semibold text-gray-900 mb-2">
                  Hazen-Williams Formula
                </h3>
                <div
                  class="bg-gray-900 text-blue-600 p-3 rounded font-mono text-sm mb-2"
                >
                  hf = (10.583 / D^4.87) × L × (Q / C)^1.85
                </div>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li>• hf = ความดันลด (เมตรน้ำ)</li>
                  <li>• D = เส้นผ่านศูนย์กลางท่อ (เมตร)</li>
                  <li>• L = ความยาวท่อ (เมตร)</li>
                  <li>• Q = อัตราการไหล (m³/s)</li>
                  <li>• C = สัมประสิทธิ์ความหยาบ</li>
                </ul>
              </div>

              <!-- Unit Conversions -->
              <div class="p-4 bg-white rounded-lg">
                <h3 class="font-semibold text-gray-900 mb-2">การแปลงหน่วย</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between p-2 bg-gray-50 rounded">
                    <span class="text-gray-600">อัตราการไหล:</span>
                    <span class="font-mono text-gray-900"
                      >1 GPM = 0.06309 LPS</span
                    >
                  </div>
                  <div class="flex justify-between p-2 bg-gray-50 rounded">
                    <span class="text-gray-600">ความดัน:</span>
                    <span class="font-mono text-gray-900"
                      >1 bar = 10.197 m.wg</span
                    >
                  </div>
                  <div class="flex justify-between p-2 bg-gray-50 rounded">
                    <span class="text-gray-600">ความดัน:</span>
                    <span class="font-mono text-gray-900"
                      >1 PSI = 0.06895 bar</span
                    >
                  </div>
                  <div class="flex justify-between p-2 bg-gray-50 rounded">
                    <span class="text-gray-600">ขนาดท่อ:</span>
                    <span class="font-mono text-gray-900">1" = 25.4 mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PipeSpecsCatalog from "~/components/reference/PipeSpecsCatalog.vue";
// 🔥 เพิ่มบรรทัดนี้: Import ตารางจากไฟล์คำนวณกลางของเรา
import {
  HUNTER_CURVE_FLUSH_TANK,
  HUNTER_CURVE_FLUSH_VALVE
} from "~/shared/constants/hunterCurve";

const toast = useToast();

// Search state
const searchQuery = ref("");

// Pipe Sizes Data (Table 2.6)
const pipeSizes = [
  { dn: 15, inches: "1/2", id: 15.8, averageDemand: 1, fullDemand: 1 },
  { dn: 20, inches: "3/4", id: 20.9, averageDemand: 4, fullDemand: 3 },
  { dn: 25, inches: "1", id: 26.6, averageDemand: 10, fullDemand: 6 },
  { dn: 32, inches: "1¼", id: 35.0, averageDemand: 20, fullDemand: 12 },
  { dn: 40, inches: "1½", id: 40.9, averageDemand: 30, fullDemand: 20 },
  { dn: 50, inches: "2", id: 52.5, averageDemand: 50, fullDemand: 35 },
  { dn: 65, inches: "2½", id: 62.7, averageDemand: 90, fullDemand: 60 },
  { dn: 80, inches: "3", id: 77.9, averageDemand: 125, fullDemand: 85 },
  { dn: 100, inches: "4", id: 102.3, averageDemand: 225, fullDemand: 150 }
];

// Flush Valve Pipe Sizes Data (Table 2.7)
const flushValveSizes = [
  { dn: 30, inches: "1¼", allowedValves: "1" },
  { dn: 40, inches: "1½", allowedValves: "2-4" },
  { dn: 50, inches: "2", allowedValves: "5-12" },
  { dn: 65, inches: "2½", allowedValves: "13-25" },
  { dn: 80, inches: "3", allowedValves: "26-40" },
  { dn: 100, inches: "4", allowedValves: "41-100" }
];

// C-Factor Data
const cFactor = [
  {
    name: "PVC",
    avgCFactor: 155,
    commonCFactor: 150,
    description: "ท่อพลาสติก PVC ทั่วไป"
  },
  {
    name: "Copper, Brass, Lead, Glass",
    avgCFactor: 140,
    commonCFactor: 130,
    description: "ท่อทองแดง, ทองเหลือง, ตะกั่ว, กระจก"
  },
  {
    name: "Cement Lined Iron/Steel",
    avgCFactor: 148,
    commonCFactor: 140,
    description: "ท่อเหล็ก/เหล็กกล้าเคลือบซีเมนต์"
  },
  {
    name: "Steel (ใหม่)",
    avgCFactor: 130,
    commonCFactor: 100,
    description: "ท่อเหล็กใหม่"
  },
  {
    name: "Cast Iron (ใหม่)",
    avgCFactor: 130,
    commonCFactor: 100,
    description: "ท่อเหล็กหล่อใหม่"
  },
  {
    name: "Concrete",
    avgCFactor: 120,
    commonCFactor: 100,
    description: "ท่อคอนกรีต"
  }
];

// Fixture Units Data
const fixtureUnits = [
  {
    name: "WC (Flush tank)",
    nameEn: "Water Closet - Flush Tank",
    fuCold: 3,
    fuTotal: 3,
    minSizeMm: 15,
    minSizeIn: "1/2"
  },
  {
    name: "WC (Flush valve)",
    nameEn: "Water Closet - Flush Valve",
    fuCold: 6,
    fuTotal: 6,
    minSizeMm: 25,
    minSizeIn: "1"
  },
  {
    name: "Lavatory",
    nameEn: "อ่างล้างหน้า",
    fuCold: 1,
    fuTotal: 1,
    minSizeMm: 15,
    minSizeIn: "1/2"
  },
  {
    name: "Bathtub",
    nameEn: "อ่างอาบน้ำ",
    fuCold: 2,
    fuTotal: 2,
    minSizeMm: 15,
    minSizeIn: "1/2"
  },
  {
    name: "Shower",
    nameEn: "ฝักบัว",
    fuCold: 2,
    fuTotal: 2,
    minSizeMm: 15,
    minSizeIn: "1/2"
  },
  {
    name: "Kitchen sink",
    nameEn: "อ่างล้างจาน",
    fuCold: 2,
    fuTotal: 2,
    minSizeMm: 15,
    minSizeIn: "1/2"
  },
  {
    name: "Laundry trays (1-3)",
    nameEn: "อ่างล้างผ้า 1-3 ช่อง",
    fuCold: 2,
    fuTotal: 3,
    minSizeMm: null,
    minSizeIn: null
  },
  {
    name: "Dishwasher",
    nameEn: "เครื่องล้างจาน",
    fuCold: null,
    fuTotal: 1,
    minSizeMm: 15,
    minSizeIn: "1/2"
  },
  {
    name: "Laundry 3.5kg",
    nameEn: "เครื่องซักผ้า 3.5kg",
    fuCold: 2,
    fuTotal: 2,
    minSizeMm: null,
    minSizeIn: null
  },
  {
    name: "Laundry 7kg",
    nameEn: "เครื่องซักผ้า 7kg",
    fuCold: 3,
    fuTotal: 4,
    minSizeMm: null,
    minSizeIn: null
  },
  {
    name: "Hose Bibb",
    nameEn: "ก๊อกน้ำกลางแจ้ง",
    fuCold: null,
    fuTotal: null,
    minSizeMm: 15,
    minSizeIn: "1/2"
  }
];

// // Hunter's Curve - Flush Tank System
// const hunterTank = [
//   { fu: 6, demand: 5.0 },
//   { fu: 8, demand: 6.5 },
//   { fu: 10, demand: 8.0 },
//   { fu: 12, demand: 9.2 },
//   { fu: 14, demand: 10.4 },
//   { fu: 16, demand: 11.6 },
//   { fu: 18, demand: 12.8 },
//   { fu: 20, demand: 14.0 },
//   { fu: 25, demand: 17.0 },
//   { fu: 30, demand: 20.0 },
//   { fu: 35, demand: 22.5 },
//   { fu: 40, demand: 24.8 },
//   { fu: 45, demand: 27.0 },
//   { fu: 50, demand: 29.0 },
//   { fu: 60, demand: 32.0 },
//   { fu: 70, demand: 35.0 },
//   { fu: 80, demand: 38.0 },
//   { fu: 90, demand: 41.0 },
//   { fu: 100, demand: 43.5 },
//   { fu: 120, demand: 48.0 },
//   { fu: 140, demand: 52.5 },
//   { fu: 160, demand: 57.0 },
//   { fu: 180, demand: 61.0 },
//   { fu: 200, demand: 65.0 },
//   { fu: 250, demand: 75.0 },
//   { fu: 300, demand: 85.0 },
//   { fu: 400, demand: 105.0 },
//   { fu: 500, demand: 125.0 }
// ];

// // Hunter's Curve - Flush Valve System
// const hunterValve = [
//   { fu: 10, demand: 27.0 },
//   { fu: 12, demand: 28.6 },
//   { fu: 14, demand: 30.2 },
//   { fu: 16, demand: 31.8 },
//   { fu: 18, demand: 33.4 },
//   { fu: 20, demand: 35.0 },
//   { fu: 25, demand: 38.0 },
//   { fu: 30, demand: 41.0 },
//   { fu: 35, demand: 43.5 },
//   { fu: 40, demand: 46.5 },
//   { fu: 45, demand: 49.0 },
//   { fu: 50, demand: 51.5 },
//   { fu: 60, demand: 55.0 },
//   { fu: 100, demand: 67.5 },
//   { fu: 120, demand: 72.5 },
//   { fu: 140, demand: 77.5 },
//   { fu: 160, demand: 82.5 },
//   { fu: 180, demand: 87.0 },
//   { fu: 200, demand: 91.5 },
//   { fu: 250, demand: 101.0 },
//   { fu: 300, demand: 110.0 },
//   { fu: 400, demand: 126.0 },
//   { fu: 500, demand: 142.0 },
//   { fu: 750, demand: 178.0 },
//   { fu: 1000, demand: 208.0 }
// ];

// Office, School, Apartment Water Factor Table
const officeSchoolApartmentWaterFactor = [
  {
    fuRange: "Up to 400",
    fuMin: 0,
    fuMax: 400,
    hunterGpm: 125,
    percent: 100,
    adjustedGpm: 125,
    minimumGpm: 125
  },
  {
    fuRange: "401-600",
    fuMin: 401,
    fuMax: 600,
    hunterGpm: 155,
    percent: 87,
    adjustedGpm: 135,
    minimumGpm: 130
  },
  {
    fuRange: "601-900",
    fuMin: 601,
    fuMax: 900,
    hunterGpm: 195,
    percent: 75,
    adjustedGpm: 145,
    minimumGpm: 140
  },
  {
    fuRange: "901-1200",
    fuMin: 901,
    fuMax: 1200,
    hunterGpm: 235,
    percent: 64,
    adjustedGpm: 150,
    minimumGpm: 150
  },
  {
    fuRange: "1201-1500",
    fuMin: 1201,
    fuMax: 1500,
    hunterGpm: 270,
    percent: 63,
    adjustedGpm: 170,
    minimumGpm: 155
  },
  {
    fuRange: "1501-2000",
    fuMin: 1501,
    fuMax: 2000,
    hunterGpm: 330,
    percent: 61,
    adjustedGpm: 200,
    minimumGpm: 175
  },
  {
    fuRange: "2001-2500",
    fuMin: 2001,
    fuMax: 2500,
    hunterGpm: 385,
    percent: 60,
    adjustedGpm: 230,
    minimumGpm: 205
  },
  {
    fuRange: "2501-3000",
    fuMin: 2501,
    fuMax: 3000,
    hunterGpm: 435,
    percent: 59,
    adjustedGpm: 255,
    minimumGpm: 235
  },
  {
    fuRange: "3001-4000",
    fuMin: 3001,
    fuMax: 4000,
    hunterGpm: 550,
    percent: 58,
    adjustedGpm: 320,
    minimumGpm: 260
  },
  {
    fuRange: "4001-5000",
    fuMin: 4001,
    fuMax: 5000,
    hunterGpm: 675,
    percent: 56,
    adjustedGpm: 380,
    minimumGpm: 325
  },
  {
    fuRange: "5001-6000",
    fuMin: 5001,
    fuMax: 6000,
    hunterGpm: 775,
    percent: 56,
    adjustedGpm: 435,
    minimumGpm: 385
  },
  {
    fuRange: "6001-7000",
    fuMin: 6001,
    fuMax: 7000,
    hunterGpm: 875,
    percent: 56,
    adjustedGpm: 490,
    minimumGpm: 440
  },
  {
    fuRange: "7001-8000",
    fuMin: 7001,
    fuMax: 8000,
    hunterGpm: 975,
    percent: 55,
    adjustedGpm: 540,
    minimumGpm: 495
  }
];

// Fixture Flow Rates & Pressures Table
import { fixtureFlowRates } from "~/utils/fixtureData";

// Computed filtered data
const filteredPipeSizes = computed(() => {
  if (!searchQuery.value) return pipeSizes;
  const query = searchQuery.value.toLowerCase();
  return pipeSizes.filter(
    (pipe) =>
      pipe.dn.toString().includes(query) ||
      pipe.inches.includes(query) ||
      pipe.id.toString().includes(query)
  );
});

const filteredFlushValveSizes = computed(() => {
  if (!searchQuery.value) return flushValveSizes;
  const query = searchQuery.value.toLowerCase();
  return flushValveSizes.filter(
    (pipe) =>
      pipe.dn.toString().includes(query) ||
      pipe.inches.toLowerCase().includes(query) ||
      pipe.allowedValves.toLowerCase().includes(query)
  );
});

const filteredCFactor = computed(() => {
  if (!searchQuery.value) return cFactor;
  const query = searchQuery.value.toLowerCase();
  return cFactor.filter(
    (material) =>
      material.name.toLowerCase().includes(query) ||
      material.description.toLowerCase().includes(query)
  );
});

const filteredFixtureUnits = computed(() => {
  if (!searchQuery.value) return fixtureUnits;
  const query = searchQuery.value.toLowerCase();
  return fixtureUnits.filter(
    (fixture) =>
      fixture.name.toLowerCase().includes(query) ||
      fixture.nameEn.toLowerCase().includes(query) ||
      fixture.fuTotal.toString().includes(query)
  );
});

// ✅ แก้ไขให้ไปดึงข้อมูลจาก HUNTER_CURVE_FLUSH_TANK และเปลี่ยน .demand เป็น .gpm
const filteredHunterTank = computed(() => {
  if (!searchQuery.value) return HUNTER_CURVE_FLUSH_TANK;
  const query = searchQuery.value.toLowerCase();
  return HUNTER_CURVE_FLUSH_TANK.filter(
    (row) =>
      row.fu.toString().includes(query) || row.gpm.toString().includes(query)
  );
});

// ✅ แก้ไขให้ไปดึงข้อมูลจาก HUNTER_CURVE_FLUSH_VALVE และเปลี่ยน .demand เป็น .gpm
const filteredHunterValve = computed(() => {
  if (!searchQuery.value) return HUNTER_CURVE_FLUSH_VALVE;
  const query = searchQuery.value.toLowerCase();
  return HUNTER_CURVE_FLUSH_VALVE.filter(
    (row) =>
      row.fu.toString().includes(query) || row.gpm.toString().includes(query)
  );
});

const filteredOfficeSchoolApartmentWaterFactor = computed(() => {
  if (!searchQuery.value) return officeSchoolApartmentWaterFactor;
  const query = searchQuery.value.toLowerCase();
  return officeSchoolApartmentWaterFactor.filter(
    (row) =>
      row.fuRange.toLowerCase().includes(query) ||
      row.hunterGpm.toString().includes(query) ||
      row.adjustedGpm.toString().includes(query) ||
      row.minimumGpm.toString().includes(query)
  );
});

const filteredFixtureFlowRates = computed(() => {
  if (!searchQuery.value) return fixtureFlowRates;
  const query = searchQuery.value.toLowerCase();
  return fixtureFlowRates.filter(
    (fixture) =>
      fixture.name.toLowerCase().includes(query) ||
      fixture.nameTh.toLowerCase().includes(query) ||
      fixture.pressureBar.toString().includes(query) ||
      fixture.flowLps.toString().includes(query) ||
      fixture.flowGpm.toString().includes(query)
  );
});

// Methods
// const printPage = () => {
//   window.print();
// };

const onPipeSelect = (pipe: any) => {
  toast.success(
    `เลือกท่อ ${pipe.material} ${pipe.size}mm (ID: ${pipe.internalDiameter}mm, C: ${pipe.cFactor})`
  );
  // Can be extended to store selection or pass to calculator
};

// Define page meta for layout
definePageMeta({
  layout: "dashboard"
});
</script>

<style scoped>
@media print {
  .no-print {
    display: none;
  }
  .card {
    break-inside: avoid;
  }
  table {
    break-inside: auto;
  }
  tr {
    break-inside: avoid;
  }
  th,
  td {
    break-inside: avoid;
  }
}
</style>
