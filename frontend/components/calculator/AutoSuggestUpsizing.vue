<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-medium text-gray-900">Auto-Suggest Upsizing</h3>
        <p class="text-sm text-gray-600 mt-1">
          วิเคราะห์และแนะนำขนาดท่อที่เหมาะสม - Water Factor + Auto Selection
        </p>
      </div>
    </div>

    <!-- Summary Stats -->
    <div v-if="summary" class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
      <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div class="text-2xl font-bold text-blue-600">{{ summary.total }}</div>
        <div class="text-xs text-blue-700">ท่อทั้งหมด</div>
      </div>
      <div class="bg-green-50 rounded-lg p-3 border border-green-200">
        <div class="text-2xl font-bold text-green-600">{{ summary.ok }}</div>
        <div class="text-xs text-green-700">ปกติดี</div>
      </div>
      <div class="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
        <div class="text-2xl font-bold text-yellow-600">
          {{ summary.warning }}
        </div>
        <div class="text-xs text-yellow-700">ต้องตรวจสอบ</div>
      </div>
      <div class="bg-red-50 rounded-lg p-3 border border-red-200">
        <div class="text-2xl font-bold text-red-600">
          {{ summary.critical }}
        </div>
        <div class="text-xs text-red-700">ต้องปรับปรุง</div>
      </div>
    </div>

    <!-- Pressure Summary
    <div
      v-if="summary && summary.total > 0"
      class="card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 mb-4"
    >
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
          <h3 class="text-lg font-bold text-gray-900">
            แรงดันต้นทางที่ต้องการ
          </h3>
          <p class="text-sm text-gray-600">
            Required Source Pressure Calculation
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        Left Column: Losses
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700"
                >ความดันลดท่อ (Major Loss)</span
              >
              <span class="text-sm font-bold text-blue-600"
                >{{ totalMajorLoss.toFixed(2) }} m</span
              >
            </div>
            <div class="text-xs text-gray-500">
              รวมทุกท่อใน Critical Path →
              {{ mwgToBar(totalMajorLoss).toFixed(2) }} bar
            </div>
          </div>

          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700"
                >ความดันลดข้อต่อ (Minor Loss)</span
              >
              <span class="text-sm font-bold text-orange-600"
                >{{ totalMinorLoss.toFixed(2) }} m</span
              >
            </div>
            <div class="text-xs text-gray-500">
              30% ของ Major Loss → {{ mwgToBar(totalMinorLoss).toFixed(2) }} bar
            </div>
          </div>

          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700"
                >ท่อดิ่งสูง (Static Head)</span
              >
              <div class="flex items-center gap-2">
                <input
                  v-model.number="staticHeadM"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  class="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="0"
                />
                <span class="text-sm font-bold text-green-600"
                  >{{ (staticHeadM || 0).toFixed(1) }} m</span
                >
              </div>
            </div>
            <div class="text-xs text-gray-500">
              → {{ mwgToBar(staticHeadM || 0).toFixed(2) }} bar
            </div>
          </div>
        </div>

        Right Column: Totals
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700"
                >ความดันรวม ณ มาตรวัด</span
              >
              <span class="text-sm font-bold text-purple-600"
                >{{ totalPressureLossMWG.toFixed(2) }} m</span
              >
            </div>
            <div class="text-xs text-gray-500">
              Major + Minor + Static → {{ totalPressureLossBar.toFixed(2) }} bar
            </div>
          </div>

          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                สุขภัณฑ์ปลายทาย
              </label>
              <select
                v-model="selectedFixture"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option
                  v-for="fixture in fixtureFlowRates"
                  :key="fixture.name"
                  :value="fixture"
                >
                  {{ fixture.nameTh }} ({{ fixture.pressureBar }} bar)
                </option>
              </select>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >ความดันที่ต้องการ</span
              >
              <span class="text-sm font-bold text-red-600"
                >{{ selectedFixture?.pressureBar.toFixed(2) }} bar</span
              >
            </div>
          </div>

          <div
            class="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-4 border-2 border-blue-700"
          >
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm font-medium text-blue-100">
                  แรงดันต้นทางที่ต้องมี
                </div>
                <div class="text-xs text-blue-200">
                  Required Source Pressure
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-white">
                  {{ sourcePressureBar.toFixed(2) }} bar
                </div>
                <div class="text-xs text-blue-200">
                  {{ sourcePressureMWG.toFixed(2) }} m
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    Debug Info
    <div v-if="true" class="mb-4 p-4 bg-gray-100 rounded text-xs">
      <div><strong>Debug Info:</strong></div>
      <div>Suggestions length: {{ suggestions?.length || 0 }}</div>
      <div>Critical Path Pipes: {{ criticalPathPipes.length }}</div>
      <div>Branch Pipes: {{ branchPipes.length }}</div>
      <div>Analyzing: {{ analyzing }}</div>
      <div>Network ID: {{ networkId }}</div>
    </div>

    <!-- Pipe Cards Grouped -->
    <div v-if="suggestions && suggestions.length > 0" class="space-y-6">
      <!-- Critical Path Section -->
      <div v-if="criticalPathPipes.length > 0">
        <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
          <svg
            class="h-5 w-5 mr-2 text-red-500"
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
          Critical Path ({{ criticalPathPipes.length }} ท่อ)
          <span class="text-xs font-normal text-gray-500 ml-2"
            >เรียงจากปลายทาง → ต้นทาง</span
          >
        </h3>
        <div class="space-y-3 mb-6">
          <div
            v-for="suggestion in criticalPathPipes"
            :key="suggestion.pipeId"
            class="rounded-lg border-2 p-4 transition-all"
            :class="getStatusBorderClass(suggestion.status)"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div
                  class="h-8 w-8 rounded-full flex items-center justify-center mr-2"
                  :class="getStatusBgClass(suggestion.status)"
                >
                  <svg
                    class="h-4 w-4"
                    :class="getStatusIconClass(suggestion.status)"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      v-if="suggestion.status === 'OK'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-gray-900">
                    {{ suggestion.segmentName }}
                  </h4>
                  <div class="flex items-center gap-2 mt-1">
                    <span
                      class="text-xs px-2 py-0.5 rounded-full"
                      :class="getStatusBadgeClass(suggestion.status)"
                    >
                      {{ getStatusText(suggestion.status) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.currentSize.mm }}mm
                </div>
                <div class="text-xs text-gray-500">
                  ({{ suggestion.currentSize.inches }})
                </div>
              </div>
            </div>

            <!-- Water Factor Info -->
            <div
              class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3 bg-blue-50 rounded-lg"
            >
              <div>
                <div class="text-xs text-gray-500">Fixture Unit (FU)</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.fixtureUnits }} FU
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Flow Rate (Hunter + HB)</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.baseHunterGPM?.toFixed(2) || "0.00" }} GPM
                  <template v-if="suggestion.hoseBibbGPM > 0">
                    <span class="text-blue-600"
                      >+ {{ suggestion.hoseBibbGPM?.toFixed(2) || "0.00" }} GPM
                      (HB)</span
                    >
                  </template>
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">
                  Water Factor ({{ suggestion.waterFactorPercent }}%)
                </div>
                <div class="text-sm font-bold text-blue-600">
                  ({{ suggestion.baseHunterGPM?.toFixed(2) || "0.00" }} ×
                  {{ suggestion.waterFactorPercent }}%)
                  <template v-if="suggestion.hoseBibbGPM > 0">
                    + {{ suggestion.hoseBibbGPM?.toFixed(2) || "0.00" }}
                  </template>
                  <br />
                  <span class="text-gray-600 font-normal">→</span>
                  {{ suggestion.adjustedGPM?.toFixed(2) || "0.00" }} GPM
                </div>
              </div>
            </div>

            <!-- Total Flow Rate -->
            <div class="grid grid-cols-3 gap-3 mb-4 p-3 bg-green-50 rounded-lg">
              <div>
                <div class="text-xs text-gray-500">Total GPM</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.flowRate.gpm.toFixed(2) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Total LPS</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.flowRate.lps.toFixed(2) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Total m³/s</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.flowRate.m3s.toFixed(5) }}
                </div>
              </div>
            </div>

            <!-- Pipe Info -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div>
                <div class="text-xs text-gray-500">Nominal Diameter (mm)</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.currentSize.mm }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">
                  Nominal Diameter (inches)
                </div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.currentSize.inches }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Internal Diameter (m)</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.currentSize.internalDiameter.toFixed(4) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">ความยาวท่อ</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.pipeLength.toFixed(1) }} m
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">C-Factor</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.cFactor }}
                </div>
              </div>
            </div>

            <!-- Size Simulation Dropdown -->
            <div class="mb-4">
              <button
                @click="toggleSimulation(suggestion.pipeId)"
                class="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                {{
                  expandedSimulationPipeId === suggestion.pipeId
                    ? "ซ่อน"
                    : "ลองขนาดท่ออื่น"
                }}
              </button>

              <!-- Simulation Results -->
              <div
                v-if="expandedSimulationPipeId === suggestion.pipeId"
                class="mt-2 border border-blue-200 rounded-lg overflow-hidden"
              >
                <div
                  class="bg-blue-50 px-3 py-2 text-xs font-medium text-blue-900"
                >
                  เปรียบเทียบขนาดท่อ (คำนวณด้วยสูตร Worst-Case)
                </div>
                <div
                  class="px-3 py-2 bg-gray-50 text-xs text-gray-600 border-b border-gray-200"
                >
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="font-medium">สถานะ:</span>
                    <span class="flex items-center gap-1"
                      >✅
                      <span class="text-green-600">ดี (1.2-2.4 m/s)</span></span
                    >
                    <span class="flex items-center gap-1"
                      >⚠️
                      <span class="text-yellow-600"
                        >ต่ำ/สูงกว่าเกณฑ์</span
                      ></span
                    >
                    <span class="flex items-center gap-1"
                      >❌
                      <span class="text-red-600"
                        >วิกฤต (< 0.6 หรือ > 3.0 m/s)</span
                      ></span
                    >
                  </div>
                </div>
                <div class="divide-y divide-gray-200">
                  <div
                    v-for="(sim, idx) in simulatedResults.get(
                      suggestion.pipeId
                    ) || []"
                    :key="idx"
                    class="px-3 py-2 hover:bg-gray-50 transition-colors"
                    :class="{ 'bg-blue-50': sim.isCurrent }"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-sm font-bold text-gray-900">
                            {{ sim.mm }}mm ({{ sim.inches }})
                          </span>
                          <span
                            v-if="sim.isCurrent"
                            class="text-xs bg-blue-600 text-white px-2 py-0.5 rounded"
                          >
                            ปัจจุบัน
                          </span>
                          <span
                            class="text-xs"
                            :class="getSimulationStatusColor(sim.status)"
                          >
                            {{ getSimulationStatusIcon(sim.status) }}
                          </span>
                        </div>
                        <div
                          class="grid grid-cols-2 gap-2 text-xs text-gray-600"
                        >
                          <div>
                            Velocity:
                            <span
                              class="font-medium"
                              :class="getSimulationStatusColor(sim.status)"
                              >{{ sim.velocity.toFixed(2) }} m/s</span
                            >
                          </div>
                          <div>
                            Friction:
                            <span class="font-medium"
                              >{{ sim.frictionLoss.toFixed(2) }} m/100m</span
                            >
                          </div>
                          <div class="col-span-2 text-gray-500">
                            ID: {{ (sim.internalDiameter * 1000).toFixed(2) }}mm
                          </div>
                        </div>
                      </div>
                      <button
                        v-if="!sim.isCurrent"
                        @click="selectSimulatedSize(suggestion.pipeId, sim)"
                        class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors flex-shrink-0"
                      >
                        ใช้ขนาดนี้
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Calculation Results -->
            <div
              class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div class="text-xs text-gray-500">ความเร็วน้ำ (v)</div>
                <div
                  class="text-sm font-bold"
                  :class="getVelocityColor(suggestion.velocity)"
                >
                  {{ suggestion.velocity.toFixed(2) }} m/s
                </div>
                <div class="text-xs text-gray-400">ควร 1.2-2.4</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Friction Loss Rate</div>
                <div
                  class="text-sm font-bold"
                  :class="getFrictionLossColor(suggestion.frictionLoss)"
                >
                  {{ suggestion.frictionLoss.toFixed(2) }} m/100m
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Major Loss</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.majorLoss.toFixed(3) }} m.wg
                </div>
              </div>
            </div>

            <!-- Warnings -->
            <div
              v-if="suggestion.warnings && suggestion.warnings.length > 0"
              class="mb-4"
            >
              <div
                v-for="(warning, idx) in suggestion.warnings"
                :key="idx"
                class="text-xs text-red-600 flex items-start mb-1"
              >
                <svg
                  class="h-3 w-3 mr-1 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {{ warning }}
              </div>
            </div>

            <!-- Suggestion -->
            <div
              v-if="suggestion.suggestedSize"
              class="rounded-lg p-3 mb-4"
              :class="getStatusBgClass(suggestion.status)"
            >
              <div class="flex items-start">
                <svg
                  class="h-4 w-4 mr-2 flex-shrink-0 mt-0.5"
                  :class="getStatusIconClass(suggestion.status)"
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
                <div class="flex-1">
                  <div
                    class="text-sm font-bold"
                    :class="getStatusTextClass(suggestion.status)"
                  >
                    แนะนำ: เพิ่มขนาดเป็น {{ suggestion.suggestedSize.mm }}mm ({{
                      suggestion.suggestedSize.inches
                    }})
                  </div>
                  <div class="text-xs mt-1 text-gray-700">
                    → Velocity ใหม่:
                    {{ suggestion.suggestedVelocity!.toFixed(2) }} m/s ✓
                  </div>
                  <div class="text-xs text-gray-700">
                    → Friction Loss ใหม่:
                    {{ suggestion.suggestedFrictionLoss!.toFixed(2) }} m/100m
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div
              v-if="
                suggestion.suggestedSize && suggestion.status === 'CRITICAL'
              "
              class="flex justify-end gap-2"
            >
              <button
                @click="applySingleSuggestion(suggestion)"
                :disabled="applying === suggestion.pipeId"
                class="btn btn-primary text-xs"
              >
                <svg
                  v-if="applying !== suggestion.pipeId"
                  class="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <svg
                  v-else
                  class="animate-spin h-3 w-3 mr-1"
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
                {{
                  applying === suggestion.pipeId
                    ? "กำลังบันทึก..."
                    : `ใช้ ${suggestion.suggestedSize.mm}mm`
                }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Branch Pipes Section -->
      <div v-if="branchPipes.length > 0">
        <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
          <svg
            class="h-5 w-5 mr-2 text-blue-500"
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
          Branch Pipes - เส้นท่อสาขา ({{ branchPipes.length }} ท่อ)
          <span class="text-xs font-normal text-gray-500 ml-2"
            >เรียงจากปลายทาง → ต้นทาง</span
          >
        </h3>
        <div class="space-y-3">
          <div
            v-for="suggestion in branchPipes"
            :key="suggestion.pipeId"
            class="rounded-lg border-2 p-4 transition-all"
            :class="getStatusBorderClass(suggestion.status)"
          >
            <!-- Same content as critical path above -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div
                  class="h-8 w-8 rounded-full flex items-center justify-center mr-2"
                  :class="getStatusBgClass(suggestion.status)"
                >
                  <svg
                    class="h-4 w-4"
                    :class="getStatusIconClass(suggestion.status)"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      v-if="suggestion.status === 'OK'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-gray-900">
                    {{ suggestion.segmentName }}
                  </h4>
                  <div class="flex items-center gap-2 mt-1">
                    <span
                      class="text-xs px-2 py-0.5 rounded-full"
                      :class="getStatusBadgeClass(suggestion.status)"
                    >
                      {{ getStatusText(suggestion.status) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.currentSize.mm }}mm
                </div>
                <div class="text-xs text-gray-500">
                  ({{ suggestion.currentSize.inches }})
                </div>
              </div>
            </div>

            <!-- Water Factor Info -->
            <div
              class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3 bg-blue-50 rounded-lg"
            >
              <div>
                <div class="text-xs text-gray-500">Fixture Unit (FU)</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.fixtureUnits }} FU
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Flow Rate (Hunter + HB)</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.baseHunterGPM?.toFixed(2) || "0.00" }} GPM
                  <template v-if="suggestion.hoseBibbGPM > 0">
                    <span class="text-blue-600"
                      >+ {{ suggestion.hoseBibbGPM?.toFixed(2) || "0.00" }} GPM
                      (HB)</span
                    >
                  </template>
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">
                  Water Factor ({{ suggestion.waterFactorPercent }}%)
                </div>
                <div class="text-sm font-bold text-blue-600">
                  ({{ suggestion.baseHunterGPM?.toFixed(2) || "0.00" }} ×
                  {{ suggestion.waterFactorPercent }}%)
                  <template v-if="suggestion.hoseBibbGPM > 0">
                    + {{ suggestion.hoseBibbGPM?.toFixed(2) || "0.00" }}
                  </template>
                  <br />
                  <span class="text-gray-600 font-normal">→</span>
                  {{ suggestion.adjustedGPM?.toFixed(2) || "0.00" }} GPM
                </div>
              </div>
            </div>

            <!-- Total Flow Rate -->
            <div class="grid grid-cols-3 gap-3 mb-4 p-3 bg-green-50 rounded-lg">
              <div>
                <div class="text-xs text-gray-500">Total GPM</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.flowRate.gpm.toFixed(2) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Total LPS</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.flowRate.lps.toFixed(2) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Total m³/s</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.flowRate.m3s.toFixed(5) }}
                </div>
              </div>
            </div>

            <!-- Pipe Info -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div>
                <div class="text-xs text-gray-500">Internal Diameter (in)</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.currentSize.inches }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Internal Diameter (m)</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.currentSize.internalDiameter.toFixed(4) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">ความยาวท่อ</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.pipeLength.toFixed(1) }} m
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">C-Factor</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.cFactor }}
                </div>
              </div>
            </div>

            <!-- Size Simulation Dropdown -->
            <div class="mb-4">
              <button
                @click="toggleSimulation(suggestion.pipeId)"
                class="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                {{
                  expandedSimulationPipeId === suggestion.pipeId
                    ? "ซ่อน"
                    : "ลองขนาดท่ออื่น"
                }}
              </button>

              <!-- Simulation Results -->
              <div
                v-if="expandedSimulationPipeId === suggestion.pipeId"
                class="mt-2 border border-blue-200 rounded-lg overflow-hidden"
              >
                <div
                  class="bg-blue-50 px-3 py-2 text-xs font-medium text-blue-900"
                >
                  เปรียบเทียบขนาดท่อ (คำนวณด้วยสูตร Worst-Case)
                </div>
                <div
                  class="px-3 py-2 bg-gray-50 text-xs text-gray-600 border-b border-gray-200"
                >
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="font-medium">สถานะ:</span>
                    <span class="flex items-center gap-1"
                      >✅
                      <span class="text-green-600">ดี (1.2-2.4 m/s)</span></span
                    >
                    <span class="flex items-center gap-1"
                      >⚠️
                      <span class="text-yellow-600"
                        >ต่ำ/สูงกว่าเกณฑ์</span
                      ></span
                    >
                    <span class="flex items-center gap-1"
                      >❌
                      <span class="text-red-600"
                        >วิกฤต (< 0.6 หรือ > 3.0 m/s)</span
                      ></span
                    >
                  </div>
                </div>
                <div class="divide-y divide-gray-200">
                  <div
                    v-for="(sim, idx) in simulatedResults.get(
                      suggestion.pipeId
                    ) || []"
                    :key="idx"
                    class="px-3 py-2 hover:bg-gray-50 transition-colors"
                    :class="{ 'bg-blue-50': sim.isCurrent }"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-sm font-bold text-gray-900">
                            {{ sim.mm }}mm ({{ sim.inches }})
                          </span>
                          <span
                            v-if="sim.isCurrent"
                            class="text-xs bg-blue-600 text-white px-2 py-0.5 rounded"
                          >
                            ปัจจุบัน
                          </span>
                          <span
                            class="text-xs"
                            :class="getSimulationStatusColor(sim.status)"
                          >
                            {{ getSimulationStatusIcon(sim.status) }}
                          </span>
                        </div>
                        <div
                          class="grid grid-cols-2 gap-2 text-xs text-gray-600"
                        >
                          <div>
                            Velocity:
                            <span
                              class="font-medium"
                              :class="getSimulationStatusColor(sim.status)"
                              >{{ sim.velocity.toFixed(2) }} m/s</span
                            >
                          </div>
                          <div>
                            Friction:
                            <span class="font-medium"
                              >{{ sim.frictionLoss.toFixed(2) }} m/100m</span
                            >
                          </div>
                          <div class="col-span-2 text-gray-500">
                            ID: {{ (sim.internalDiameter * 1000).toFixed(2) }}mm
                          </div>
                        </div>
                      </div>
                      <button
                        v-if="!sim.isCurrent"
                        @click="selectSimulatedSize(suggestion.pipeId, sim)"
                        class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors flex-shrink-0"
                      >
                        ใช้ขนาดนี้
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Calculation Results -->
            <div
              class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div class="text-xs text-gray-500">ความเร็วน้ำ (v)</div>
                <div
                  class="text-sm font-bold"
                  :class="getVelocityColor(suggestion.velocity)"
                >
                  {{ suggestion.velocity.toFixed(2) }} m/s
                </div>
                <div class="text-xs text-gray-400">ควร 1.2-2.4</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Friction Loss Rate</div>
                <div
                  class="text-sm font-bold"
                  :class="getFrictionLossColor(suggestion.frictionLoss)"
                >
                  {{ suggestion.frictionLoss.toFixed(2) }} m/100m
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">Major Loss</div>
                <div class="text-sm font-bold text-gray-900">
                  {{ suggestion.majorLoss.toFixed(3) }} m.wg
                </div>
              </div>
            </div>

            <!-- Warnings -->
            <div
              v-if="suggestion.warnings && suggestion.warnings.length > 0"
              class="mb-4"
            >
              <div
                v-for="(warning, idx) in suggestion.warnings"
                :key="idx"
                class="text-xs text-red-600 flex items-start mb-1"
              >
                <svg
                  class="h-3 w-3 mr-1 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {{ warning }}
              </div>
            </div>

            <!-- Suggestion -->
            <div
              v-if="suggestion.suggestedSize"
              class="rounded-lg p-3 mb-4"
              :class="getStatusBgClass(suggestion.status)"
            >
              <div class="flex items-start">
                <svg
                  class="h-4 w-4 mr-2 flex-shrink-0 mt-0.5"
                  :class="getStatusIconClass(suggestion.status)"
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
                <div class="flex-1">
                  <div
                    class="text-sm font-bold"
                    :class="getStatusTextClass(suggestion.status)"
                  >
                    แนะนำ: เพิ่มขนาดเป็น {{ suggestion.suggestedSize.mm }}mm ({{
                      suggestion.suggestedSize.inches
                    }})
                  </div>
                  <div class="text-xs mt-1 text-gray-700">
                    → Velocity ใหม่:
                    {{ suggestion.suggestedVelocity!.toFixed(2) }} m/s ✓
                  </div>
                  <div class="text-xs text-gray-700">
                    → Friction Loss ใหม่:
                    {{ suggestion.suggestedFrictionLoss!.toFixed(2) }} m/100m
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div
              v-if="
                suggestion.suggestedSize && suggestion.status === 'CRITICAL'
              "
              class="flex justify-end gap-2"
            >
              <button
                @click="applySingleSuggestion(suggestion)"
                :disabled="applying === suggestion.pipeId"
                class="btn btn-primary text-xs"
              >
                <svg
                  v-if="applying !== suggestion.pipeId"
                  class="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <svg
                  v-else
                  class="animate-spin h-3 w-3 mr-1"
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
                {{
                  applying === suggestion.pipeId
                    ? "กำลังบันทึก..."
                    : `ใช้ ${suggestion.suggestedSize.mm}mm`
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Apply All Button -->
    <div v-if="summary && summary.needsUpsizing > 0" class="mt-4 pt-4 border-t">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          มี {{ summary.needsUpsizing }} ท่อที่ต้องการการปรับปรุง
        </div>
        <button
          @click="applyAllSuggestions"
          :disabled="applyingAll"
          class="btn btn-primary"
        >
          <svg
            v-if="!applyingAll"
            class="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            class="animate-spin h-4 w-4 mr-1"
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
          {{ applyingAll ? "กำลังบันทึก..." : "ปรับปรุงทั้งหมด" }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!suggestions || suggestions.length === 0"
      class="text-center py-8 text-gray-500"
    >
      <svg
        class="h-12 w-12 mx-auto mb-3 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p class="text-sm">คลิกปุ่ม "วิเคราะห์ท่อทั้งหมด" เพื่อเริ่มวิเคราะห์</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from "vue";
import { calculatePVCInternalDiameterWorstCase } from "../../../shared/constants/pipes.ts";
import { useProjectStore } from "../../stores/projectStore";

const { autoSuggestApi } = useApi();
const projectStore = useProjectStore();

const props = defineProps<{
  networkId?: number;      // v1 mode: network ID from database
  networkData?: any;       // v2 mode: network data from version snapshot
  versionId?: number;      // v2 mode: version ID
  versionData?: any;       // v2 mode: version object (for snapshotFixtures)
  systemType?: "FLUSH_TANK" | "FLUSH_VALVE";
  projectId?: number; // 🔥 FIX: Add projectId for localStorage key consistency
}>();

const emit = defineEmits<{
  suggestionChange: [];
  summaryChange: [summary: any];
  needMajorLoss: [majorLossBar: number];
  networkChange: [networkData: any];
}>();

const toast = useToast();

// State
const analyzing = ref(false);
const applying = ref<number | null>(null);
const applyingAll = ref(false);
const suggestions = ref<any[]>([]);
const summary = ref<any>(null);
const projectCriteria = ref<any>(null); // Add criteria state
const expandedSimulationPipeId = ref<number | null>(null); // Track which pipe's simulation is expanded
const simulatedResults = ref<Map<number, any[]>>(new Map()); // Store simulation results for each pipe
const currentProjectId = ref<number | null>(null); // Track current project ID

// Computed: Detect which mode we're in
const isV2Mode = computed(() => {
  return !!(props.networkData && props.versionId);
});

console.log('[AutoSuggest] Component mounted/updated:', {
  networkId: props.networkId,
  versionId: props.versionId,
  hasNetworkData: !!props.networkData,
  isV2Mode: isV2Mode.value
});

// Pressure Calculation State
const selectedFixture = ref<any>(null); // สุขภัณฑ์ปลายทายที่เลือก

// Static Head (local state, synced with store) - Initialize to 0 to prevent null errors
const staticHeadM = ref<number>(0);

// Fixture Flow Rates Data (copy from reference)
const fixtureFlowRates = [
  {
    name: "Ordinary basin faucet",
    nameTh: "ก๊อกอ่างล้างหน้าธรรมดา",
    pressureBar: 0.55,
    pressurePsi: 8.0,
    flowLps: 0.19,
    flowGpm: 3.0
  },
  {
    name: "Self-closing basin faucet",
    nameTh: "ก๊อกอ่างล้างหน้าปิดอัตโนมัติ",
    pressureBar: 0.84,
    pressurePsi: 12.0,
    flowLps: 0.16,
    flowGpm: 2.5
  },
  {
    name: "Sink Faucet",
    nameTh: "ก๊อกอ่างล้างจาน",
    pressureBar: 0.35,
    pressurePsi: 5.0,
    flowLps: 0.28,
    flowGpm: 4.5
  },
  {
    name: "Bathtub",
    nameTh: "อ่างอาบน้ำ",
    pressureBar: 0.35,
    pressurePsi: 5.0,
    flowLps: 0.38,
    flowGpm: 6.0
  },
  {
    name: "Laundry tub cock",
    nameTh: "ก๊อกอ่างล้างผ้า",
    pressureBar: 0.35,
    pressurePsi: 5.0,
    flowLps: 0.32,
    flowGpm: 5.0
  },
  {
    name: "Shower",
    nameTh: "ฝักบัว",
    pressureBar: 0.84,
    pressurePsi: 12.0,
    flowLps: 0.32,
    flowGpm: 5.0
  },
  {
    name: "Ball cock for closet",
    nameTh: "ลูกลอยชักโครก",
    pressureBar: 1.0,
    pressurePsi: 15.0,
    flowLps: 0.19,
    flowGpm: 3.0
  },
  {
    name: "Flush valve for closet",
    nameTh: "ลูกสูบชักโครก",
    pressureBar: 1.0,
    pressurePsi: 15.0,
    flowLps: 1.8,
    flowGpm: 28.0
  },
  {
    name: "Flush valve for urinal",
    nameTh: "ลูกสูบชักกระต๊าก",
    pressureBar: 1.0,
    pressurePsi: 15.0,
    flowLps: 0.95,
    flowGpm: 15.0
  }
];

// Set default fixture
if (!selectedFixture.value) {
  selectedFixture.value = fixtureFlowRates[0];
}

// Computed properties for grouping
const criticalPathPipes = computed(() => {
  return suggestions.value.filter((s) => s.pathType === "CRITICAL");
});

const branchPipes = computed(() => {
  return suggestions.value.filter((s) => s.pathType === "BRANCH");
});

// ===== PRESSURE CALCULATION COMPUTED PROPERTIES =====

// Unit conversion: m.wg to bar (safe from null/undefined)
const mwgToBar = (mwg: number) => (mwg || 0) / 10.197;
const barToMwg = (bar: number) => (bar || 0) * 10.197;

// Total Major Loss (ความดันลดท่อรวม - Critical Path เท่านั้น)
const totalMajorLoss = computed(() => {
  return suggestions.value
    .filter((s) => s.isCriticalPath === true)
    .reduce((sum, s) => sum + (s.majorLoss || 0), 0);
});

// Total Minor Loss (ความดันลดข้อต่อ = 30% ของ Major Loss)
const totalMinorLoss = computed(() => {
  return totalMajorLoss.value * 0.3;
});

// Total Pressure Loss at Water Meter (รวมที่มาตรวัด)
const totalPressureLossMWG = computed(() => {
  const staticHead = staticHeadM.value || 0;
  const result = totalMajorLoss.value + totalMinorLoss.value + staticHead;
  console.log(
    `[Pressure Calc] Major: ${totalMajorLoss.value.toFixed(3)}, Minor: ${totalMinorLoss.value.toFixed(3)}, StaticHead: ${staticHead}, Total: ${result.toFixed(3)}`
  );
  return result;
});

const totalPressureLossBar = computed(() => {
  return mwgToBar(totalPressureLossMWG.value);
});

// Required Source Pressure (แรงดันต้นทางที่ต้องมี)
const sourcePressureMWG = computed(() => {
  const fixturePressureMWG = barToMwg(selectedFixture.value?.pressureBar || 0);
  const result = totalPressureLossMWG.value + fixturePressureMWG;
  console.log(
    `[Pressure Calc] Fixture Pressure: ${fixturePressureMWG.toFixed(3)}, Source Pressure Required: ${result.toFixed(3)} m (${mwgToBar(result).toFixed(2)} bar)`
  );
  return result;
});

const sourcePressureBar = computed(() => {
  return mwgToBar(sourcePressureMWG.value);
});

// Constants
const VELOCITY_MIN = 1.2;
const VELOCITY_MAX = 2.4;
const VELOCITY_CRITICAL_HIGH = 3.0;
const VELOCITY_CRITICAL_LOW = 0.6;
const MAX_FRICTION_LOSS = 10.0;

// Pipe Sizes (Table 2.6)
const PIPE_SIZES = [
  { mm: 15, inches: "1/2", internalDiameterM: 0.0158 },
  { mm: 20, inches: "3/4", internalDiameterM: 0.0209 },
  { mm: 25, inches: "1", internalDiameterM: 0.0266 },
  { mm: 32, inches: "1-1/4", internalDiameterM: 0.035 },
  { mm: 40, inches: "1-1/2", internalDiameterM: 0.0409 },
  { mm: 50, inches: "2", internalDiameterM: 0.0525 }
];

// Water Factor Table - Office, School, Apartment
const WATER_FACTOR_TABLE = [
  { fuRange: "Up to 400", fuMin: 0, fuMax: 400, percent: 100 },
  { fuRange: "401-600", fuMin: 401, fuMax: 600, percent: 87 },
  { fuRange: "601-900", fuMin: 601, fuMax: 900, percent: 75 },
  { fuRange: "901-1200", fuMin: 901, fuMax: 1200, percent: 64 },
  { fuRange: "1201-1500", fuMin: 1201, fuMax: 1500, percent: 63 },
  { fuRange: "1501-2000", fuMin: 1501, fuMax: 2000, percent: 61 },
  { fuRange: "2001-2500", fuMin: 2001, fuMax: 2500, percent: 60 },
  { fuRange: "2501-3000", fuMin: 2501, fuMax: 3000, percent: 59 },
  { fuRange: "3001-4000", fuMin: 3001, fuMax: 4000, percent: 58 },
  { fuRange: "4001-5000", fuMin: 4001, fuMax: 5000, percent: 56 },
  { fuRange: "5001-6000", fuMin: 5001, fuMax: 6000, percent: 56 },
  { fuRange: "6001-7000", fuMin: 6001, fuMax: 7000, percent: 56 },
  { fuRange: "7001-8000", fuMin: 7001, fuMax: 8000, percent: 55 }
];

// ===== HELPER FUNCTIONS =====

// Get Water Factor percent based on FU
const getWaterFactorPercent = (fu: number): number => {
  const factor = WATER_FACTOR_TABLE.find(
    (row) => fu >= row.fuMin && fu <= row.fuMax
  );
  return factor?.percent || 100;
};

// Calculate Adjusted GPM with Water Factor
const calculateAdjustedGPM = (hunterGPM: number, fu: number): number => {
  const percent = getWaterFactorPercent(fu);
  return hunterGPM * (percent / 100);
};

// Convert GPM to m³/s (precise: 1 GPM = 6.3090196666667E-5 m³/s)
const gpmToM3S = (gpm: number): number => {
  return gpm * 6.3090196666667e-5;
};

// Convert GPM to LPS (precise: 1 GPM = 0.0630901964 L/s)
const gpmToLPS = (gpm: number): number => {
  return gpm * 0.0630901964;
};

// Calculate Velocity (v = Q/A)
const calculateVelocity = (
  flowM3S: number,
  internalDiameterM: number
): number => {
  const area = Math.PI * Math.pow(internalDiameterM / 2, 2);
  return flowM3S / area;
};

// Calculate Friction Loss Rate (Hazen-Williams)
const calculateFrictionLoss = (
  flowM3S: number,
  internalDiameterM: number,
  cFactor: number
): number => {
  const h_f =
    (10.583 / Math.pow(internalDiameterM, 4.87)) *
    Math.pow(flowM3S / cFactor, 1.85) *
    100;
  return h_f;
};

// Calculate Major Loss
const calculateMajorLoss = (
  lengthM: number,
  frictionLossRate: number
): number => {
  return lengthM * (frictionLossRate / 100);
};

// Load project criteria to get PVC Class
const loadProjectCriteria = async () => {
  // 🔥 FIX: Use projectId directly instead of loading network
  if (!props.projectId) {
    console.log("[AutoSuggest] No projectId provided, skipping criteria load");
    return;
  }

  try {
    // Use projectId directly from props
    currentProjectId.value = props.projectId;

    // Load criteria using store (with cache)
    const { projectsApi } = useApi();
    const criteria = await projectStore.loadCriteria(props.projectId, () =>
      projectsApi.getCriteria(props.projectId)
    );

    projectCriteria.value = criteria;

    // Initialize staticHead from criteria if it exists in DB
    if (criteria?.staticHead !== undefined && criteria.staticHead !== null) {
      staticHeadM.value = criteria.staticHead;
      console.log(
        `[AutoSuggest] ✅ Loaded staticHead from DB criteria: ${criteria.staticHead}`
      );
    } else {
      console.log(
        `[AutoSuggest] ℹ️ No staticHead in DB criteria, using current value: ${staticHeadM.value}`
      );
    }

    console.log("[AutoSuggest] Project criteria loaded:", criteria);
  } catch (error) {
    console.error(
      "[AutoSuggest] ⚠️ Failed to load project criteria (API 404 or other error):",
      error
    );
    // Don't throw - use localStorage value (loaded in onMounted) as fallback
  }
};

// Save static head to database (store is auto-updated via watch)
const saveStaticHead = async () => {
  if (!currentProjectId.value) return;

  try {
    const { projectsApi } = useApi();
    await projectsApi.updateCriteria(currentProjectId.value, {
      staticHead: staticHeadM.value
    });

    // Update store cache with the new value
    projectStore.setCriteria(currentProjectId.value, {
      staticHead: staticHeadM.value
    });

    console.log(
      "Static head saved to DB and store cache updated:",
      staticHeadM.value
    );
  } catch (error) {
    console.error("Failed to save static head:", error);
  }
};

// Watch static head changes and auto-save to localStorage, store, and DB (debounced)
let saveTimeout: NodeJS.Timeout | null = null;
watch(staticHeadM, (newValue, oldValue) => {
  if (newValue === oldValue) return;

  console.log(`[AutoSuggest] staticHeadM changed: ${oldValue} → ${newValue}`);

  // 🛡️ IMMEDIATE SAVE to localStorage (browser-only, guaranteed persistence)
  if (props.networkId && typeof window !== "undefined") {
    const cacheKey = `staticHead_net_${props.networkId}`;
    localStorage.setItem(cacheKey, newValue.toString());
    console.log(
      `[AutoSuggest] 💾 Saved to localStorage immediately: ${newValue}`
    );
  }

  // Save to store and DB only if projectId is available
  if (currentProjectId.value) {
    // Save to store immediately (for persistence across navigation)
    projectStore.setStaticHead(currentProjectId.value, newValue);

    // Debounce DB save (wait 1 second after user stops typing)
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveStaticHead();
    }, 1000);

    console.log(
      `[AutoSuggest] StaticHead ${newValue} saved to store, DB save scheduled in 1s`
    );
  } else {
    console.log(
      `[AutoSuggest] ⚠️ No projectId yet, value saved to localStorage only (will sync to DB later)`
    );
  }
});

// ===== SIZE SIMULATION FUNCTIONS =====

// Get nearby pipe sizes (±2 levels from current size)
const getNearbySizes = (currentMM: number): typeof PIPE_SIZES => {
  const currentIndex = PIPE_SIZES.findIndex((s) => s.mm === currentMM);
  if (currentIndex === -1) return PIPE_SIZES.slice(0, 5);

  const startIndex = Math.max(0, currentIndex - 2);
  const endIndex = Math.min(PIPE_SIZES.length, currentIndex + 3);
  return PIPE_SIZES.slice(startIndex, endIndex);
};

// Simulate different pipe sizes for a given suggestion
const simulatePipeSizes = (suggestion: any): any[] => {
  const nearbySizes = getNearbySizes(suggestion.currentSize.mm);
  const pvcClass = projectCriteria.value?.pvcClass || 7;
  const cFactor = suggestion.cFactor || 150;
  const flowM3S = suggestion.flowRate.m3s;

  return nearbySizes.map((size) => {
    // Calculate internal diameter based on material
    let internalDiameterM: number;
    if (cFactor === 150) {
      // PVC - use worst-case formula
      internalDiameterM = calculatePVCInternalDiameterWorstCase(
        size.mm,
        pvcClass
      );
    } else {
      // Non-PVC - use PIPE_SIZES constant
      internalDiameterM = size.internalDiameterM;
    }

    // Calculate velocity and friction loss
    const velocity = calculateVelocity(flowM3S, internalDiameterM);
    const frictionLoss = calculateFrictionLoss(
      flowM3S,
      internalDiameterM,
      cFactor
    );
    const status = determineStatus(velocity);

    return {
      mm: size.mm,
      inches: size.inches,
      internalDiameter: internalDiameterM,
      velocity: velocity,
      frictionLoss: frictionLoss,
      status: status,
      isCurrent: size.mm === suggestion.currentSize.mm
    };
  });
};

// Toggle simulation dropdown for a pipe
const toggleSimulation = (pipeId: number) => {
  if (expandedSimulationPipeId.value === pipeId) {
    // Close if already open
    expandedSimulationPipeId.value = null;
  } else {
    // Open and calculate simulations
    expandedSimulationPipeId.value = pipeId;
    const suggestion = suggestions.value.find((s) => s.pipeId === pipeId);
    if (suggestion && !simulatedResults.value.has(pipeId)) {
      const results = simulatePipeSizes(suggestion);
      simulatedResults.value.set(pipeId, results);
    }
  }
};

// Get simulation status color
const getSimulationStatusColor = (status: string) => {
  switch (status) {
    case "OK":
      return "text-green-600";
    case "WARNING":
      return "text-yellow-600";
    case "CRITICAL":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

// Get simulation status icon
const getSimulationStatusIcon = (status: string) => {
  switch (status) {
    case "OK":
      return "✅";
    case "WARNING":
      return "⚠️";
    case "CRITICAL":
      return "❌";
    default:
      return "•";
  }
};

// Select a simulated size and update the suggestion
const selectSimulatedSize = async (pipeId: number, simSize: any) => {
  const suggestion = suggestions.value.find((s) => s.pipeId === pipeId);
  if (!suggestion) return;

  // Set loading state
  applying.value = pipeId;

  try {
    // v2 mode: Update networkData directly (no API call)
    if (isV2Mode.value && props.networkData) {
      // Find and update the pipe in networkData
      const pipe = props.networkData.pipes.find((p: any) => p.id === pipeId);
      if (pipe) {
        pipe.nominalSize = simSize.mm;
        console.log(`[V2] Updated pipe ${pipeId} size to ${simSize.mm}mm in networkData`);
      }

      // Emit event to parent to save to version snapshot
      emit('networkChange', props.networkData);
    } else {
      // v1 mode: Call API to save the new size to database
      await autoSuggestApi.applySingle(props.networkId, pipeId, simSize.mm);
    }

    // Update current size in local state
    const sizeInfo =
      PIPE_SIZES.find((s) => s.mm === simSize.mm) || PIPE_SIZES[0];

    suggestion.currentSize = {
      mm: simSize.mm,
      inches: sizeInfo.inches,
      internalDiameter: simSize.internalDiameter
    };

    // Recalculate losses
    const majorLoss = calculateMajorLoss(
      suggestion.pipeLength,
      simSize.frictionLoss
    );
    const minorLoss = majorLoss * 0.3;
    const totalLoss = majorLoss + minorLoss + suggestion.staticHead;

    // Update suggestion
    suggestion.velocity = simSize.velocity;
    suggestion.frictionLoss = simSize.frictionLoss;
    suggestion.majorLoss = majorLoss;
    suggestion.minorLoss = minorLoss;
    suggestion.totalLoss = totalLoss;
    suggestion.status = simSize.status;

    // Clear suggested size since user manually selected a size
    suggestion.suggestedSize = undefined;
    suggestion.suggestedVelocity = undefined;
    suggestion.suggestedFrictionLoss = undefined;

    // Update reason
    suggestion.reason = `ผู้ใช้เลือกขนาด ${simSize.mm}mm แบบ manual`;

    // Update summary
    if (summary.value) {
      if (simSize.status === "OK") {
        summary.value.ok++;
        summary.value.warning--;
        summary.value.needsUpsizing--;
      }
    }

    // Clear simulation results and close dropdown
    simulatedResults.value.delete(pipeId);
    expandedSimulationPipeId.value = null;

    toast.success(`บันทึกขนาดท่อ #${pipeId} เป็น ${simSize.mm}mm เรียบร้อย`);
  } catch (error: any) {
    console.error("Failed to save pipe size:", error);
    toast.error(error.message || "บันทึกขนาดท่อไม่สำเร็จ");
  } finally {
    applying.value = null;
  }
};

// Auto Select Pipe Size based on velocity range (1.2-2.4 m/s)
const autoSelectPipeSize = (
  flowM3S: number
): {
  size: (typeof PIPE_SIZES)[0];
  velocity: number;
  status: "OK" | "WARNING";
} => {
  // Try to find size with velocity in range
  for (const pipeSize of PIPE_SIZES) {
    const velocity = calculateVelocity(flowM3S, pipeSize.internalDiameterM);
    if (velocity >= VELOCITY_MIN && velocity <= VELOCITY_MAX) {
      return { size: pipeSize, velocity, status: "OK" };
    }
  }

  // If no perfect fit, find closest size
  let closestSize = PIPE_SIZES[0];
  let closestVelocity = calculateVelocity(
    flowM3S,
    closestSize.internalDiameterM
  );
  let minDiff = Math.abs(closestVelocity - (VELOCITY_MIN + VELOCITY_MAX) / 2);

  for (const pipeSize of PIPE_SIZES.slice(1)) {
    const velocity = calculateVelocity(flowM3S, pipeSize.internalDiameterM);
    const diff = Math.abs(velocity - (VELOCITY_MIN + VELOCITY_MAX) / 2);

    if (diff < minDiff) {
      closestSize = pipeSize;
      closestVelocity = velocity;
      minDiff = diff;
    }
  }

  return { size: closestSize, velocity: closestVelocity, status: "WARNING" };
};

// Determine Pipe Status based on velocity
const determineStatus = (velocity: number): "OK" | "WARNING" | "CRITICAL" => {
  if (velocity >= VELOCITY_MIN && velocity <= VELOCITY_MAX) {
    return "OK";
  }
  if (
    (velocity >= VELOCITY_CRITICAL_LOW && velocity < VELOCITY_MIN) ||
    (velocity > VELOCITY_MAX && velocity <= VELOCITY_CRITICAL_HIGH)
  ) {
    return "WARNING";
  }
  return "CRITICAL";
};

// Suggest larger pipe size if needed
const suggestLargerPipe = (
  currentVelocity: number,
  currentSizeMM: number,
  flowM3S: number,
  cFactor: number,
  pvcClass: number
): {
  size: (typeof PIPE_SIZES)[0];
  velocity: number;
  frictionLoss: number;
} | null => {
  const status = determineStatus(currentVelocity);

  if (status === "OK") {
    return null; // No suggestion needed
  }

  // Try larger sizes
  const currentIndex = PIPE_SIZES.findIndex((s) => s.mm === currentSizeMM);

  for (let i = currentIndex + 1; i < PIPE_SIZES.length; i++) {
    const newSize = PIPE_SIZES[i];

    // Calculate internal diameter based on material
    let internalDiameterM: number;
    if (cFactor === 150) {
      // PVC - use worst-case formula
      internalDiameterM = calculatePVCInternalDiameterWorstCase(
        newSize.mm,
        pvcClass
      );
      console.log(
        `📏 Suggested PVC ID: DN=${newSize.mm}, Class=${pvcClass}, ID=${internalDiameterM}m (${(internalDiameterM * 1000).toFixed(2)}mm)`
      );
    } else {
      // Non-PVC - use PIPE_SIZES constant
      internalDiameterM = newSize.internalDiameterM;
    }

    const newVelocity = calculateVelocity(flowM3S, internalDiameterM);
    const newFrictionLoss = calculateFrictionLoss(
      flowM3S,
      internalDiameterM,
      cFactor
    );
    const newStatus = determineStatus(newVelocity);

    if (newStatus === "OK" || newStatus === "WARNING") {
      return {
        size: newSize,
        velocity: newVelocity,
        frictionLoss: newFrictionLoss
      };
    }
  }

  return null; // No suitable size found
};

// Sort pipes from end (fixtures) to start (source)
const sortPipesFromEndToStart = (pipes: any[]): any[] => {
  if (pipes.length === 0) return [];

  console.log("🔄 Sorting pipes from end to start. Total pipes:", pipes.length);

  // Check if we have node information
  const hasNodeInfo = pipes.some((p) => p.sourceNode && p.targetNode);
  if (!hasNodeInfo) {
    console.warn("⚠️ No node information available, returning original order");
    return pipes; // Return original order if no node info
  }

  // Build adjacency map: nodeId -> pipes starting from this node
  const outgoingFromNode = new Map<number, any[]>();
  pipes.forEach((pipe) => {
    const sourceId = pipe.sourceNode?.id;
    if (sourceId !== undefined) {
      if (!outgoingFromNode.has(sourceId)) {
        outgoingFromNode.set(sourceId, []);
      }
      outgoingFromNode.get(sourceId)!.push(pipe);
    }
  });

  // Find end pipes (pipes whose target has NO outgoing pipes)
  const endPipes = pipes.filter((pipe) => {
    const targetId = pipe.targetNode?.id;
    return (
      targetId !== undefined &&
      (!outgoingFromNode.has(targetId) ||
        outgoingFromNode.get(targetId)!.length === 0)
    );
  });

  console.log("🏁 End pipes found:", endPipes.length);

  // BFS from end pipes backwards towards source
  const sorted: any[] = [];
  const visited = new Set<number>();
  const queue = [...endPipes];

  while (queue.length > 0) {
    const pipe = queue.shift()!;

    // ✅ เปลี่ยนมาใช้ pipe.pipeId ให้ตรงกับข้อมูลที่ map มา
    if (visited.has(pipe.pipeId)) continue;

    visited.add(pipe.pipeId);
    sorted.push(pipe);

    // Find pipes that feed INTO this pipe
    const sourceId = pipe.sourceNode?.id;
    if (sourceId !== undefined) {
      const incomingPipes = pipes.filter((p) => p.targetNode?.id === sourceId);
      incomingPipes.forEach((p) => {
        if (!visited.has(p.pipeId)) {
          // ✅ แก้ไขตรงนี้ด้วยเผื่อไว้
          queue.push(p);
        }
      });
    }
  }

  console.log("✅ Sorted pipes:", sorted.length);
  return sorted;
};

// Separate pipes into Critical Path and Branch Pipes
const separatePipesByPath = (pipes: any[]) => {
  const criticalPath = pipes.filter((p) => p.isCriticalPath === true);
  const branchPipes = pipes.filter((p) => p.isCriticalPath !== true);

  return {
    criticalPath: sortPipesFromEndToStart(criticalPath),
    branchPipes: sortPipesFromEndToStart(branchPipes)
  };
};

// ===== ANALYSIS METHODS =====

const analyzePipes = async () => {
  console.log("[AutoSuggest] 📍 analyzePipes() called - networkId:", props.networkId);

  if (!props.networkId) {
    toast.error("ไม่พบข้อมูล Network");
    return;
  }

  analyzing.value = true;

  try {
    console.log("[AutoSuggest] 📍 Loading project criteria...");
    // Load project criteria first to get PVC Class
    await loadProjectCriteria();
    console.log("[AutoSuggest] ✅ Criteria loaded:", projectCriteria.value);
    console.log(
      "🔍 Starting auto-suggest analysis for networkId:",
      props.networkId
    );
    console.log("🔍 System type:", props.systemType);

    // 🔥 FIX ขั้นเทพ: โหลดข้อมูล FU/GPM ที่คำนวณเป๊ะๆ ไว้แล้วจาก Step 4 (Fixtures)
    let step4Data: any[] = [];
    if (typeof window !== "undefined" && props.projectId) {
      const storageKey = `pipeGPMData_${props.projectId}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        try {
          step4Data = JSON.parse(savedData);
          console.log(
            `✅ [Single Source of Truth] โหลดข้อมูลจาก Step 4 สำเร็จ (${step4Data.length} ท่อ)`
          );
        } catch (e) {
          console.error("❌ ไม่สามารถอ่านข้อมูลจาก Step 4 ได้:", e);
        }
      } else {
        console.warn(
          `⚠️ ไม่พบข้อมูล Step 4 ใน LocalStorage (Key: ${storageKey})`
        );
      }
    }

    // Load Data from API
    let result;
    try {
      result = await autoSuggestApi.analyze(props.networkId, {
        systemType: props.systemType || "FLUSH_TANK"
      });
    } catch (apiError: any) {
      console.error("❌ API Call failed:", apiError);
      toast.error(apiError.message || "ไม่สามารถเชื่อมต่อกับ Server ได้");
      analyzing.value = false;
      return;
    }

    if (!result) {
      console.error("❌ API returned null/undefined");
      toast.error("ไม่พบข้อมูลการวิเคราะห์ กรุณาลองใหม่");
      analyzing.value = false;
      return;
    }

    let suggestionsData;
    if (result.suggestions && Array.isArray(result.suggestions)) {
      suggestionsData = result.suggestions;
    } else if (
      result.data?.suggestions &&
      Array.isArray(result.data.suggestions)
    ) {
      suggestionsData = result.data.suggestions;
    } else if (Array.isArray(result)) {
      suggestionsData = result;
    } else {
      console.error("❌ Cannot extract suggestionsData from result:", result);
      toast.error("รูปแบบข้อมูลไม่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบ");
      analyzing.value = false;
      return;
    }

    if (!suggestionsData || suggestionsData.length === 0) {
      console.warn("⚠️ suggestionsData is empty array");
      toast.error("ไม่พบข้อมูลท่อ กรุณาสร้าง Network ใน Step 3");
      analyzing.value = false;
      return;
    }

    // Process suggestions from backend with Water Factor AND Step 4 Data
    const analyzedPipes = suggestionsData.map((suggestion: any) => {
      // 🔥 FIX: ค้นหาท่อนี้จากข้อมูล Step 4 ที่เราโหลดมา
      const step4Pipe = step4Data.find(
        (p: any) => p.pipeId === suggestion.pipeId
      );

      // 🔥 1. ดึงข้อมูลแบบแยกส่วนจาก Step 4 (Single Source of Truth)
      const fu =
        step4Pipe?.totalFU ??
        suggestion.fixtureUnits ??
        suggestion.totalFU ??
        0;
      const baseHunterGPM =
        step4Pipe?.hunterGPM ?? suggestion.flowRate?.gpm ?? suggestion.gpm ?? 0;
      const hoseBibbGPM = step4Pipe?.hoseBibbGPM ?? 0;

      // เอาไว้โชว์ UI ว่า GPM ดิบๆ รวมกันได้เท่าไหร่
      const rawTotalGPM = baseHunterGPM + hoseBibbGPM;

      console.log(
        `[AutoSuggest] Pipe ${suggestion.pipeId}: ` +
          `FU=${fu}, HunterGPM=${baseHunterGPM.toFixed(2)}, HB=${hoseBibbGPM.toFixed(2)}`
      );

      // 🔥 2. Apply Water Factor เฉพาะกับ Hunter GPM ของสุขภัณฑ์!
      const waterFactorPercent = getWaterFactorPercent(fu);
      const adjustedHunterGPM = calculateAdjustedGPM(baseHunterGPM, fu);

      // 🔥 3. เอา Hose Bibb (ที่ค่าคงที่เสมอ) มาบวกกลับเข้าไปตอนท้าย
      const adjustedGPM = adjustedHunterGPM + hoseBibbGPM;

      const flowM3S = gpmToM3S(adjustedGPM);
      const flowLPS = gpmToLPS(adjustedGPM);

      // Use current pipe size from backend
      const currentSizeMM = suggestion.currentSize?.mm || 15;

      // Calculate internal diameter based on material type
      let internalDiameterM: number;
      const cFactor = suggestion.cFactor || 150;

      if (cFactor === 150) {
        // PVC - use worst-case formula
        const pvcClass = projectCriteria.value?.pvcClass || 7;
        internalDiameterM = calculatePVCInternalDiameterWorstCase(
          currentSizeMM,
          pvcClass
        );
        console.log(`[AutoSuggest] Pipe ${suggestion.pipeId}: DN=${currentSizeMM}mm, PVC Class=${pvcClass}, ID=${internalDiameterM}m`);
      } else {
        // Non-PVC - use PIPE_SIZES constant
        const currentSize =
          PIPE_SIZES.find((s) => s.mm === currentSizeMM) || PIPE_SIZES[0];
        internalDiameterM = currentSize.internalDiameterM;
      }

      // Calculate velocity with calculated internal diameter
      const velocity = calculateVelocity(flowM3S, internalDiameterM);

      // Calculate friction loss
      const frictionLoss = calculateFrictionLoss(
        flowM3S,
        internalDiameterM,
        cFactor
      );

      // Calculate major loss
      const pipeLength =
        suggestion.pipeLength ||
        suggestion.majorLoss / (suggestion.frictionLoss / 100) ||
        1;
      const majorLoss = calculateMajorLoss(pipeLength, frictionLoss);

      // Determine status
      const status = determineStatus(velocity);

      // Generate warnings
      const warnings: string[] = [];
      if (velocity < VELOCITY_CRITICAL_LOW) {
        warnings.push(
          "CRITICAL: Velocity extremely low - risk of sedimentation"
        );
      } else if (velocity < VELOCITY_MIN) {
        warnings.push(
          "WARNING: Velocity below minimum - may cause sedimentation"
        );
      } else if (velocity > VELOCITY_CRITICAL_HIGH) {
        warnings.push(
          "CRITICAL: Velocity extremely high - risk of water hammer"
        );
      } else if (velocity > VELOCITY_MAX) {
        warnings.push("WARNING: Velocity above maximum - may cause noise");
      }

      if (frictionLoss > MAX_FRICTION_LOSS * 1.5) {
        warnings.push("CRITICAL: Friction loss extremely high");
      } else if (frictionLoss > MAX_FRICTION_LOSS) {
        warnings.push("WARNING: Friction loss above recommended");
      }

      // Create segment name from node labels
      const sourceLabel = suggestion.sourceNode?.label || "J?";
      const targetLabel = suggestion.targetNode?.label || "ห้องน้ำ";
      const segmentName = `${sourceLabel} → ${targetLabel}`;

      // Calculate suggested size internal diameter (if exists)
      let suggestedInternalDiameterM: number | undefined;
      if (suggestion.suggestedSize && cFactor === 150) {
        const pvcClass = projectCriteria.value?.pvcClass || 7;
        suggestedInternalDiameterM = calculatePVCInternalDiameterWorstCase(
          suggestion.suggestedSize.mm,
          pvcClass
        );
      } else if (suggestion.suggestedSize) {
        const suggestedSize =
          PIPE_SIZES.find((s) => s.mm === suggestion.suggestedSize.mm) ||
          PIPE_SIZES[0];
        suggestedInternalDiameterM = suggestedSize.internalDiameterM;
      }

      // Get pipe size info for inches label
      const currentSizeInfo =
        PIPE_SIZES.find((s) => s.mm === currentSizeMM) || PIPE_SIZES[0];

      return {
        pipeId: suggestion.pipeId,
        segmentName: segmentName,
        fixtureUnits: fu,
        hunterGPM: rawTotalGPM, // เก็บยอดรวมดิบไว้โชว์เผื่อจำเป็น
        baseHunterGPM: baseHunterGPM, // 🔥 เพิ่มบรรทัดนี้: ส่ง GPM สุขภัณฑ์ไปโชว์
        hoseBibbGPM: hoseBibbGPM, // 🔥 เพิ่มบรรทัดนี้: ส่ง GPM ก๊อกสนามไปโชว์
        waterFactorPercent: waterFactorPercent,
        adjustedGPM: adjustedGPM,
        flowRate: {
          gpm: adjustedGPM,
          lps: flowLPS,
          m3s: flowM3S
        },
        currentSize: {
          mm: currentSizeMM,
          inches: currentSizeInfo.inches,
          internalDiameter: internalDiameterM
        },
        pipeLength: pipeLength,
        cFactor: cFactor,
        velocity: velocity,
        frictionLoss: frictionLoss,
        majorLoss: majorLoss,
        minorLoss: majorLoss * 0.3,
        staticHead: suggestion.staticHead || 0,
        totalLoss: majorLoss + majorLoss * 0.3 + (suggestion.staticHead || 0),
        status: status,
        suggestedSize: (() => {
          if (
            suggestion.suggestedSize &&
            suggestedInternalDiameterM !== undefined
          ) {
            return {
              mm: suggestion.suggestedSize.mm,
              inches:
                PIPE_SIZES.find((s) => s.mm === suggestion.suggestedSize.mm)
                  ?.inches || suggestion.suggestedSize.inches,
              internalDiameter: suggestedInternalDiameterM
            };
          }

          const currentIndex = PIPE_SIZES.findIndex(
            (s) => s.mm === currentSizeMM
          );
          let bestSizeInOKRange = null;
          let bestDistanceToMin = Infinity;

          for (let i = currentIndex; i < PIPE_SIZES.length; i++) {
            const testSize = PIPE_SIZES[i];
            const testVelocity = calculateVelocity(
              flowM3S,
              testSize.internalDiameterM
            );

            if (testVelocity >= VELOCITY_MIN && testVelocity <= VELOCITY_MAX) {
              const distanceToMin = Math.abs(testVelocity - VELOCITY_MIN);
              if (distanceToMin < bestDistanceToMin) {
                bestDistanceToMin = distanceToMin;
                bestSizeInOKRange = testSize;
              }
            }
          }

          if (bestSizeInOKRange) {
            return {
              mm: bestSizeInOKRange.mm,
              inches: bestSizeInOKRange.inches,
              internalDiameter: bestSizeInOKRange.internalDiameterM
            };
          }

          for (let i = currentIndex; i < PIPE_SIZES.length; i++) {
            const testSize = PIPE_SIZES[i];
            const testVelocity = calculateVelocity(
              flowM3S,
              testSize.internalDiameterM
            );
            if (
              (testVelocity >= VELOCITY_CRITICAL_LOW &&
                testVelocity < VELOCITY_MIN) ||
              (testVelocity > VELOCITY_MAX &&
                testVelocity <= VELOCITY_CRITICAL_HIGH)
            ) {
              return {
                mm: testSize.mm,
                inches: testSize.inches,
                internalDiameter: testSize.internalDiameterM
              };
            }
          }

          const nextLargerIndex = currentIndex + 1;
          if (nextLargerIndex < PIPE_SIZES.length) {
            const nextSize = PIPE_SIZES[nextLargerIndex];
            return {
              mm: nextSize.mm,
              inches: nextSize.inches,
              internalDiameter: nextSize.internalDiameterM
            };
          }

          return {
            mm: currentSizeMM,
            inches: currentSizeInfo.inches,
            internalDiameter: internalDiameterM
          };
        })(),
        suggestedVelocity: (() => {
          const sizeInfo =
            suggestion.suggestedSize && suggestedInternalDiameterM !== undefined
              ? { internalDiameter: suggestedInternalDiameterM }
              : (() => {
                  const currentIndex = PIPE_SIZES.findIndex(
                    (s) => s.mm === currentSizeMM
                  );
                  let bestSizeInOKRange = null;
                  let bestDistanceToMin = Infinity;

                  for (let i = currentIndex; i < PIPE_SIZES.length; i++) {
                    const testSize = PIPE_SIZES[i];
                    const testVelocity = calculateVelocity(
                      flowM3S,
                      testSize.internalDiameterM
                    );

                    if (
                      testVelocity >= VELOCITY_MIN &&
                      testVelocity <= VELOCITY_MAX
                    ) {
                      const distanceToMin = Math.abs(
                        testVelocity - VELOCITY_MIN
                      );
                      if (distanceToMin < bestDistanceToMin) {
                        bestDistanceToMin = distanceToMin;
                        bestSizeInOKRange = testSize;
                      }
                    }
                  }

                  if (bestSizeInOKRange) return bestSizeInOKRange;

                  for (let i = currentIndex; i < PIPE_SIZES.length; i++) {
                    const testSize = PIPE_SIZES[i];
                    const testVelocity = calculateVelocity(
                      flowM3S,
                      testSize.internalDiameterM
                    );
                    if (
                      (testVelocity >= VELOCITY_CRITICAL_LOW &&
                        testVelocity < VELOCITY_MIN) ||
                      (testVelocity > VELOCITY_MAX &&
                        testVelocity <= VELOCITY_CRITICAL_HIGH)
                    ) {
                      return testSize;
                    }
                  }

                  const nextLargerIndex = currentIndex + 1;
                  if (nextLargerIndex < PIPE_SIZES.length) {
                    return PIPE_SIZES[nextLargerIndex];
                  }
                  return { internalDiameter: internalDiameterM };
                })();

          return calculateVelocity(flowM3S, sizeInfo.internalDiameter);
        })(),
        suggestedFrictionLoss: (() => {
          const sizeInfo =
            suggestion.suggestedSize && suggestedInternalDiameterM !== undefined
              ? { internalDiameter: suggestedInternalDiameterM }
              : (() => {
                  const currentIndex = PIPE_SIZES.findIndex(
                    (s) => s.mm === currentSizeMM
                  );
                  let bestSizeInOKRange = null;
                  let bestDistanceToMin = Infinity;

                  for (let i = currentIndex; i < PIPE_SIZES.length; i++) {
                    const testSize = PIPE_SIZES[i];
                    const testVelocity = calculateVelocity(
                      flowM3S,
                      testSize.internalDiameterM
                    );

                    if (
                      testVelocity >= VELOCITY_MIN &&
                      testVelocity <= VELOCITY_MAX
                    ) {
                      const distanceToMin = Math.abs(
                        testVelocity - VELOCITY_MIN
                      );
                      if (distanceToMin < bestDistanceToMin) {
                        bestDistanceToMin = distanceToMin;
                        bestSizeInOKRange = testSize;
                      }
                    }
                  }

                  if (bestSizeInOKRange) return bestSizeInOKRange;

                  for (let i = currentIndex; i < PIPE_SIZES.length; i++) {
                    const testSize = PIPE_SIZES[i];
                    const testVelocity = calculateVelocity(
                      flowM3S,
                      testSize.internalDiameterM
                    );
                    if (
                      (testVelocity >= VELOCITY_CRITICAL_LOW &&
                        testVelocity < VELOCITY_MIN) ||
                      (testVelocity > VELOCITY_MAX &&
                        testVelocity <= VELOCITY_CRITICAL_HIGH)
                    ) {
                      return testSize;
                    }
                  }

                  const nextLargerIndex = currentIndex + 1;
                  if (nextLargerIndex < PIPE_SIZES.length) {
                    return PIPE_SIZES[nextLargerIndex];
                  }
                  return { internalDiameter: internalDiameterM };
                })();

          return calculateFrictionLoss(
            flowM3S,
            sizeInfo.internalDiameter,
            cFactor
          );
        })(),
        reason:
          suggestion.reason ||
          (status === "OK"
            ? "Velocity อยู่ในช่วงปกติ"
            : `Velocity ${velocity.toFixed(2)} m/s (ควร 1.2-2.4)`),
        warnings: warnings.length > 0 ? warnings : suggestion.warnings || [],
        isCriticalPath: suggestion.isCriticalPath || false,
        sourceNode: suggestion.sourceNode || null,
        targetNode: suggestion.targetNode || null
      };
    });

    const validPipes = analyzedPipes.filter((pipe) => pipe !== null);

    if (validPipes.length === 0) {
      toast.error("ไม่สามารถวิเคราะห์ข้อมูลท่อได้ กรุณาติดต่อผู้ดูแลระบบ");
      analyzing.value = false;
      return;
    }

    const { criticalPath, branchPipes } = separatePipesByPath(validPipes);

    suggestions.value = [
      ...criticalPath.map((p) => ({ ...p, pathType: "CRITICAL" })),
      ...branchPipes.map((p) => ({ ...p, pathType: "BRANCH" }))
    ];

    const criticalPathMajorLoss = criticalPath.reduce(
      (sum, pipe) => sum + (pipe.majorLoss || 0),
      0
    );
    emit("needMajorLoss", criticalPathMajorLoss);

    nextTick(() => {
      if (suggestions.value.length > 0) {
        // Calculate stats from suggestions
        const totalFU = suggestions.value.reduce((sum, s) => sum + (s.fixtureUnits || 0), 0);
        const maxPipeSize = Math.max(...suggestions.value.map(s => s.currentSize?.mm || 0));
        const criticalPathFlowRate = criticalPath.reduce((max, p) => {
          const flow = p.flowRate?.gpm || 0;
          return flow > max ? flow : max;
        }, 0);

        // Calculate total fixtures from step4Data
        let totalFixtures = 0;
        step4Data.forEach((pipe: any) => {
          if (pipe.fixtureGroups && Array.isArray(pipe.fixtureGroups)) {
            pipe.fixtureGroups.forEach((group: any) => {
              totalFixtures += group.count || 0;
            });
          }
        });

        const summary = {
          criticalPath: criticalPath.map((p) => ({
            segmentName: p.segmentName,
            sizeMM: p.currentSize.mm,
            sizeInches: p.currentSize.inches
          })),
          branch: branchPipes.map((p) => ({
            segmentName: p.segmentName,
            sizeMM: p.currentSize.mm,
            sizeInches: p.currentSize.inches
          })),
          stats: {
            totalFixtures,
            totalFU,
            flowRate: criticalPathFlowRate.toFixed(2),
            maxPipeSize: maxPipeSize + "mm"
          }
        };
        emit("summaryChange", summary);
      }
    });

    summary.value = result.summary || calculateSummary(validPipes);

    toast.success(
      `วิเคราะห์เสร็จสิ้น ${validPipes.length} ท่อ (Critical: ${criticalPath.length}, Branch: ${branchPipes.length})`
    );
  } catch (error: any) {
    console.error("Auto-suggest analysis error:", error);
    toast.error(error.message || "วิเคราะห์ไม่สำเร็จ");
  } finally {
    analyzing.value = false;
  }
};

// Calculate summary statistics
const calculateSummary = (pipes: any[]) => {
  const summary = {
    total: pipes.length,
    ok: 0,
    warning: 0,
    critical: 0,
    needsUpsizing: 0
  };

  pipes.forEach((pipe) => {
    if (pipe.status === "OK") summary.ok++;
    else if (pipe.status === "WARNING") {
      summary.warning++;
      summary.needsUpsizing++;
    } else if (pipe.status === "CRITICAL") {
      summary.critical++;
      summary.needsUpsizing++;
    }
  });

  return summary;
};

// Apply single suggestion
const applySingleSuggestion = async (suggestion: any) => {
  // v1 mode: Check networkId
  // v2 mode: Check networkData
  if (!suggestion.suggestedSize) return;
  if (!isV2Mode.value && !props.networkId) return;

  applying.value = suggestion.pipeId;

  try {
    const targetSize = suggestion.suggestedSize.mm;
    console.log(
      `[applySingleSuggestion] Pipe ${suggestion.pipeId}: Changing to ${targetSize}mm`
    );

    if (isV2Mode.value && props.networkData) {
      // v2 mode: Update networkData directly
      const pipe = props.networkData.pipes.find((p: any) => p.id === suggestion.pipeId);
      if (pipe) {
        pipe.nominalSize = targetSize;
        console.log(`[V2] Updated pipe ${suggestion.pipeId} size to ${targetSize}mm in networkData`);
      }

      // Recalculate analysis locally
      await analyzePipesV2();

      // Emit event to parent to save to version snapshot
      emit('networkChange', props.networkData);

      toast.success(
        `ปรับขนาดท่อ #${suggestion.pipeId} เป็น ${targetSize}mm เรียบร้อย`
      );
    } else {
      // v1 mode: Call API
      await autoSuggestApi.applySingle(
        props.networkId,
        suggestion.pipeId,
        targetSize
      );

      console.log(
        `[applySingleSuggestion] Pipe ${suggestion.pipeId}: API call successful`
      );

      // Reload analysis from backend
      await analyzePipes();

      toast.success(
        `ปรับขนาดท่อ #${suggestion.pipeId} เป็น ${targetSize}mm เรียบร้อย`
      );
    }
  } catch (error: any) {
    console.error(
      `[applySingleSuggestion] Pipe ${suggestion.pipeId}: ERROR`,
      error
    );
    toast.error(error.message || "บันทึกไม่สำเร็จ");
  } finally {
    applying.value = null;
  }
};

// Apply all suggestions
const applyAllSuggestions = async () => {
  // v1 mode: Check networkId
  // v2 mode: Check networkData
  if (!isV2Mode.value && !props.networkId) return;

  applyingAll.value = true;

  try {
    if (isV2Mode.value && props.networkData) {
      // v2 mode: Update all pipes in networkData
      const pipesToUpdate = suggestions.value.filter(s => s.suggestedSize);

      for (const suggestion of pipesToUpdate) {
        const pipe = props.networkData.pipes.find((p: any) => p.id === suggestion.pipeId);
        if (pipe) {
          pipe.nominalSize = suggestion.suggestedSize.mm;
        }
      }

      console.log(`[V2] Updated ${pipesToUpdate.length} pipes in networkData`);

      // Recalculate analysis locally
      await analyzePipesV2();

      // Emit event to parent to save to version snapshot
      emit('networkChange', props.networkData);

      toast.success(`ปรับปรุงท่อทั้งหมด ${pipesToUpdate.length} ท่อเรียบร้อย`);
    } else {
      // v1 mode: Call API
      const updatedPipes = await autoSuggestApi.applyAll(props.networkId);

      // Refresh analysis
      await analyzePipes();

      toast.success(`ปรับปรุงท่อทั้งหมด ${updatedPipes.length} ท่อเรียบร้อย`);
    }
  } catch (error: any) {
    toast.error(error.message || "บันทึกไม่สำเร็จ");
  } finally {
    applyingAll.value = false;
  }
};

// ===== UI HELPER FUNCTIONS =====

const getStatusBorderClass = (status: string) => {
  switch (status) {
    case "OK":
      return "border-green-200 bg-green-50";
    case "WARNING":
      return "border-yellow-200 bg-yellow-50";
    case "CRITICAL":
      return "border-red-200 bg-red-50";
    default:
      return "border-gray-200";
  }
};

const getStatusBgClass = (status: string) => {
  switch (status) {
    case "OK":
      return "bg-green-100";
    case "WARNING":
      return "bg-yellow-100";
    case "CRITICAL":
      return "bg-red-100";
    default:
      return "bg-gray-100";
  }
};

const getStatusIconClass = (status: string) => {
  switch (status) {
    case "OK":
      return "text-green-600";
    case "WARNING":
      return "text-yellow-600";
    case "CRITICAL":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getStatusTextClass = (status: string) => {
  switch (status) {
    case "OK":
      return "text-green-700";
    case "WARNING":
      return "text-yellow-700";
    case "CRITICAL":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "OK":
      return "ปกติดี";
    case "WARNING":
      return "ต้องตรวจสอบ";
    case "CRITICAL":
      return "ต้องปรับปรุง";
    default:
      return "ไม่ทราบสถานะ";
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "OK":
      return "bg-green-100 text-green-800";
    case "WARNING":
      return "bg-yellow-100 text-yellow-800";
    case "CRITICAL":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getVelocityColor = (velocity: number) => {
  if (velocity < VELOCITY_MIN) return "text-yellow-600";
  if (velocity > VELOCITY_MAX) return "text-red-600";
  return "text-green-600";
};

const getFrictionLossColor = (frictionLoss: number) => {
  if (frictionLoss > MAX_FRICTION_LOSS) return "text-red-600";
  if (frictionLoss > MAX_FRICTION_LOSS / 2) return "text-yellow-600";
  return "text-green-600";
};

// ===== V2 MODE: Local Analysis from networkData =====
const analyzePipesV2 = async () => {
  console.log("[AutoSuggest V2] 📍 analyzePipesV2() called - versionId:", props.versionId);

  if (!props.networkData || !props.networkData.pipes || props.networkData.pipes.length === 0) {
    console.warn("[AutoSuggest V2] ⚠️ No pipes in networkData");
    toast.error("ไม่พบข้อมูล Network");
    return;
  }

  analyzing.value = true;

  try {
    console.log("[AutoSuggest V2] 📍 Loading project criteria...");
    await loadProjectCriteria();
    console.log("[AutoSuggest V2] ✅ Criteria loaded:", projectCriteria.value);

    // Load fixtures data from version.snapshotFixtures (v2 mode)
    let fixturesData: any[] = [];

    // First try to load from versionData prop (preferred v2 method)
    if (props.versionData?.snapshotFixtures) {
      try {
        const fixturesSnapshot = JSON.parse(props.versionData.snapshotFixtures);
        // Extract pipe data from fixtures snapshot - pipes array is at root level
        if (fixturesSnapshot.pipes && Array.isArray(fixturesSnapshot.pipes)) {
          fixturesData = fixturesSnapshot.pipes.map((pipe: any) => ({
            pipeId: pipe.pipeId,
            totalFU: pipe.totalFU || 0,
            hunterGPM: pipe.hunterGPM || 0,
            hoseBibbGPM: pipe.hoseBibbGPM || 0,
            fixtureGroups: pipe.fixtureGroups || []
          }));
          console.log(`✅ [V2] Loaded fixtures data from version.snapshotFixtures (${fixturesData.length} ท่อ)`);
        } else {
          console.warn("⚠️ [V2] snapshotFixtures.pipes not found or not an array");
        }
      } catch (e) {
        console.error("❌ [V2] Failed to parse version.snapshotFixtures:", e);
      }
    }

    // Fallback: Try localStorage (for backward compatibility)
    if (fixturesData.length === 0 && typeof window !== "undefined" && props.projectId) {
      const storageKey = `pipeGPMData_${props.projectId}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        try {
          fixturesData = JSON.parse(savedData);
          console.log(`✅ [V2] Loaded fixtures data from localStorage fallback (${fixturesData.length} ท่อ)`);
        } catch (e) {
          console.error("❌ [V2] ไม่สามารถอ่านข้อมูลจาก Step 4 ได้:", e);
        }
      }
    }

    if (fixturesData.length === 0) {
      console.warn("⚠️ [V2] No fixtures data found - analysis will have zero FU/GPM values");
    }

    // Process pipes from networkData
    const analyzedPipes = props.networkData.pipes.map((pipe: any) => {
      // Find fixtures data for this pipe
      const fixturesPipe = fixturesData.find((p: any) => p.pipeId === pipe.id);

      const fu = fixturesPipe?.totalFU || 0;
      const baseHunterGPM = fixturesPipe?.hunterGPM || 0;
      const hoseBibbGPM = fixturesPipe?.hoseBibbGPM || 0;
      const rawTotalGPM = baseHunterGPM + hoseBibbGPM;

      console.log(`[AutoSuggest V2] Pipe ${pipe.id}: FU=${fu}, HunterGPM=${baseHunterGPM.toFixed(2)}, HB=${hoseBibbGPM.toFixed(2)}`);

      // Apply Water Factor
      const waterFactorPercent = getWaterFactorPercent(fu);
      const adjustedHunterGPM = calculateAdjustedGPM(baseHunterGPM, fu);
      const adjustedGPM = adjustedHunterGPM + hoseBibbGPM;

      const flowM3S = gpmToM3S(adjustedGPM);
      const flowLPS = gpmToLPS(adjustedGPM);

      // Get pipe size
      const currentSizeMM = pipe.nominalSize || 15;
      const sizeInfo = PIPE_SIZES.find((s) => s.mm === currentSizeMM) || PIPE_SIZES[0];

      // Calculate internal diameter
      let internalDiameterM: number;
      const cFactor = pipe.cFactor || 150;

      if (cFactor === 150) {
        const pvcClass = projectCriteria.value?.pvcClass || 7;
        internalDiameterM = calculatePVCInternalDiameterWorstCase(currentSizeMM, pvcClass);
        console.log(`[AutoSuggest V2] Pipe ${pipe.id}: DN=${currentSizeMM}mm, PVC Class=${pvcClass}, ID=${internalDiameterM}m`);
      } else {
        internalDiameterM = sizeInfo.internalDiameterM;
      }

      // Calculate velocity and friction loss
      const velocity = calculateVelocity(flowM3S, internalDiameterM);
      const frictionLoss = calculateFrictionLoss(flowM3S, internalDiameterM, cFactor);
      const pipeLength = pipe.length || 1;
      const majorLoss = calculateMajorLoss(pipeLength, frictionLoss);

      // Determine status
      const status = determineStatus(velocity);

      // Generate warnings
      const warnings: string[] = [];
      if (velocity < VELOCITY_CRITICAL_LOW) {
        warnings.push("CRITICAL: Velocity extremely low - risk of sedimentation");
      } else if (velocity < VELOCITY_MIN) {
        warnings.push("WARNING: Velocity below minimum - may cause sedimentation");
      } else if (velocity > VELOCITY_CRITICAL_HIGH) {
        warnings.push("CRITICAL: Velocity extremely high - risk of water hammer");
      } else if (velocity > VELOCITY_MAX) {
        warnings.push("WARNING: Velocity above maximum - may cause noise");
      }

      if (frictionLoss > MAX_FRICTION_LOSS * 1.5) {
        warnings.push("CRITICAL: Friction loss extremely high");
      } else if (frictionLoss > MAX_FRICTION_LOSS) {
        warnings.push("WARNING: Friction loss above recommended");
      }

      // Get node labels
      const sourceNode = props.networkData.nodes?.find((n: any) => n.id === pipe.sourceNodeId);
      const targetNode = props.networkData.nodes?.find((n: any) => n.id === pipe.targetNodeId);
      const sourceLabel = sourceNode?.label || `J${pipe.sourceNodeId}`;
      const targetLabel = targetNode?.label || `J${pipe.targetNodeId}`;
      const segmentName = `${sourceLabel} → ${targetLabel}`;

      return {
        pipeId: pipe.id,
        segmentName: segmentName,
        fixtureUnits: fu,
        hunterGPM: rawTotalGPM,
        baseHunterGPM: baseHunterGPM,
        hoseBibbGPM: hoseBibbGPM,
        waterFactorPercent: waterFactorPercent,
        adjustedGPM: adjustedGPM,
        flowRate: {
          gpm: adjustedGPM,
          lps: flowLPS,
          m3s: flowM3S
        },
        currentSize: {
          mm: currentSizeMM,
          inches: sizeInfo.inches,
          internalDiameter: internalDiameterM
        },
        pipeLength: pipeLength,
        cFactor: cFactor,
        velocity: velocity,
        frictionLoss: frictionLoss,
        majorLoss: majorLoss,
        minorLoss: majorLoss * 0.3,
        staticHead: 0,
        totalLoss: majorLoss + majorLoss * 0.3,
        status: status,
        suggestedSize: null, // TODO: implement suggestion logic
        suggestedVelocity: null,
        suggestedFrictionLoss: null,
        reason: status === "OK" ? "Velocity อยู่ในช่วงปกติ" : `Velocity ${velocity.toFixed(2)} m/s (ควร 1.2-2.4)`,
        warnings: warnings,
        isCriticalPath: pipe.isCriticalPath || false,
        sourceNode: sourceNode || null,
        targetNode: targetNode || null
      };
    });

    const validPipes = analyzedPipes.filter((pipe) => pipe !== null);

    if (validPipes.length === 0) {
      toast.error("ไม่สามารถวิเคราะห์ข้อมูลท่อได้");
      analyzing.value = false;
      return;
    }

    // Separate into critical path and branch pipes
    const criticalPath = validPipes.filter((p) => p.isCriticalPath === true);
    const branchPipesData = validPipes.filter((p) => p.isCriticalPath !== true);

    // ✅ Sort pipes from end (fixtures) to start (source) - SAME LOGIC AS FIXTURES PAGE
    const sortedCriticalPath = sortPipesFromEndToStart(criticalPath);
    const sortedBranchPipes = sortPipesFromEndToStart(branchPipesData);

    console.log(`✅ [V2] Sorted ${sortedCriticalPath.length} critical pipes (farthest → nearest)`);
    console.log(`✅ [V2] Sorted ${sortedBranchPipes.length} branch pipes (farthest → nearest)`);

    suggestions.value = [
      ...sortedCriticalPath.map((p) => ({ ...p, pathType: "CRITICAL" })),
      ...sortedBranchPipes.map((p) => ({ ...p, pathType: "BRANCH" }))
    ];

    const criticalPathMajorLoss = criticalPath.reduce(
      (sum, pipe) => sum + (pipe.majorLoss || 0),
      0
    );
    emit("needMajorLoss", criticalPathMajorLoss);

    // Emit summary
    nextTick(() => {
      if (suggestions.value.length > 0) {
        const totalFU = suggestions.value.reduce((sum, s) => sum + (s.fixtureUnits || 0), 0);
        const maxPipeSize = Math.max(...suggestions.value.map(s => s.currentSize?.mm || 0));
        const criticalPathFlowRate = criticalPath.reduce((max, p) => {
          const flow = p.flowRate?.gpm || 0;
          return flow > max ? flow : max;
        }, 0);

        let totalFixtures = 0;
        fixturesData.forEach((pipe: any) => {
          if (pipe.fixtureGroups && Array.isArray(pipe.fixtureGroups)) {
            pipe.fixtureGroups.forEach((group: any) => {
              totalFixtures += group.count || 0;
            });
          }
        });

        const summary = {
          criticalPath: criticalPath.map((p) => ({
            segmentName: p.segmentName,
            sizeMM: p.currentSize.mm,
            sizeInches: p.currentSize.inches
          })),
          branch: branchPipesData.map((p) => ({
            segmentName: p.segmentName,
            sizeMM: p.currentSize.mm,
            sizeInches: p.currentSize.inches
          })),
          stats: {
            totalFixtures,
            totalFU,
            flowRate: criticalPathFlowRate.toFixed(2),
            maxPipeSize: maxPipeSize + "mm"
          }
        };
        emit("summaryChange", summary);
      }
    });

    summary.value = {
      total: validPipes.length,
      ok: validPipes.filter(p => p.status === "OK").length,
      warning: validPipes.filter(p => p.status === "WARNING").length,
      critical: validPipes.filter(p => p.status === "CRITICAL").length,
      needsUpsizing: validPipes.filter(p => p.status !== "OK").length
    };

    toast.success(
      `วิเคราะห์เสร็จสิ้น ${validPipes.length} ท่อ (Critical: ${criticalPath.length}, Branch: ${branchPipesData.length})`
    );
  } catch (error: any) {
    console.error("[AutoSuggest V2] Analysis error:", error);
    toast.error(error.message || "วิเคราะห์ไม่สำเร็จ");
  } finally {
    analyzing.value = false;
  }
};

// Auto-analyze on mount
onMounted(() => {
  console.log("[AutoSuggest] 🚀 Component mounted - networkId:", props.networkId, "versionId:", props.versionId, "projectId:", props.projectId, "isV2Mode:", isV2Mode.value);

  // Clear criteria cache to ensure we get the latest PVC Class
  if (props.projectId) {
    projectStore.clearProject(props.projectId);
    console.log(`[AutoSuggest] 🗑️ Cleared criteria cache for project ${props.projectId}`);
  }

  // 🛡️ Load staticHead from localStorage FIRST (browser-only, prevents hydration mismatch)
  if (typeof window !== "undefined") {
    const cacheKey = isV2Mode.value
      ? `staticHead_ver_${props.versionId}`  // v2: use versionId
      : `staticHead_net_${props.networkId}`;  // v1: use networkId

    const cachedHead = localStorage.getItem(cacheKey);
    if (cachedHead !== null) {
      staticHeadM.value = parseFloat(cachedHead);
      console.log(
        `[AutoSuggest] 📦 Loaded staticHead from localStorage (onMounted): ${staticHeadM.value} (key: ${cacheKey})`
      );
    }
  }

  // Start analyzing based on mode
  if (isV2Mode.value) {
    console.log("[AutoSuggest] ✅ V2 mode detected, starting local analysis from networkData...");
    analyzePipesV2();
  } else if (props.networkId) {
    console.log("[AutoSuggest] ✅ V1 mode detected, starting API analysis...");
    analyzePipes();
  } else {
    console.log("[AutoSuggest] ❌ No networkId or networkData provided, skipping analysis");
  }
});

// Watch for changes in suggestions and emit summary to parent
watch(
  suggestions,
  (newSuggestions) => {
    if (newSuggestions && newSuggestions.length > 0) {
      // 🔥 FIX: Safely extract critical and branch pipes
      const criticalPipes = newSuggestions.filter(
        (s) => s.pathType === "CRITICAL"
      );
      const branchPipeData = newSuggestions.filter(
        (s) => s.pathType === "BRANCH"
      );

      const summary = {
        criticalPath: criticalPipes.map((p) => ({
          segmentName: p.segmentName,
          sizeMM: p.currentSize.mm,
          sizeInches: p.currentSize.inches
        })),
        branch: branchPipeData.map((p) => ({
          segmentName: p.segmentName,
          sizeMM: p.currentSize.mm,
          sizeInches: p.currentSize.inches
        }))
      };
      emit("summaryChange", summary);
      console.log("[AutoSuggest] Summary emitted to parent:", summary);
    }
  },
  { deep: true }
);

// 🛡️ FORCE SAVE before unmount (prevents data loss when user navigates away quickly)
onBeforeUnmount(() => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    // Force save to DB immediately if user navigates away before 1 second debounce
    if (currentProjectId.value) {
      console.log("[AutoSuggest] 💾 Force saving to DB before unmount...");
      saveStaticHead();
    }
  }
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>
