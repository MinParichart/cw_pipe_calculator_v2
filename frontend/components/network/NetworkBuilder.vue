<template>
  <div class="h-screen flex flex-col">
    <!-- Top Toolbar -->
    <div
      class="bg-white border-b px-4 py-3 flex items-center gap-4 flex-shrink-0"
    >
      <h2 class="text-lg font-medium text-gray-900">Network Builder</h2>
      <div class="flex-1"></div>
      <button
        @click="showHelp = true"
        class="text-gray-400 hover:text-gray-600 transition"
        title="วิธีใช้งาน"
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <button
        @click="findCriticalPath"
        :disabled="!hasNodes || findingCriticalPath"
        class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        <svg
          class="h-4 w-4 mr-1 inline"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        {{ findingCriticalPath ? "กำลังหา..." : "หา Critical Path" }}
      </button>
      <button
        @click="saveNetwork"
        :disabled="saving"
        class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {{ saving ? "กำลังบันทึก..." : "บันทึก" }}
      </button>
    </div>

    <!-- Main Canvas Area -->
    <div class="flex-1 min-w-0 flex flex-col">
      <!-- Toolbar -->
      <div
        class="bg-gray-50 border-b px-4 py-2 flex items-center gap-4 flex-wrap flex-shrink-0"
      >
        <div class="text-sm font-medium text-gray-700">เพิ่ม:</div>
        <button
          v-for="nodeType in nodeTypes"
          :key="nodeType.type"
          @click="startAddNode(nodeType.type)"
          class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border transition-colors"
          :class="{
            'bg-primary-50 border-primary-500 text-primary-700':
              addingNodeType === nodeType.type,
            'bg-white border-gray-300 hover:bg-gray-100':
              addingNodeType !== nodeType.type
          }"
        >
          <span v-html="nodeType.icon"></span>
          <span>{{ nodeType.label }}</span>
        </button>

        <!-- Floor Selector (only show in 2-floor mode and when adding node) -->
        <div
          v-if="blueprints.length === 2 && addingNodeType"
          class="flex items-center gap-2 border-l border-gray-300 pl-4"
        >
          <span class="text-sm text-gray-600">ชั้น:</span>
          <select
            v-model="selectedFloorForNewNode"
            class="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white"
          >
            <option :value="0">{{ blueprints[0].floorText }}</option>
            <option :value="1">{{ blueprints[1].floorText }}</option>
          </select>
        </div>

        <div class="border-l border-gray-300 h-6 mx-2"></div>

        <!-- Blueprint Upload Section -->
        <div class="flex items-center gap-2">
          <button
            v-if="blueprints.length === 0"
            @click="triggerBlueprintUpload"
            class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>อัปโหลดแบบ</span>
          </button>
          <template v-else>
            <!-- Single calibration button for 1 floor -->
            <button
              v-if="blueprints.length === 1"
              @click="startCalibration(0)"
              class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>{{
                calibrating && calibratingFloor === 0
                  ? "กำลังสอบเทียบ..."
                  : scale && scale !== 50
                    ? `${scale} px/m`
                    : "สอบเทียบสเกล"
              }}</span>
            </button>

            <!-- Floor selector and calibration for 2 floors -->
            <template v-else>
              <!-- Swap Floors Button -->
              <button
                @click="swapFloors"
                class="flex items-center gap-1 px-2 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                title="สลับตำแหน่งชั้น"
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
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
                <span>สลับ</span>
              </button>

              <select
                v-model="selectedCalibrationFloor"
                class="px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
              >
                <option :value="0">{{ blueprints[0].floorText }}</option>
                <option :value="1">{{ blueprints[1].floorText }}</option>
              </select>
              <button
                @click="startCalibration(selectedCalibrationFloor)"
                class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span>{{
                  calibrating
                    ? "กำลังสอบเทียบ..."
                    : scale
                      ? `${scale} px/m`
                      : "สอบเทียบสเกล"
                }}</span>
              </button>
            </template>
            <button
              @click="clearBlueprints"
              class="text-red-500 hover:text-red-700 transition"
              title="ลบแบบทั้งหมด"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </template>

          <!-- Zoom Controls -->
          <div
            v-if="blueprints.length > 0"
            class="flex items-center gap-1 border-l border-gray-300 pl-2"
          >
            <button
              @click="zoomOut"
              class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition"
              title="ย่อ"
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
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span class="text-sm text-gray-600 min-w-[50px] text-center"
              >{{ Math.round(zoom * 100) }}%</span
            >
            <button
              @click="zoomIn"
              class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition"
              title="ขยาย"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <button
              @click="resetZoom"
              class="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              รีเซ็ต
            </button>
          </div>
        </div>

        <button
          v-if="addingNodeType"
          @click="cancelAddNode"
          class="ml-auto text-sm text-gray-500 hover:text-gray-700"
        >
          ยกเลิก
        </button>
      </div>

      <!-- Hidden file input -->
      <input
        ref="blueprintInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleBlueprintUpload"
      />

      <!-- Canvas Container with Zoom Wrapper -->
      <div class="flex-1 relative overflow-auto h-full w-full">
        <!-- Canvas Container -->
        <div
          ref="canvasContainerRef"
          class="flex-1 bg-gray-100 relative h-full w-full"
          :class="{
            flex: blueprints.length === 2
          }"
        >
          <!-- Zoom Wrapper - หุ้ม Blueprint, Pipes, Nodes ทั้งหมด -->
          <div
            class="absolute inset-0 origin-top-left"
            :style="{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left'
            }"
          >
            <!-- Background Layer: Blueprints (z-index: 0) -->
            <div
              class="absolute inset-0"
              style="z-index: 0; pointer-events: none"
            >
              <!-- Single Blueprint -->
              <div
                v-if="blueprints.length === 1"
                class="absolute inset-0 opacity-60"
                :style="{
                  backgroundImage: `url(${blueprints[0].url})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }"
              ></div>

              <!-- Split Blueprints (2 floors) -->
              <template v-else-if="blueprints.length === 2">
                <div class="absolute inset-0 flex" style="opacity: 0.6">
                  <div
                    class="flex-1 border-r"
                    :style="{
                      backgroundImage: `url(${blueprints[0].url})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }"
                  ></div>
                  <div
                    class="flex-1"
                    :style="{
                      backgroundImage: `url(${blueprints[1].url})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }"
                  ></div>
                </div>
              </template>
            </div>

            <!-- Blueprint Labels -->
            <div
              v-if="blueprints.length > 0"
              style="z-index: 5; pointer-events: none"
            >
              <div v-if="blueprints.length === 1" class="absolute top-2 left-2">
                <div
                  class="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium shadow-sm"
                  :style="{ borderLeft: `3px solid ${getLayerColor(0)}` }"
                >
                  {{ blueprints[0].floorText }}
                </div>
              </div>
              <template v-else>
                <div class="absolute top-2 left-2">
                  <div
                    class="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium shadow-sm"
                    :style="{ borderLeft: `3px solid ${getLayerColor(0)}` }"
                  >
                    {{ blueprints[0].floorText }}
                  </div>
                </div>
                <div class="absolute top-2 right-2">
                  <div
                    class="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium shadow-sm"
                    :style="{ borderLeft: `3px solid ${getLayerColor(1)}` }"
                  >
                    {{ blueprints[1].floorText }}
                  </div>
                </div>
              </template>

              <!-- MOCK UI Indicator: Pipe Size Labels Mock -->
              <div class="absolute bottom-2 left-2">
                <div class="bg-blue-50 bg-opacity-95 px-3 py-2 rounded-lg border-2 border-blue-300 shadow-sm">
                  <div class="flex items-center gap-2">
                    <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="text-xs">
                      <p class="font-bold text-blue-900">MOCK: ขนาดท่อ (Pipe Sizes)</p>
                      <p class="text-blue-700">แสดงขนาดท่อที่คำนวณจาก Step 5</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End MOCK UI Indicator -->
            </div>

            <!-- Foreground Layer: Interactive Canvas (z-index: 10) -->
            <div
              ref="canvasRef"
              class="absolute inset-0 cursor-default"
              style="z-index: 10"
              @click="
                calibrating
                  ? handleCanvasClickForCalibration(
                      $event,
                      calibratingFloor ?? 0
                    )
                  : handleCanvasClick($event, calibratingFloor ?? 0)
              "
              @mousemove="handleCanvasMouseMove($event, calibratingFloor ?? 0)"
            >
              <!-- Calibration Overlay -->
              <div
                v-if="calibrating"
                class="absolute inset-0 bg-orange-500 bg-opacity-10 pointer-events-none flex items-center justify-center"
                style="z-index: 20"
              >
                <p class="text-orange-700 font-semibold">
                  {{
                    calibrationStep === 0
                      ? "คลิกจุดแรก"
                      : calibrationStep === 1
                        ? "คลิกจุดที่สอง"
                        : "ใส่ระยะห่างจริง"
                  }}
                </p>
              </div>

              <!-- Calibration Points -->
              <div
                v-if="calibrating && calibrationPoints.length > 0"
                class="absolute inset-0 pointer-events-none"
                style="z-index: 25"
              >
                <div
                  v-for="(point, index) in calibrationPoints"
                  :key="index"
                  class="absolute w-6 h-6 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-xs font-bold"
                  :style="{ left: `${point.x}px`, top: `${point.y}px` }"
                >
                  {{ index + 1 }}
                </div>
                <!-- Direct line between calibration points -->
                <svg
                  v-if="calibrationPoints.length === 2"
                  class="absolute inset-0 pointer-events-none"
                  style="z-index: 26"
                  width="100%"
                  height="100%"
                  overflow="visible"
                >
                  <defs>
                    <marker
                      id="calibration-arrowhead-end"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 9 3, 0 6" fill="#f97316" />
                    </marker>
                  </defs>
                  <line
                    :x1="calibrationPoints[0].x"
                    :y1="calibrationPoints[0].y"
                    :x2="calibrationPoints[1].x"
                    :y2="calibrationPoints[1].y"
                    stroke="#f97316"
                    stroke-width="3"
                    stroke-dasharray="8,4"
                    marker-end="url(#calibration-arrowhead-end)"
                  />
                  <!-- Distance label background -->
                  <rect
                    :x="
                      (calibrationPoints[0].x + calibrationPoints[1].x) / 2 - 40
                    "
                    :y="
                      (calibrationPoints[0].y + calibrationPoints[1].y) / 2 - 12
                    "
                    width="80"
                    height="24"
                    fill="rgba(255, 255, 255, 0.9)"
                    rx="4"
                  />
                  <!-- Distance label text -->
                  <text
                    :x="(calibrationPoints[0].x + calibrationPoints[1].x) / 2"
                    :y="
                      (calibrationPoints[0].y + calibrationPoints[1].y) / 2 + 5
                    "
                    text-anchor="middle"
                    font-size="12"
                    font-weight="bold"
                    fill="#f97316"
                  >
                    {{
                      Math.round(
                        Math.sqrt(
                          Math.pow(
                            calibrationPoints[1].x - calibrationPoints[0].x,
                            2
                          ) +
                            Math.pow(
                              calibrationPoints[1].y - calibrationPoints[0].y,
                              2
                            )
                        )
                      )
                    }}px
                  </text>
                </svg>
              </div>

              <!-- Empty State / Instructions -->
              <div
                v-if="!hasNodes && !addingNodeType"
                class="absolute inset-0 flex items-center justify-center"
                style="z-index: 15; pointer-events: none"
              >
                <div class="text-center">
                  <svg
                    class="mx-auto h-16 w-16 text-gray-400 mb-4"
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
                  <h3 class="text-lg font-medium text-gray-700 mb-2">
                    เริ่มสร้างแผนภาพท่อ
                  </h3>
                  <div class="text-sm text-gray-500 space-y-1">
                    <p>1. คลิก "เพิ่ม จุดเริ่มต้น" เพื่อวางจุดเริ่มต้นระบบ</p>
                    <p>2. คลิกที่ Node → กดปุ่ม "เชื่อมท่อ" ที่ Sidebar</p>
                    <p>3. คลิกที่ Node อื่นเพื่อเชื่อมท่อ</p>
                  </div>
                </div>
              </div>

              <!-- Drawing Mode Instruction -->
              <div
                v-if="drawingPipeFrom"
                class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
                style="z-index: 30; pointer-events: none"
              >
                <div class="flex items-center gap-2 text-sm">
                  <svg
                    class="h-4 w-4 animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <span
                    >คลิกที่ Node ปลายทางเพื่อเชื่อมท่อ | กด ESC
                    เพื่อยกเลิก</span
                  >
                </div>
              </div>

              <!-- Pipes (SVG lines) - ALL pipes -->
              <svg
                class="absolute inset-0 w-full h-full pointer-events-none"
                style="z-index: 1"
                overflow="visible"
              >
                <g
                  v-for="pipe in pipes"
                  :key="pipe.id"
                  @click.stop="selectPipe(pipe)"
                  @mousedown.stop="startDragPipe(pipe, $event)"
                  class="cursor-pointer"
                  :style="{
                    pointerEvents: 'auto',
                    cursor: getPipeCursor(pipe)
                  }"
                  :class="{ 'stroke-warning-500': pipe.isCriticalPath }"
                >
                  <polyline
                    :points="getOrthogonalPathPoints(pipe)"
                    fill="none"
                    :stroke="
                      pipe.isCriticalPath
                        ? '#F59E0B'
                        : selectedPipe?.id === pipe.id
                          ? '#FF2C2C'
                          : '#3B82F6 '
                    "
                    :stroke-width="
                      pipe.isCriticalPath || selectedPipe?.id === pipe.id
                        ? 3
                        : 2
                    "
                    stroke-dasharray="5,5"
                  />

                  <g
                    :transform="`translate(${getOrthogonalMidpoint(pipe).x}, ${getOrthogonalMidpoint(pipe).y}) rotate(${getPipeAngle(pipe)})`"
                  >
                    <polygon
                      points="-6,-5 8,0 -6,5"
                      :fill="
                        pipe.isCriticalPath
                          ? '#F59E0B'
                          : selectedPipe?.id === pipe.id
                            ? '#FF2C2C'
                            : '#3B82F6'
                      "
                    />
                  </g>

                  <text
                    :x="getOrthogonalMidpoint(pipe).x"
                    :y="getOrthogonalMidpoint(pipe).y - 12"
                    class="text-xs fill-gray-600 font-medium"
                    text-anchor="middle"
                  >
                    {{ pipe.length.toFixed(1) }}m
                  </text>

                  <!-- Pipe Size Label (แสดงขนาดท่อจริง) -->
                  <text
                    :x="getOrthogonalMidpoint(pipe).x"
                    :y="getOrthogonalMidpoint(pipe).y + 20"
                    class="text-xs fill-blue-600 font-bold"
                    text-anchor="middle"
                    style="text-shadow: 1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white;"
                  >
                    {{ formatPipeSize(pipe.nominalSize) }}
                  </text>
                  <!-- End Pipe Size Label -->
                </g>
              </svg>

              <!-- Temp line while drawing pipe -->
              <svg
                v-if="drawingPipeFrom"
                class="absolute inset-0 w-full h-full pointer-events-none"
                style="z-index: 2"
                overflow="visible"
              >
                <defs>
                  <marker
                    id="arrowhead-temp"
                    markerWidth="12"
                    markerHeight="8"
                    refX="10"
                    refY="4"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 12 4, 0 8"
                      fill="#DC2626"
                      stroke="#FFFFFF"
                      stroke-width="1"
                    />
                  </marker>
                </defs>
                <polyline
                  :points="getTempOrthogonalPathPoints()"
                  fill="none"
                  stroke="#9CA3AF"
                  stroke-width="2"
                  stroke-dasharray="5,5"
                  :marker-end="'url(#arrowhead-temp)'"
                />
                <!-- Additional arrow at middle for visibility -->
                <g
                  :transform="`translate(${getTempPipeMidpoint().x}, ${getTempPipeMidpoint().y}) rotate(${getTempPipeAngle()})`"
                >
                  <polygon
                    points="0 0, 12 4, 0 8"
                    fill="#DC2626"
                    stroke="#FFFFFF"
                    stroke-width="1"
                  />
                </g>
              </svg>

              <!-- Nodes - ALL nodes -->
              <div
                v-for="node in nodes"
                :key="node.id"
                class="absolute transform -translate-x-1/2 -translate-y-1/2 transition-shadow"
                :class="{
                  'ring-4 ring-blue-500 ring-offset-2':
                    drawingPipeFrom === node.id,
                  'ring-2 ring-primary-500 ring-offset-2':
                    selectedNodeId === node.id && drawingPipeFrom !== node.id,
                  'hover:shadow-lg':
                    selectedNodeId !== node.id && drawingPipeFrom !== node.id,
                  'cursor-move': !drawingPipeFrom,
                  'cursor-pointer': drawingPipeFrom
                }"
                :style="{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  zIndex: 10,
                  pointerEvents: 'auto'
                }"
                @click.stop="selectNode(node)"
                @mousedown.stop="startDragNode(node, $event)"
                :data-node-id="node.id"
                :data-node-type="node.type"
              >
                <div
                  class="flex items-center justify-center w-4 h-4 rounded-full border-2 shadow-sm"
                  :class="getNodeClass(node)"
                >
                  <span
                    v-html="getNodeIcon(node.type)"
                    class="text-white text-sm"
                  ></span>
                </div>
                <div
                  v-if="node.label"
                  class="absolute top-full mt-1 text-xs font-medium text-gray-700 whitespace-nowrap bg-white px-1 rounded"
                >
                  {{ node.label }}
                </div>
                <div
                  v-if="getNodeFixtureCount(node) > 0"
                  class="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {{ getNodeFixtureCount(node) }}
                </div>
              </div>

              <!-- Hover indicator for adding node -->
              <div
                v-if="addingNodeType"
                class="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-50"
                :style="{
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y}px`,
                  zIndex: 5,
                  pointerEvents: 'none'
                }"
              >
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-primary-500 bg-primary-50"
                >
                  <span
                    v-html="getNodeTypeIcon(addingNodeType)"
                    class="text-primary-500 text-sm"
                  ></span>
                </div>
              </div>

              <!-- Scale indicator -->
              <div
                class="absolute bottom-2 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded"
                style="pointer-events: none"
              >
                Scale: {{ scale }} pixels/m
              </div>
            </div>
          </div>
          <!-- End Zoom Wrapper -->
        </div>
        <!-- End Canvas Container -->

        <!-- Floating Editor Panel (อยู่นอก Zoom Wrapper และ Canvas Container) -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-[-10px]"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-[-10px]"
        >
          <div
            v-if="selectedNode || selectedPipe"
            class="w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
            :style="{
              position: 'fixed',
              left: panelPos.x + 'px',
              top: panelPos.y + 'px',
              cursor: isDraggingPanel ? 'grabbing' : 'default'
            }"
          >
            <!-- Panel Header (Drag Handle) -->
            <div
              class="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between select-none"
              style="cursor: grab"
              @mousedown="startDragPanel"
            >
              <div class="flex items-center gap-2">
                <svg
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
                <h3 class="text-sm font-medium text-gray-900">
                  {{ selectedNode ? "แก้ไข Node" : "แก้ไขท่อ (Pipe)" }}
                </h3>
              </div>
              <button
                @click="closeFloatingPanel"
                class="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                title="ปิด"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Panel Content -->
            <div
              class="p-3 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <!-- Node Editor -->
              <template v-if="selectedNode">
                <!-- Node Type Display -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >ประเภท</label
                  >
                  <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div
                      class="w-5 h-5 rounded-full flex items-center justify-center"
                      :class="getNodeClass(selectedNode)"
                    >
                      <span
                        v-html="getNodeIcon(selectedNode.type)"
                        class="text-white text-xs"
                      ></span>
                    </div>
                    <span class="text-xs text-gray-700">{{
                      getNodeTypeName(selectedNode.type)
                    }}</span>
                  </div>
                </div>

                <!-- Node Label -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >ชื่อ (ไม่บังคับ)</label
                  >
                  <input
                    v-model="selectedNode.label"
                    @blur="updateNodeLabel"
                    type="text"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
                    placeholder="เช่น ห้องน้ำชั้น 2"
                  />
                </div>

                <!-- Node Elevation -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >ระดับความสูง (เมตร)</label
                  >
                  <input
                    v-model.number="selectedNode.elevation"
                    @blur="updateNodeElevation"
                    type="number"
                    step="0.1"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
                    placeholder="0"
                  />
                </div>

                <!-- Fixtures (if fixture node) -->
                <div v-if="selectedNode.type === 'FIXTURE'">
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >สุขภัณฑ์</label
                  >
                  <div class="p-2 bg-blue-50 rounded">
                    <!-- Fixtures Summary -->
                    <div
                      v-if="selectedNodeFixturesSummary.length > 0"
                      class="space-y-1.5 mb-2"
                    >
                      <div
                        v-for="item in selectedNodeFixturesSummary"
                        :key="item.name"
                        class="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-blue-100"
                      >
                        <div class="flex-1">
                          <div class="font-medium text-gray-800">
                            {{ item.name }}
                          </div>
                          <div class="text-gray-500 text-[10px]">
                            FU: {{ item.fu }} ต่อชิ้น
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="font-semibold text-blue-600">
                            {{ item.quantity }} ชิ้น
                          </div>
                          <div class="text-gray-600 text-[10px]">
                            รวม: {{ item.totalFU.toFixed(1) }} FU
                          </div>
                        </div>
                      </div>

                      <!-- Total FU -->
                      <div
                        class="flex items-center justify-between bg-blue-100 p-2 rounded mt-2"
                      >
                        <span class="font-bold text-xs text-gray-800"
                          >รวมทั้งหมด:</span
                        >
                        <span class="font-bold text-sm text-blue-700"
                          >{{ selectedNodeTotalFU.toFixed(1) }} FU</span
                        >
                      </div>
                    </div>

                    <!-- No fixtures message -->
                    <div v-else class="text-xs text-gray-500 italic mb-2">
                      ยังไม่มีสุขภัณฑ์
                    </div>

                    <!-- Action buttons -->
                    <div class="space-y-1.5">
                      <button
                        @click="openFixtureModal(selectedNode)"
                        class="w-full px-2 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        {{
                          selectedNodeTotalFixturesCount === 0
                            ? "เพิ่มสุขภัณฑ์"
                            : `แก้ไขสุขภัณฑ์ (${selectedNodeTotalFixturesCount} ชิ้น)`
                        }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Connected Pipes -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >ท่อที่เชื่อม</label
                  >
                  <div class="space-y-1.5">
                    <div
                      v-for="pipe in getNodePipes(selectedNode.id)"
                      :key="pipe.id"
                      class="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs"
                    >
                      <span class="text-gray-700"
                        >ไปยัง Node
                        {{ getOtherNodeLabel(pipe, selectedNode.id) }}</span
                      >
                      <span class="text-gray-500"
                        >{{ pipe.length.toFixed(1) }}m</span
                      >
                    </div>
                    <div
                      v-if="getNodePipes(selectedNode.id).length === 0"
                      class="text-xs text-gray-400 text-center py-1"
                    >
                      ไม่มีท่อเชื่อม
                    </div>
                  </div>
                </div>

                <!-- Connect Pipe Button -->
                <div v-if="canConnectFrom(selectedNode)">
                  <button
                    @click="startDrawPipeFromSelectedNode"
                    class="w-full px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <svg
                      class="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    เชื่อมท่อ
                  </button>
                </div>

                <!-- Delete Node Button -->
                <button
                  @click="deleteSelectedNode"
                  class="w-full px-3 py-1.5 border border-red-300 text-red-700 rounded hover:bg-red-50 text-xs font-medium"
                >
                  ลบ Node
                </button>
              </template>

              <!-- Pipe Editor -->
              <template v-else-if="selectedPipe">
                <!-- Source & Target -->
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >จาก</label
                    >
                    <div class="p-1.5 bg-gray-50 rounded text-xs text-gray-700">
                      {{ getNodeLabelById(selectedPipe.sourceNodeId) }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >ไป</label
                    >
                    <div class="p-1.5 bg-gray-50 rounded text-xs text-gray-700">
                      {{ getNodeLabelById(selectedPipe.targetNodeId) }}
                    </div>
                  </div>
                </div>

                <!-- Pipe Length (Editable) -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >ความยาวท่อ (เมตร)</label
                  >
                  <input
                    v-model.number="selectedPipe.length"
                    @blur="updatePipeLength"
                    type="number"
                    step="0.1"
                    min="0.1"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
                    placeholder="เช่น 3.5"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    💡 วัด: {{ calculatedPipeLength.toFixed(1) }}m
                  </p>
                </div>

                <!-- Pipe Size -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >ขนาดท่อ</label
                  >
                  <select
                    v-model="selectedPipe.nominalSize"
                    @change="updatePipeSize"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
                  >
                    <option value="15">Ø15mm (1/2")</option>
                    <option value="20">Ø20mm (3/4")</option>
                    <option value="25">Ø25mm (1")</option>
                    <option value="32">Ø32mm (1 1/4")</option>
                    <option value="40">Ø40mm (1 1/2")</option>
                    <option value="50">Ø50mm (2")</option>
                  </select>
                </div>

                <!-- Material -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >วัสดุ</label
                  >
                  <div class="p-1.5 bg-gray-50 rounded text-xs text-gray-700">
                    {{ projectMaterial }}
                  </div>
                </div>

                <!-- C-Factor -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >C-Factor</label
                  >
                  <div class="p-1.5 bg-gray-50 rounded text-xs text-gray-700">
                    {{ projectCFactor }}
                  </div>
                </div>

                <!-- PVC Class (แสดงเฉพาะเมื่อเป็น PVC) -->
                <div v-if="projectCFactor === 150">
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >PVC Class</label
                  >
                  <div class="p-1.5 bg-blue-50 rounded text-xs text-blue-700 font-medium">
                    {{ projectParameters?.pvcClass || 7 }} bar
                  </div>
                </div>

                <!-- Critical Path Badge -->
                <div
                  v-if="selectedPipe.isCriticalPath"
                  class="p-2 bg-orange-50 border border-orange-200 rounded"
                >
                  <div class="flex items-center gap-1.5">
                    <svg
                      class="h-4 w-4 text-orange-500"
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
                    <span class="text-xs font-medium text-orange-900"
                      >Critical Path</span
                    >
                  </div>
                </div>

                <!-- Delete Pipe Button -->
                <button
                  @click="deleteSelectedPipe"
                  class="w-full px-3 py-1.5 border border-red-300 text-red-700 rounded hover:bg-red-50 text-xs font-medium"
                >
                  ลบท่อ
                </button>
              </template>
            </div>
          </div>
        </Transition>
      </div>
      <!-- End Canvas Container Wrapper -->

      <!-- Analysis Tabs -->
      <div class="mt-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              @click="activeTab = 'network'"
              :class="{
                'border-primary-500 text-primary-600': activeTab === 'network',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                  activeTab !== 'network'
              }"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              <svg
                class="h-4 w-4 inline mr-1"
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
              Network Diagram
            </button>
            <button
              @click="activeTab = 'hybrid'"
              :class="{
                'border-primary-500 text-primary-600': activeTab === 'hybrid',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                  activeTab !== 'hybrid'
              }"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              <svg
                class="h-4 w-4 inline mr-1"
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
              Hybrid Sizing
            </button>
            <button
              @click="activeTab = 'autosuggest'"
              :class="{
                'border-primary-500 text-primary-600':
                  activeTab === 'autosuggest',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                  activeTab !== 'autosuggest'
              }"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              <svg
                class="h-4 w-4 inline mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Auto-Suggest
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="mt-4">
          <!-- Network Diagram Tab -->
          <div v-show="activeTab === 'network'" class="space-y-4">
            <!-- Network info -->
            <div
              v-if="nodes.length > 0 || pipes.length > 0"
              class="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">
                  {{ nodes.length }}
                </div>
                <div class="text-xs text-gray-600">Nodes</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">
                  {{ pipes.length }}
                </div>
                <div class="text-xs text-gray-600">Pipes</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">
                  {{ pipes.filter((p) => p.isCriticalPath).length }}
                </div>
                <div class="text-xs text-gray-600">Critical Path</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div class="text-2xl font-bold text-gray-900">
                  {{ pipes.reduce((sum, p) => sum + p.length, 0).toFixed(1) }}m
                </div>
                <div class="text-xs text-gray-600">Total Length</div>
              </div>
            </div>
          </div>

          <!-- Hybrid Sizing Tab -->
          <div v-show="activeTab === 'hybrid'">
            <HybridPipeSizing
              :network-id="networkId"
              :system-type="systemType"
              @select="onHybridSelect"
              @apply="onHybridApply"
            />
          </div>

          <!-- Auto-Suggest Tab -->
          <div v-show="activeTab === 'autosuggest'">
            <AutoSuggestUpsizing
              :network-id="networkId"
              :system-type="systemType"
            />
          </div>
        </div>
      </div>

      <!-- Help Modal -->
      <div
        v-if="showHelp"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="showHelp = false"
      >
        <div
          class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">
              วิธีใช้งาน Network Builder
            </h3>
            <button
              @click="showHelp = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="h-6 w-6"
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

          <div class="space-y-6">
            <!-- Step 1 -->
            <div class="flex gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold"
              >
                1
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">
                  เพิ่มจุดเริ่มต้น (Source)
                </h4>
                <p class="text-sm text-gray-600 mb-2">
                  คลิกปุ่ม "จุดเริ่มต้น" ด้านบน แล้วคลิกบน Canvas
                  เพื่อวางจุดเริ่มต้นของระบบท่อ
                </p>
                <div
                  class="flex items-center gap-2 text-xs bg-gray-100 p-2 rounded"
                >
                  <span class="bg-blue-500 text-white px-2 py-0.5 rounded"
                    >สีฟ้า</span
                  >
                  <span>= จุดเริ่มต้น (Source)</span>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold"
              >
                2
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">
                  เพิ่มจุดเชื่อม (Junction) / สุขภัณฑ์ (Fixture)
                </h4>
                <p class="text-sm text-gray-600 mb-2">
                  คลิกปุ่ม "จุดเชื่อม" หรือ "สุขภัณฑ์" แล้วคลิกบน Canvas
                  เพื่อวางจุดต่างๆ
                </p>
                <div class="flex gap-2 text-xs">
                  <span class="bg-gray-500 text-white px-2 py-0.5 rounded"
                    >สีเทา</span
                  >
                  <span>= จุดเชื่อม (Junction)</span>
                  <span class="bg-primary-500 text-white px-2 py-0.5 rounded"
                    >สีม่วง</span
                  >
                  <span>= สุขภัณฑ์ (Fixture)</span>
                </div>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="flex gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold"
              >
                3
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">
                  เชื่อมท่อ (Pipe)
                </h4>
                <p class="text-sm text-gray-600 mb-2">
                  คลิกที่ Node → กดปุ่ม "เชื่อมท่อ" ที่ Sidebar → คลิกที่ Node
                  ปลายทาง
                </p>
                <div
                  class="text-xs bg-yellow-50 border border-yellow-200 p-2 rounded text-yellow-800"
                >
                  💡 เส้นท่อสามารถแก้ไขความยาวได้ที่ Sidebar
                </div>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="flex gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold"
              >
                4
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">
                  เพิ่มสุขภัณฑ์ (Fixtures)
                </h4>
                <p class="text-sm text-gray-600 mb-2">
                  คลิกขวาที่ Node ประเภท "สุขภัณฑ์" → เลือก "แก้ไข" →
                  เลือกประเภทสุขภัณฑ์
                </p>
              </div>
            </div>

            <!-- Step 5 -->
            <div class="flex gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold"
              >
                5
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">
                  อัปโหลดแบบ (Blueprint)
                </h4>
                <p class="text-sm text-gray-600 mb-2">
                  คลิก "อัปโหลดแบบ" เพื่อใช้แปลนเป็นฐานในการวาด
                </p>
                <div
                  class="text-xs bg-blue-50 border border-blue-200 p-2 rounded text-blue-800"
                >
                  💡 หลังอัปโหลด แล้วกด "สอบเทียบสเกล" เพื่อระบุสเกลที่ถูกต้อง
                </div>
              </div>
            </div>

            <!-- Step 6 -->
            <div class="flex gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold"
              >
                6
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">
                  หา Critical Path และคำนวณ
                </h4>
                <p class="text-sm text-gray-600">
                  กด "หา Critical Path"
                  เพื่อให้ระบบหาเส้นทางที่ยาวที่สุดอัตโนมัติ
                </p>
              </div>
            </div>

            <!-- Keyboard Shortcuts -->
            <div class="border-t pt-4">
              <h4 class="font-semibold text-gray-900 mb-2">ปุ่มลัด</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="flex items-center gap-2">
                  <kbd class="bg-gray-100 px-2 py-1 rounded text-xs">ESC</kbd>
                  <span class="text-gray-600">ยกเลิกการวาด</span>
                </div>
                <div class="flex items-center gap-2">
                  <kbd class="bg-gray-100 px-2 py-1 rounded text-xs"
                    >Click + Drag</kbd
                  >
                  <span class="text-gray-600">ย้าย Node</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calibration Floating Panel -->
      <div
        v-if="calibrating"
        class="fixed top-20 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm w-full z-50 border-2 border-orange-300"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-orange-700">สอบเทียบสเกล</h3>
          <button
            @click="cancelCalibration"
            class="text-gray-400 hover:text-gray-600"
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

        <!-- Step 0 & 1: Clicking points -->
        <div v-if="calibrationStep <= 1" class="text-sm text-gray-700">
          <p class="mb-2">
            <span v-if="calibrationStep === 0">📍 คลิกจุดแรกบนแผนภาพ</span>
            <span v-else>📍 คลิกจุดที่สอง</span>
          </p>
          <p class="text-xs text-gray-500">
            เลือก 2 จุดที่รู้ระยะห่างจริง เพื่อระบุสเกล
          </p>
        </div>

        <!-- Step 2: Enter distance -->
        <div v-else-if="calibrationStep === 2">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >ระยะห่างจริง (เมตร)</label
          >
          <input
            v-model.number="knownDistance"
            type="number"
            min="0.1"
            step="0.1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="เช่น 2.5"
          />
          <p class="text-xs text-gray-500 mt-2">
            ระยะวัดได้: {{ Math.round(calibrationDistance * 100) / 100 }} pixels
          </p>
          <div class="flex gap-2 mt-4">
            <button
              @click="cancelCalibration"
              class="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              @click="applyCalibration"
              class="flex-1 px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>

      <!-- Blueprint Upload Modal -->
      <div
        v-if="showBlueprintUpload"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="showBlueprintUpload = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
          <h3 class="text-lg font-medium text-gray-900 mb-4">อัปโหลดแบบแปลน</h3>
          <p class="text-sm text-gray-600 mb-4">
            อัปโหลดรูปแบบแปลน (Blueprint) ของระบบท่อเพื่อใช้เป็นฐานในการวาด
            Network
          </p>

          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition cursor-pointer"
            @click="triggerBlueprintUpload"
          >
            <svg
              class="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p class="text-sm text-gray-600 mb-2">คลิกเพื่ออัปโหลดไฟล์รูป</p>
            <p class="text-xs text-gray-500">รองรับ: JPG, PNG, PDF</p>
          </div>

          <div class="mt-4 flex justify-end">
            <button
              @click="showBlueprintUpload = false"
              class="btn btn-secondary"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>

      <!-- Fixture Assignment Modal -->
      <div
        v-if="showFixtureModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900">เพิ่มสุขภัณฑ์</h3>
              <p class="text-sm text-gray-600 mt-1">
                Node: {{ selectedNode?.label || `ID: ${selectedNode?.id}` }}
              </p>
            </div>
            <button
              @click="closeFixtureModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="h-6 w-6"
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

          <!-- Fixture Catalog -->
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- WC Section -->
              <div class="border rounded-lg p-4">
                <h4
                  class="font-semibold text-gray-900 mb-3 flex items-center gap-2"
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  โถส้วม (WC)
                </h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700"
                      >Flush Tank (ถังน้ำ)</span
                    >
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">FU: 3</span>
                      <button
                        @click="addFixture('WC_TANK')"
                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700"
                      >Flush Valve (ลูกสูบ)</span
                    >
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">FU: 6</span>
                      <button
                        @click="addFixture('WC_VALVE')"
                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lavatory & Sink -->
              <div class="border rounded-lg p-4">
                <h4
                  class="font-semibold text-gray-900 mb-3 flex items-center gap-2"
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  อ่างล้างหน้า & อ่างอาบ
                </h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700"
                      >Lavatory (อ่างล้างหน้า)</span
                    >
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">FU: 1</span>
                      <button
                        @click="addFixture('LAVATORY')"
                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700"
                      >Bathtub (อ่างอาบน้ำ)</span
                    >
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">FU: 2</span>
                      <button
                        @click="addFixture('BATHTUB')"
                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700">Shower (ฝักบัว)</span>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">FU: 2</span>
                      <button
                        @click="addFixture('SHOWER')"
                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- HB Fixtures (ก๊อกน้ำล้างพื้น) -->
              <div class="border rounded-lg p-4 border-green-200 bg-green-50">
                <h4
                  class="font-semibold text-gray-900 mb-3 flex items-center gap-2"
                >
                  <svg
                    class="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  ภายนอกอาคาร (External)
                </h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700"
                      >Hose Bibb (ก๊อกน้ำล้างพื้น)</span
                    >
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">5 GPM</span>
                      <button
                        @click="addFixture('HOSE_BIBB')"
                        class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Kitchen & Laundry -->
              <div class="border rounded-lg p-4">
                <h4
                  class="font-semibold text-gray-900 mb-3 flex items-center gap-2"
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  ครัว & ซักผ้า
                </h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700"
                      >Kitchen Sink (อ่างล้างจาน)</span
                    >
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">FU: 2</span>
                      <button
                        @click="addFixture('KITCHEN_SINK')"
                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700"
                      >Laundry Tray (อ่างล้างผ้า)</span
                    >
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">FU: 3</span>
                      <button
                        @click="addFixture('LAUNDRY_TRAY')"
                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Appliances -->
              <div class="border rounded-lg p-4">
                <h4
                  class="font-semibold text-gray-900 mb-3 flex items-center gap-2"
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  เครื่องใช้ไฟฟ้า
                </h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700"
                      >Dishwasher (เครื่องล้างจาน)</span
                    >
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">FU: 1</span>
                      <button
                        @click="addFixture('DISHWASHER')"
                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700"
                      >Washing Machine 3.5kg</span
                    >
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">FU: 2</span>
                      <button
                        @click="addFixture('WASHING_MACHINE_3_5KG')"
                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700"
                      >Washing Machine 7kg</span
                    >
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">FU: 4</span>
                      <button
                        @click="addFixture('WASHING_MACHINE_7KG')"
                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Fixtures -->
          <div
            v-if="selectedNodeFixturesSummary.length > 0"
            class="mt-6 border-t pt-4"
          >
            <h4 class="font-semibold text-gray-900 mb-3">สุขภัณฑ์ที่เลือก</h4>
            <div class="space-y-3">
              <!-- Grouped fixtures by type (no duplicates) -->
              <div
                v-for="item in selectedNodeFixturesSummary"
                :key="item.type"
                class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-blue-300"
              >
                <div class="flex-1 min-w-0 mr-4">
                  <div class="text-sm font-semibold text-gray-900 truncate">
                    {{ item.name }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    FU: {{ item.fu }}
                  </div>
                </div>

                <div class="flex items-center gap-1.5">
                  <!-- Decrease quantity button -->
                  <button
                    @click="adjustFixtureQuantityByType(item.type, -1)"
                    :disabled="item.quantity <= 1"
                    class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-600 transition-all"
                    title="ลดจำนวน"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>

                  <!-- Quantity input -->
                  <input
                    :key="`input-${item.type}-${item.quantity}-${inputKeyVersion}`"
                    type="number"
                    :value="item.quantity"
                    @input="handleFixtureTypeInput(item.type, $event)"
                    @blur="handleFixtureTypeBlur(item.type, $event)"
                    @keydown.enter="handleFixtureTypeEnter(item.type, $event)"
                    min="1"
                    class="w-14 h-9 px-2 text-center text-sm font-bold text-gray-700 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    style="
                      mozappearance: textfield;
                      msappearance: none;
                      webkitappearance: none;
                    "
                  />

                  <!-- Increase quantity button -->
                  <button
                    @click="adjustFixtureQuantityByType(item.type, 1)"
                    class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 transition-all"
                    title="เพิ่มจำนวน"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>

                  <!-- Divider -->
                  <div class="w-px h-6 bg-gray-300 mx-1"></div>

                  <!-- Remove button - Trash icon -->
                  <button
                    @click="removeAllFixturesByType(item.type)"
                    class="w-9 h-9 flex items-center justify-center rounded-lg transition-all text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="ลบสุขภัณฑ์ทั้งหมด"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-3 p-3 bg-blue-50 rounded-lg">
              <div class="text-sm text-gray-700">
                <span class="font-semibold">FU รวม:</span>
                <span class="ml-2 text-lg font-bold text-blue-600">{{
                  selectedNodeTotalFU
                }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="closeFixtureModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              ปิด
            </button>
            <button
              @click="saveAndCloseFixtureModal"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AutoSuggestUpsizing from "~/components/calculator/AutoSuggestUpsizing.vue";
import HybridPipeSizing from "~/components/calculator/HybridPipeSizing.vue";
import {
  fixturesApi,
  hybridSizingApi,
  networksApi,
  nodesApi,
  pipesApi,
  projectsApi
} from "~/composables/useApi";

const props = defineProps<{
  projectId: number;
  versionId?: number; // v2: Per-version networks
  networkId?: number;
  networkData?: any; // v2: Network snapshot (instead of networkId)
  blueprints?: any[];
  scale?: number; // pixels per meter
  systemType?: "FLUSH_TANK" | "FLUSH_VALVE";
}>();

const emit = defineEmits<{
  networkChange: [network: any];
}>();

const canvasRef = ref<HTMLDivElement>();
const canvasContainerRef = ref<HTMLDivElement>();
const toast = useToast();

// State
const nodes = ref<any[]>([]);
const pipes = ref<any[]>([]);
const selectedNodeId = ref<number | null>(null);
const addingNodeType = useState<string | null>("addingNodeType", () => null);
const selectedFloorForNewNode = useState<number>(
  "selectedFloorForNewNode",
  () => 0
);
const drawingPipeFrom = useState<number | null>("drawingPipeFrom", () => null);
const findingCriticalPath = ref(false);
const saving = ref(false);
const showHelp = ref(false);

// Blueprint upload state
const blueprintInputRef = ref<HTMLInputElement>();
const showBlueprintUpload = ref(false);
const blueprints = ref<any[]>(props.blueprints || []);
const zoom = ref(1);
const scale = ref(props.scale || 50); // pixels per meter

// Watch for blueprints prop changes
watch(
  () => props.blueprints,
  (newBlueprints) => {
    blueprints.value = newBlueprints || [];
  },
  { deep: true }
);

// Watch for scale prop changes
watch(
  () => props.scale,
  (newScale) => {
    if (newScale) {
      scale.value = newScale;
    }
  }
);

// Watch for blueprints count changes to reset floor selection
watch(
  () => blueprints.value.length,
  (newLength) => {
    if (newLength !== 2) {
      // Reset to floor 0 when not in 2-floor mode
      selectedFloorForNewNode.value = 0;
    }
    // Note: No longer auto-recalculate floor for existing nodes based on elevation
    // Floor is now just metadata, doesn't affect visibility
  }
);

const calibrating = ref(false);
const calibratingFloor = ref(0); // 0 = floor 1, 1 = floor 2
const selectedCalibrationFloor = ref(0); // For floor selector dropdown
const calibrationStep = ref(0);
const knownDistance = ref(1);
const calibrationDistance = ref(0);
const calibrationPoints = ref<{ x: number; y: number }[]>([]);

// Fixture modal state
const showFixtureModal = ref(false);
const selectedNode = ref<any>(null);
const selectedNodeFixtures = ref<any[]>([]);

// Local state for quantity inputs (to allow typing without immediate re-render)
const fixtureInputValues = reactive<Record<string, number>>({});
const tempFixtureInputValues = reactive<Record<string, string>>({}); // Temporary values during typing
const inputKeyVersion = ref(0); // Force re-render counter

// Selected pipe for sidebar
const selectedPipe = ref<any>(null);

// Project parameters (from Step 1)
const projectParameters = ref<any>(null);

// Computed properties for material and C-Factor from project parameters
const projectMaterial = computed(() => {
  return projectParameters.value?.pipeMaterial || "PVC";
});

const projectCFactor = computed(() => {
  return projectParameters.value?.cFactor || 150;
});

// Draggable Floating Panel state
const panelPos = ref({ x: 16, y: 80 }); // Default position (left: 16px, top: 5rem)
const isDraggingPanel = ref(false);
const panelDragOffset = ref({ x: 0, y: 0 });

// Analysis tabs state
const activeTab = ref<"network" | "hybrid" | "autosuggest">("network");

// Load fixed segments from cornerPoints when pipes are loaded
watch(
  pipes,
  (newPipes) => {
    console.log("watch(pipes) triggered, pipes:", newPipes.length);
    let loadedCount = 0;
    let initializedCount = 0;

    newPipes.forEach((pipe) => {
      if (!pipeFixedSegments.value.has(pipe.id)) {
        if (pipe.cornerPoints) {
          try {
            // 💡 หัวใจสำคัญ: ถ้าระบบส่งมาเป็น Object อยู่แล้ว ให้ใช้เลย ไม่ต้อง Parse ให้ Error!
            let points = pipe.cornerPoints;
            if (typeof points === "string") {
              points = JSON.parse(points);
              // กันเหนียวกรณีที่ Backend ทำ Stringify ซ้อนกัน 2 ชั้น
              if (typeof points === "string") points = JSON.parse(points);
            }

            if (points && Array.isArray(points) && points.length > 0) {
              // โหลดจุดที่เซฟไว้จริงๆ กลับมาแสดงผล!
              const fixedData = points[0];
              pipeFixedSegments.value.set(pipe.id, {
                x: Number(fixedData.x),
                y: Number(fixedData.y),
                length: Number(fixedData.length) || 50
              });
              loadedCount++;
            } else {
              initializePipeFixedSegment(pipe);
              initializedCount++;
            }
          } catch (e) {
            console.error(
              `❌ Failed to parse cornerPoints for pipe ${pipe.id}:`,
              e
            );
            initializePipeFixedSegment(pipe);
            initializedCount++;
          }
        } else {
          initializePipeFixedSegment(pipe);
          initializedCount++;
        }
      }
    });

    console.log(
      `watch(pipes) summary: ${loadedCount} loaded, ${initializedCount} initialized`
    );
  },
  { immediate: true, deep: true }
);

// Watch for node position changes → update connected pipe fixed segments
watch(
  nodes,
  (newNodes, oldNodes) => {
    if (!oldNodes || oldNodes.length === 0) return; // Skip first run

    // Update fixed segments for pipes connected to moved nodes
    pipes.value.forEach(async (pipe) => {
      const source = newNodes.find((n) => n.id === pipe.sourceNodeId);
      const target = newNodes.find((n) => n.id === pipe.targetNodeId);
      const oldSource = oldNodes.find((n) => n.id === pipe.sourceNodeId);
      const oldTarget = oldNodes.find((n) => n.id === pipe.targetNodeId);

      if (!source || !target || !oldSource || !oldTarget) return;

      // Check if any connected node moved
      const sourceMoved = oldSource.x !== source.x || oldSource.y !== source.y;
      const targetMoved = oldTarget.x !== target.x || oldTarget.y !== target.y;

      if (!sourceMoved && !targetMoved) return; // No connected nodes moved

      const fixed = pipeFixedSegments.value.get(pipe.id);
      if (!fixed) return;

      // Calculate how much nodes moved
      const sourceDx = source.x - oldSource.x;
      const sourceDy = source.y - oldSource.y;
      const targetDx = target.x - oldTarget.x;
      const targetDy = target.y - oldTarget.y;

      // Move fixed segment by average of node movements
      // This keeps pipes connected to nodes
      const avgDx = (sourceDx + targetDx) / 2;
      const avgDy = (sourceDy + targetDy) / 2;

      const newFixed = {
        ...fixed,
        x: fixed.x + avgDx,
        y: fixed.y + avgDy
      };

      // ✅ 1. Update in memory
      pipeFixedSegments.value.set(pipe.id, newFixed);

      // ✅ 2. Save to database (update pipe cornerPoints only, NOT length)
      try {
        const cornerPointsData = JSON.stringify([
          { x: newFixed.x, y: newFixed.y, length: newFixed.length }
        ]);

        // Update frontend state
        const pipeIndex = pipes.value.findIndex((p) => p.id === pipe.id);
        if (pipeIndex !== -1) {
          pipes.value[pipeIndex].cornerPoints = cornerPointsData;
        }

        // v2: Per-version network (snapshot mode) - emit change
        if (props.networkData && props.versionId) {
          // Pipe cornerPoints already updated in local state
          // Emit debounced to avoid too frequent updates
          nextTick(() => {
            emit('networkChange', {
              ...currentNetwork.value,
              nodes: [...nodes.value],
              pipes: [...pipes.value]
            });
          });
        }
        // v1: Legacy network from database - save to backend
        else if (props.networkId) {
          await pipesApi.update(pipe.id, {
            cornerPoints: cornerPointsData
          });
        }
      } catch (error) {
        console.error(
          `Failed to update pipe ${pipe.id} after node move:`,
          error
        );
      }
    });
  },
  { deep: true }
);

// Computed
// v2: Support both networkData (snapshot) and networkId (legacy)
const hasValidNetworkId = computed(() => {
  // v2: If versionId exists, allow creating network from scratch
  if (props.versionId !== null && props.versionId !== undefined) {
    return true
  }
  // v2: networkData from version snapshot
  if (props.networkData !== null && props.networkData !== undefined) {
    return true
  }
  // v1: networkId from database
  const valid = props.networkId !== null && props.networkId !== undefined;
  if (!valid) {
    console.warn("NetworkBuilder: Neither networkData nor networkId provided");
  }
  return valid;
});

// v2: Current network data (from snapshot or API)
const currentNetwork = computed(() => {
  // v2: From snapshot
  if (props.networkData) {
    return props.networkData
  }
  // v1: Will be loaded from API
  return null
})

// v2: Display network ID (for debugging/logs)
const displayNetworkId = computed(() => {
  if (props.versionId) return `version-${props.versionId}`
  if (props.networkId) return props.networkId
  return null
})

const selectedNodeTotalFU = computed(() => {
  return selectedNodeFixtures.value.reduce((sum, f) => {
    const fu = Number(f.fu) || 0; // Force Number, default to 0 if invalid
    const qty = Number(f.quantity) || 1; // Force Number, default to 1 if invalid
    const product = fu * qty;
    return sum + (isNaN(product) ? 0 : product); // Guard against NaN
  }, 0);
});

// Total fixtures count (sum of all quantities)
const selectedNodeTotalFixturesCount = computed(() => {
  return selectedNodeFixtures.value.reduce((sum, f) => {
    const qty = Number(f.quantity) || 1;
    return sum + qty;
  }, 0);
});

// Group fixtures by type for display
const selectedNodeFixturesSummary = computed(() => {
  const summary = new Map<
    string,
    {
      type: string;
      name: string;
      quantity: number;
      fu: number;
      totalFU: number;
    }
  >();

  selectedNodeFixtures.value.forEach((fixture) => {
    const fu = Number(fixture.fu) || 0; // Force Number conversion
    const qty = Number(fixture.quantity) || 1; // Force Number conversion, default to 1
    const existing = summary.get(fixture.type);

    if (existing) {
      existing.quantity += qty;
      const product = fu * qty;
      existing.totalFU += isNaN(product) ? 0 : product; // Guard against NaN
    } else {
      const product = fu * qty;
      summary.set(fixture.type, {
        type: fixture.type, // Add type field
        name: fixture.name,
        quantity: qty,
        fu: fu,
        totalFU: isNaN(product) ? 0 : product // Guard against NaN
      });
    }
  });

  return Array.from(summary.values());
});

const calculatedPipeLength = computed(() => {
  if (!selectedPipe.value) return 0;
  const source = nodes.value.find(
    (n) => n.id === selectedPipe.value.sourceNodeId
  );
  const target = nodes.value.find(
    (n) => n.id === selectedPipe.value.targetNodeId
  );
  if (!source || !target) return 0;

  const dx = (target.x - source.x) / scale.value;
  const dy = (target.y - source.y) / scale.value;
  return Math.sqrt(dx * dx + dy * dy);
});

const mousePosition = ref({ x: 0, y: 0 });

// Orthogonal routing helper functions with Elbow Connectors
const getOrthogonalPathPoints = (pipe: any) => {
  const source = nodes.value.find((n) => n.id === pipe.sourceNodeId);
  const target = nodes.value.find((n) => n.id === pipe.targetNodeId);
  if (!source || !target) return "";

  // Get fixed segment
  const fixed = pipeFixedSegments.value.get(pipe.id);

  if (!fixed) {
    const midX = source.x + (target.x - source.x) / 2;
    return `${source.x},${source.y} ${midX},${source.y} ${midX},${target.y} ${target.x},${target.y}`;
  }

  // Check pipe orientation based on node positions
  const dx = Math.abs(target.x - source.x);
  const dy = Math.abs(target.y - source.y);
  const isVertical = dy > dx;

  // 💡 วาดเส้นหักศอก 2 จังหวะแบบคลีนๆ ปลายท่อจะชนศูนย์กลาง Node เป๊ะๆ เสมอ
  if (isVertical) {
    return `${source.x},${source.y} ${fixed.x},${source.y} ${fixed.x},${target.y} ${target.x},${target.y}`;
  } else {
    return `${source.x},${source.y} ${source.x},${fixed.y} ${target.x},${fixed.y} ${target.x},${target.y}`;
  }
};

const getOrthogonalMidpoint = (pipe: any) => {
  const source = nodes.value.find((n) => n.id === pipe.sourceNodeId);
  const target = nodes.value.find((n) => n.id === pipe.targetNodeId);
  if (!source || !target) return { x: 0, y: 0 };

  // Get fixed segment (DO NOT initialize here)
  const fixed = pipeFixedSegments.value.get(pipe.id);

  if (!fixed) {
    const midX = source.x + (target.x - source.x) / 2;
    const midY = source.y + (target.y - source.y) / 2;
    return { x: midX, y: midY };
  }

  // Return fixed segment position as midpoint
  return { x: fixed.x, y: fixed.y };
};

// ฟังก์ชันคำนวณองศาลูกศรให้อยู่ตรงกลางท่อและชี้ถูกทิศทาง 100%
const getPipeAngle = (pipe: any) => {
  const source = nodes.value.find((n) => n.id === pipe.sourceNodeId);
  const target = nodes.value.find((n) => n.id === pipe.targetNodeId);
  if (!source || !target) return 0;

  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const isVertical = Math.abs(dy) > Math.abs(dx);

  if (isVertical) {
    return dy > 0 ? 90 : -90; // ท่อตั้ง: ไหลลง = 90, ไหลขึ้น = -90
  } else {
    return dx > 0 ? 0 : 180; // ท่อนอน: ไหลขวา = 0, ไหลซ้าย = 180
  }
};

// ฟังก์ชันแสดงขนาดท่อในรูปแบบ "inch (mm)"
const formatPipeSize = (nominalSize: string | number): string => {
  const mm = parseInt(String(nominalSize));

  // Mapping หน่วย inch ตามขนาด mm
  const inchesMap: Record<number, string> = {
    15: '1/2"',
    20: '3/4"',
    25: '1"',
    32: '1¼"',
    40: '1½"',
    50: '2"',
    65: '2½"',
    80: '3"',
    100: '4"'
  };

  const inches = inchesMap[mm] || `${mm}"`;
  return `${inches} (${mm}mm)`;
};

const getTempOrthogonalPathPoints = () => {
  if (!drawingPipeFrom.value) return "";

  const source = nodes.value.find((n) => n.id === drawingPipeFrom.value);
  if (!source) return "";

  const x1 = source.x;
  const y1 = source.y;
  const x2 = mousePosition.value.x;
  const y2 = mousePosition.value.y;

  // Create orthogonal path for temporary line
  const midX = x1 + (x2 - x1) / 2;

  return `${x1},${y1} ${midX},${y1} ${midX},${y2} ${x2},${y2}`;
};

const getTempPipeMidpoint = () => {
  if (!drawingPipeFrom.value) return { x: 0, y: 0 };

  const source = nodes.value.find((n) => n.id === drawingPipeFrom.value);
  if (!source) return { x: 0, y: 0 };

  const x1 = source.x;
  const y1 = source.y;
  const x2 = mousePosition.value.x;
  const y2 = mousePosition.value.y;

  // Middle point of the orthogonal path (center of vertical segment)
  const midX = x1 + (x2 - x1) / 2;
  const midY = y1 + (y2 - y1) / 2;

  return { x: midX, y: midY };
};

const getTempPipeAngle = () => {
  if (!drawingPipeFrom.value) return 0;

  const source = nodes.value.find((n) => n.id === drawingPipeFrom.value);
  if (!source) return 0;

  const y1 = source.y;
  const y2 = mousePosition.value.y;

  // Arrow points vertically based on flow direction
  // If flowing down (y2 > y1), angle is 90 degrees
  // If flowing up (y2 < y1), angle is -90 degrees
  return y2 > y1 ? 90 : -90;
};

const draggingNode = ref<{ node: any; startX: number; startY: number } | null>(
  null
);

// Pipe dragging state
const draggingPipe = ref<{
  pipe: any;
  startX: number;
  startY: number;
  isVertical: boolean; // true = vertical pipe, false = horizontal pipe
  originalFixedX: number; // Original X position of fixed segment
  originalFixedY: number; // Original Y position of fixed segment
} | null>(null);

// Store fixed segment positions for each pipe
// Fixed segment: ส่วนกลางของท่อที่ขยับได้ (ไม่ใช่ node)
const pipeFixedSegments = ref<
  Map<
    number,
    {
      x: number; // Center X of fixed segment
      y: number; // Center Y of fixed segment
      length: number; // Length of fixed segment
    }
  >
>(new Map());

// Node types configuration
const nodeTypes = [
  {
    type: "SOURCE",
    label: "จุดเริ่มต้น",
    icon: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`
  },
  {
    type: "JUNCTION",
    label: "จุดเชื่อม",
    icon: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
  },
  {
    type: "FIXTURE",
    label: "สุขภัณฑ์",
    icon: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`
  },
  {
    type: "RISER",
    label: "Riser",
    icon: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>`
  }
];

// Computed
const hasNodes = computed(() => nodes.value.length > 0);

// Check if a pipe is being dragged
const isDraggingPipe = (pipeId: number) => {
  return draggingPipe.value?.pipe.id === pipeId;
};

// Get cursor style for pipe based on orientation
const getPipeCursor = (pipe: any) => {
  if (isDraggingPipe(pipe.id)) return "grabbing";

  const source = nodes.value.find((n) => n.id === pipe.sourceNodeId);
  const target = nodes.value.find((n) => n.id === pipe.targetNodeId);

  if (!source || !target) return "grab";

  const dx = Math.abs(target.x - source.x);
  const dy = Math.abs(target.y - source.y);

  // Vertical pipe → move left/right (ew-resize)
  // Horizontal pipe → move up/down (ns-resize)
  if (dy > dx) {
    return "ew-resize"; // Left/right for vertical pipes
  } else {
    return "ns-resize"; // Up/down for horizontal pipes
  }
};

// Methods
const getNodePosition = (nodeId: number) => {
  const node = nodes.value.find((n) => n.id === nodeId);
  return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
};

const getNodeClass = (node: any) => {
  const classes = {
    SOURCE: "bg-success-500 border-success-600",
    JUNCTION: "bg-gray-500 border-gray-600",
    FIXTURE: "bg-primary-500 border-primary-600",
    RISER: "bg-warning-500 border-warning-600"
  };
  return (
    classes[node.type as keyof typeof classes] || "bg-gray-500 border-gray-600"
  );
};

const getNodeIcon = (type: string) => {
  const nodeType = nodeTypes.find((nt) => nt.type === type);
  return nodeType ? nodeType.icon : "";
};

const getNodeTypeIcon = (type: string) => {
  const nodeType = nodeTypes.find((nt) => nt.type === type);
  return nodeType ? nodeType.icon : "";
};

const getNodeFixtureCount = (node: any) => {
  if (!node.fixtures || node.fixtures.length === 0) return 0;
  return node.fixtures.reduce((sum, f) => {
    const qty = Number(f.quantity) || 1;
    return sum + qty;
  }, 0);
};

const canConnectFrom = (node: any) => {
  // Can connect from any node (including fixtures)
  // Changed to allow connecting FROM fixtures
  return true;
};

// Get nodes for specific floor (0 or 1)
// New sidebar helper methods
const getNodeTypeName = (type: string): string => {
  const names: Record<string, string> = {
    SOURCE: "จุดเริ่มต้น",
    JUNCTION: "จุดเชื่อม",
    FIXTURE: "สุขภัณฑ์",
    RISER: "Riser"
  };
  return names[type] || type;
};

const getNodePipes = (nodeId: number) => {
  return pipes.value.filter(
    (p) => p.sourceNodeId === nodeId || p.targetNodeId === nodeId
  );
};

const getOtherNodeId = (pipe: any, currentNodeId: number) => {
  return pipe.sourceNodeId === currentNodeId
    ? pipe.targetNodeId
    : pipe.sourceNodeId;
};

const getOtherNodeLabel = (pipe: any, currentNodeId: number) => {
  const otherNodeId =
    pipe.sourceNodeId === currentNodeId ? pipe.targetNodeId : pipe.sourceNodeId;

  const otherNode = nodes.value.find((n) => n.id === otherNodeId);
  return otherNode?.label || `Node ${otherNodeId}`;
};

const getNodeLabelById = (nodeId: number) => {
  const node = nodes.value.find((n) => n.id === nodeId);
  return node?.label || `Node ${nodeId}`;
};

// Load project parameters from Step 1
const loadProjectParameters = async () => {
  try {
    const project = await projectsApi.get(props.projectId);
    // Get criteria separately to include pvcClass
    const criteria = await projectsApi.getCriteria(props.projectId);

    projectParameters.value = {
      ...project,
      ...criteria,
      pipeMaterial: "PVC",
      cFactor: criteria?.cFactor || 150,
      pvcClass: criteria?.pvcClass || 7
    };
    console.log("Project parameters loaded:", projectParameters.value);
  } catch (error: any) {
    console.error("Failed to load project parameters:", error);
    // Use default values if failed
    projectParameters.value = {
      pipeMaterial: "PVC",
      cFactor: 150,
      pvcClass: 7
    };
  }
};

// Node editing methods
const updateNodeLabel = async () => {
  if (!selectedNode.value) return;
  try {
    const nodeId = selectedNode.value.id;
    const newLabel = selectedNode.value.label || undefined;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Update node in local state (no API call)
      const nodeIndex = nodes.value.findIndex(n => n.id === nodeId);
      if (nodeIndex >= 0) {
        nodes.value[nodeIndex].label = newLabel;

        // Emit change to parent
        emit('networkChange', {
          ...currentNetwork.value,
          nodes: [...nodes.value]
        });

        toast.success("บันทึกชื่อ Node เรียบร้อย");
        console.log("Node label updated (v2 snapshot mode)");
      }
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      await nodesApi.update(nodeId, { label: newLabel });
      toast.success("บันทึกชื่อ Node เรียบร้อย");
    }
    else {
      toast.error("ไม่พบ Network ที่จะอัปเดต");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to update node");
  }
};

const updateNodeElevation = async () => {
  if (!selectedNode.value) return;
  try {
    const nodeId = selectedNode.value.id;
    const newElevation = selectedNode.value.elevation;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Update node in local state (no API call)
      const nodeIndex = nodes.value.findIndex(n => n.id === nodeId);
      if (nodeIndex >= 0) {
        nodes.value[nodeIndex].elevation = newElevation;

        // Emit change to parent
        emit('networkChange', {
          ...currentNetwork.value,
          nodes: [...nodes.value]
        });

        toast.success("บันทึกระดับความสูงเรียบร้อย");
        console.log("Node elevation updated (v2 snapshot mode)");
      }
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      await nodesApi.update(nodeId, { elevation: newElevation });
      toast.success("บันทึกระดับความสูงเรียบร้อย");
    }
    else {
      toast.error("ไม่พบ Network ที่จะอัปเดต");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to update node");
  }
};

const deleteSelectedNode = async () => {
  if (!selectedNode.value) return;
  if (!confirm(`คุณต้องการลบ Node นี้?`)) return;

  try {
    const nodeIdToDelete = selectedNode.value.id;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Delete node from local state (no API call)
      nodes.value = nodes.value.filter((n) => n.id !== nodeIdToDelete);
      pipes.value = pipes.value.filter(
        (p) =>
          p.sourceNodeId !== nodeIdToDelete &&
          p.targetNodeId !== nodeIdToDelete
      );

      selectedNode.value = null;

      // Emit change to parent
      emit('networkChange', {
        ...currentNetwork.value,
        nodes: [...nodes.value],
        pipes: [...pipes.value]
      });

      toast.success("ลบ Node เรียบร้อย");
      console.log("Node deleted successfully (v2 snapshot mode)");
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      await nodesApi.delete(nodeIdToDelete);
      nodes.value = nodes.value.filter((n) => n.id !== nodeIdToDelete);
      pipes.value = pipes.value.filter(
        (p) =>
          p.sourceNodeId !== nodeIdToDelete &&
          p.targetNodeId !== nodeIdToDelete
      );
      selectedNode.value = null;
      toast.success("ลบ Node เรียบร้อย");
    }
    else {
      toast.error("ไม่พบ Network ที่จะลบ Node");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to delete node");
  }
};

// Pipe editing methods
const selectPipe = (pipe: any) => {
  selectedPipe.value = pipe;
  selectedNodeId.value = null;
  selectedNode.value = null;
};

const updatePipeLength = async () => {
  if (!selectedPipe.value) return;
  try {
    const pipeId = selectedPipe.value.id;
    const newLength = selectedPipe.value.length;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Update pipe in local state (no API call)
      const pipeIndex = pipes.value.findIndex(p => p.id === pipeId);
      if (pipeIndex >= 0) {
        pipes.value[pipeIndex].length = newLength;

        // Emit change to parent
        emit('networkChange', {
          ...currentNetwork.value,
          nodes: [...nodes.value],
          pipes: [...pipes.value]
        });

        toast.success("บันทึกความยาวท่อเรียบร้อย");
        console.log("Pipe length updated (v2 snapshot mode)");
      }
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      await pipesApi.update(pipeId, { length: newLength });
      toast.success("บันทึกความยาวท่อเรียบร้อย");
    }
    else {
      toast.error("ไม่พบ Network ที่จะอัปเดต");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to update pipe");
  }
};

const updatePipeSize = async () => {
  if (!selectedPipe.value) return;
  try {
    const pipeId = selectedPipe.value.id;
    const newNominalSize = selectedPipe.value.nominalSize;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Update pipe in local state (no API call)
      const pipeIndex = pipes.value.findIndex(p => p.id === pipeId);
      if (pipeIndex >= 0) {
        pipes.value[pipeIndex].nominalSize = newNominalSize;

        // Emit change to parent
        emit('networkChange', {
          ...currentNetwork.value,
          nodes: [...nodes.value],
          pipes: [...pipes.value]
        });

        toast.success("บันทึกขนาดท่อเรียบร้อย");
        console.log("Pipe size updated (v2 snapshot mode)");
      }
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      await pipesApi.update(pipeId, { nominalSize: newNominalSize });
      toast.success("บันทึกขนาดท่อเรียบร้อย");
    }
    else {
      toast.error("ไม่พบ Network ที่จะอัปเดต");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to update pipe");
  }
};

const updatePipeMaterial = async () => {
  if (!selectedPipe.value) return;
  try {
    const cFactors: Record<string, number> = {
      PVC: 150,
      Copper: 130,
      Steel: 100,
      CPVC: 150,
      PEX: 150
    };

    const pipeId = selectedPipe.value.id;
    const newMaterial = selectedPipe.value.material;
    const newCFactor = cFactors[newMaterial] || 150;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Update pipe in local state (no API call)
      const pipeIndex = pipes.value.findIndex(p => p.id === pipeId);
      if (pipeIndex >= 0) {
        pipes.value[pipeIndex].material = newMaterial;
        pipes.value[pipeIndex].cFactor = newCFactor;

        // Emit change to parent
        emit('networkChange', {
          ...currentNetwork.value,
          nodes: [...nodes.value],
          pipes: [...pipes.value]
        });

        toast.success("บันทึกวัสดุเรียบร้อย");
        console.log("Pipe material updated (v2 snapshot mode)");
      }
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      await pipesApi.update(pipeId, {
        material: newMaterial,
        cFactor: newCFactor
      });
      toast.success("บันทึกวัสดุเรียบร้อย");
    }
    else {
      toast.error("ไม่พบ Network ที่จะอัปเดต");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to update pipe");
  }
};

const updatePipeCFactor = async () => {
  if (!selectedPipe.value) return;
  try {
    const pipeId = selectedPipe.value.id;
    const newCFactor = selectedPipe.value.cFactor;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Update pipe in local state (no API call)
      const pipeIndex = pipes.value.findIndex(p => p.id === pipeId);
      if (pipeIndex >= 0) {
        pipes.value[pipeIndex].cFactor = newCFactor;

        // Emit change to parent
        emit('networkChange', {
          ...currentNetwork.value,
          nodes: [...nodes.value],
          pipes: [...pipes.value]
        });

        toast.success("บันทึก C-Factor เรียบร้อย");
        console.log("Pipe C-Factor updated (v2 snapshot mode)");
      }
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      await pipesApi.update(pipeId, { cFactor: newCFactor });
      toast.success("บันทึก C-Factor เรียบร้อย");
    }
    else {
      toast.error("ไม่พบ Network ที่จะอัปเดต");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to update pipe");
  }
};

const deleteSelectedPipe = async () => {
  if (!selectedPipe.value) return;
  if (!confirm(`คุณต้องการลบท่อนี้?`)) return;

  try {
    const pipeIdToDelete = selectedPipe.value.id;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Delete pipe from local state (no API call)
      pipes.value = pipes.value.filter((p) => p.id !== pipeIdToDelete);
      selectedPipe.value = null;

      // Emit change to parent
      emit('networkChange', {
        ...currentNetwork.value,
        nodes: [...nodes.value],
        pipes: [...pipes.value]
      });

      toast.success("ลบท่อเรียบร้อย");
      console.log("Pipe deleted successfully (v2 snapshot mode)");
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      await pipesApi.delete(pipeIdToDelete);
      pipes.value = pipes.value.filter((p) => p.id !== pipeIdToDelete);
      selectedPipe.value = null;
      toast.success("ลบท่อเรียบร้อย");
    }
    else {
      toast.error("ไม่พบ Network ที่จะลบท่อ");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to delete pipe");
  }
};

// Start drawing pipe from selected node in sidebar
const startDrawPipeFromSelectedNode = () => {
  if (selectedNode.value && canConnectFrom(selectedNode.value)) {
    drawingPipeFrom.value = selectedNode.value.id;
  }
};

const canConnectFromSelectedNode = () => {
  return selectedNode.value && selectedNode.value.type !== "FIXTURE";
};

// Close floating panel
const closeFloatingPanel = () => {
  selectedNode.value = null;
  selectedPipe.value = null;
  selectedNodeId.value = null;
};

// Draggable Panel functions
const startDragPanel = (event: MouseEvent) => {
  event.preventDefault();
  isDraggingPanel.value = true;

  // Calculate offset from panel top-left corner
  const panel = event.currentTarget.parentElement as HTMLElement;
  const rect = panel.getBoundingClientRect();

  panelDragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  document.body.style.cursor = "grabbing";
};

const onMouseMovePanel = (event: MouseEvent) => {
  if (!isDraggingPanel.value) return;

  // Update panel position based on mouse position
  panelPos.value = {
    x: event.clientX - panelDragOffset.value.x,
    y: event.clientY - panelDragOffset.value.y
  };
};

const onMouseUpPanel = () => {
  isDraggingPanel.value = false;
  document.body.style.cursor = "default";
};

// Add window event listeners for panel dragging
onMounted(() => {
  window.addEventListener("mousemove", onMouseMovePanel);
  window.addEventListener("mouseup", onMouseUpPanel);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMovePanel);
  window.removeEventListener("mouseup", onMouseUpPanel);
});

const startAddNode = (type: string) => {
  addingNodeType.value = type;
};

const cancelAddNode = () => {
  addingNodeType.value = null;
};

const handleCanvasClick = async (event: MouseEvent, floorIndex: number = 0) => {
  const canvasEl = canvasRef.value;
  if (!canvasEl) return;

  const rect = canvasEl.getBoundingClientRect();
  // Store actual screen coordinates (Zoom Wrapper handles scaling)
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (addingNodeType.value) {
    // Add new node with floor property
    await addNode(
      x,
      y,
      addingNodeType.value,
      blueprints.length === 2 ? selectedFloorForNewNode.value : floorIndex
    );
    addingNodeType.value = null;
  } else if (drawingPipeFrom.value) {
    // Check if clicked on a node
    const clickedNode = nodes.value.find((n) => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });

    if (clickedNode && clickedNode.id !== drawingPipeFrom.value) {
      await addPipe(drawingPipeFrom.value, clickedNode.id);
    }

    drawingPipeFrom.value = null;
  }
};

const handleCanvasMouseMove = (event: MouseEvent, floorIndex: number = 0) => {
  const canvasEl = canvasRef.value;
  if (!canvasEl) return;

  const rect = canvasEl.getBoundingClientRect();
  // Store actual screen coordinates (Zoom Wrapper handles scaling)
  mousePosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  // NOTE: Node dragging is now handled by window-level events in startDragNode
  // This function only tracks mouse position for hover indicators
};

const addNode = async (
  x: number,
  y: number,
  type: string,
  floor: number = 0
) => {
  // v2: Allow creating nodes without existing network (create on first node)
  if (!hasValidNetworkId.value && props.versionId) {
    console.log("Creating first node - initializing network data");
    // Just continue - will create node in local state
  } else if (!hasValidNetworkId.value) {
    toast.error("กรุณาสร้าง Network ก่อน");
    console.error("addNode: networkId is missing", {
      networkId: props.networkId,
      projectId: props.projectId
    });
    return;
  }

  try {
    let node;

    // v2: Per-version network (snapshot mode)
    if (props.versionId) {
      // Create node locally (no API call)
      node = {
        id: Date.now(), // Temporary ID
        type: type as any,
        x,
        y,
        elevation: 0,
        fixtures: [],
        floor
      };

      nodes.value.push(node);

      // Emit change to parent
      emit('networkChange', {
        ...currentNetwork.value,
        nodes: [...nodes.value]
      });

      toast.success("เพิ่ม Node เรียบร้อย");
      console.log("Node added successfully (v2 snapshot mode)", node);
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      node = await nodesApi.add(props.networkId, {
        type: type as any,
        x,
        y,
        elevation: 0
      });

      nodes.value.push({
        ...node,
        fixtures: [],
        floor
      });

      toast.success("เพิ่ม Node เรียบร้อย");
      console.log("Node added successfully (v1 API mode)", node);
    }
  } catch (error: any) {
    console.error("Failed to add node:", error);
    toast.error(error.message || "เพิ่ม Node ไม่สำเร็จ");
  }
};

const selectNode = (node: any) => {
  console.log("selectNode called:", node);

  // CRITICAL: Clear fixtures state immediately to prevent stale data
  selectedNodeFixtures.value = [];

  // Close fixture modal if open and switching to a different node
  if (
    showFixtureModal.value &&
    selectedNode.value &&
    node.id !== selectedNode.value.id
  ) {
    console.log("Closing fixture modal due to node switch");
    showFixtureModal.value = false;
  }

  selectedNodeId.value = node.id;

  // Get the node from the nodes array to preserve fixtures data
  const nodeInArray = nodes.value.find((n) => n.id === node.id);
  selectedNode.value = nodeInArray || node;

  selectedPipe.value = null;

  console.log("Node selected:", {
    nodeId: selectedNodeId.value,
    selectedNode: selectedNode.value,
    floatingPanelShouldShow: !!(selectedNode.value || selectedPipe.value)
  });

  // Load fixtures if fixture node
  if (selectedNode.value.type === "FIXTURE") {
    // Check if we have fixtures data in memory already to avoid unnecessary API calls
    if (selectedNode.value.fixtures && selectedNode.value.fixtures.length > 0) {
      // Normalize all fixtures from memory
      selectedNodeFixtures.value =
        selectedNode.value.fixtures.map(normalizeFixture);

      // Initialize local input values with current quantities
      selectedNodeFixtures.value.forEach((fixture) => {
        fixtureInputValues[fixture.name] = fixture.quantity || 1;
      });

      // Force re-render
      inputKeyVersion.value++;

      console.log("Loaded fixtures from memory (v2 snapshot mode):", selectedNodeFixtures.value);
    } else {
      // Only load from API if we don't have data in memory
      loadNodeFixtures(node.id);
    }
  } else {
    selectedNodeFixtures.value = [];
  }

  // If drawing pipe, complete connection
  if (drawingPipeFrom.value && drawingPipeFrom.value !== node.id) {
    addPipe(drawingPipeFrom.value, node.id);
    drawingPipeFrom.value = null;
  }
};

// Load fixtures for a specific node
const loadNodeFixtures = async (nodeId: number) => {
  try {
    let fixtures: any[] = [];

    // v2: Per-version network (snapshot mode) - load from node.fixtures array
    if (props.networkData && props.versionId) {
      const node = nodes.value.find((n) => n.id === nodeId);
      if (node && node.fixtures) {
        fixtures = node.fixtures;
        console.log("Loaded fixtures from node (v2 snapshot mode):", fixtures);
      }
    }
    // v1: Legacy network from database - load from API
    else if (props.networkId) {
      fixtures = await nodesApi.getFixtures(nodeId);
    }

    // Filter: Ensure fixtures belong to this node AND are not duplicates
    // Group by type to check for duplicates
    const fixturesByType = new Map<string, any[]>();
    fixtures.forEach((f: any) => {
      if (f && typeof f === "object") {
        const normalized = normalizeFixture(f);
        if (!fixturesByType.has(normalized.type)) {
          fixturesByType.set(normalized.type, []);
        }
        fixturesByType.get(normalized.type)!.push(normalized);
      }
    });

    // Keep only ONE fixture per type (the first one found)
    // This handles the legacy database issue where there are multiple fixtures of same type
    const uniqueFixtures: any[] = [];
    fixturesByType.forEach((fixturesArray) => {
      if (fixturesArray && fixturesArray.length > 0) {
        // Sum up quantities from all fixtures of this type
        const totalQuantity = fixturesArray.reduce(
          (sum, f) => sum + (f.quantity || 1),
          0
        );
        const firstFixture = fixturesArray[0];

        // Create a single fixture with summed quantity
        uniqueFixtures.push({
          ...firstFixture,
          quantity: totalQuantity
        });
      }
    });

    // Use the unique fixtures
    selectedNodeFixtures.value = uniqueFixtures;

    // Initialize local input values with current quantities
    selectedNodeFixtures.value.forEach((fixture) => {
      fixtureInputValues[fixture.name] = fixture.quantity || 1;
    });

    // Force re-render
    inputKeyVersion.value++;

    // Update the node's fixtures array to persist the data (use spread to create new array)
    if (selectedNode.value && selectedNode.value.id === nodeId) {
      selectedNode.value.fixtures = [...selectedNodeFixtures.value];
    }

    // Also update in nodes array (use spread to create new array)
    const nodeInArray = nodes.value.find((n) => n.id === nodeId);
    if (nodeInArray) {
      nodeInArray.fixtures = [...selectedNodeFixtures.value];
    }
  } catch (error) {
    console.error("Failed to load fixtures:", error);
    selectedNodeFixtures.value = [];
  }
};

const startDragNode = (node: any, event: MouseEvent) => {
  event.preventDefault(); // Prevent text selection
  draggingNode.value = {
    node,
    startX: event.clientX,
    startY: event.clientY
  };

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (!draggingNode.value) return;

    // Use movementX/movementY divided by zoom to maintain correct scale
    const dx = moveEvent.movementX / zoom.value;
    const dy = moveEvent.movementY / zoom.value;

    // Update node position by adding delta to current position
    draggingNode.value.node.x += dx;
    draggingNode.value.node.y += dy;
  };

  const onMouseUp = async () => {
    if (draggingNode.value) {
      // Update node position
      try {
        const nodeId = node.id;
        const newX = node.x;
        const newY = node.y;

        // v2: Per-version network (snapshot mode)
        if (props.networkData && props.versionId) {
          // Node position already updated in local state during drag
          // Just emit change to parent
          emit('networkChange', {
            ...currentNetwork.value,
            nodes: [...nodes.value]
          });

          toast.success("บันทึกตำแหน่ง Node เรียบร้อย");
          console.log("Node position saved (v2 snapshot mode)");
        }
        // v1: Legacy network from database
        else if (props.networkId) {
          await nodesApi.update(nodeId, {
            x: newX,
            y: newY
          });
          toast.success("บันทึกตำแหน่ง Node เรียบร้อย");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to update node");
      }
    }

    draggingNode.value = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  // Use window-level events for smooth dragging even when mouse leaves canvas
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

// Check if pipe is vertical or horizontal (based on node positions)
const isPipeVertical = (pipe: any): boolean => {
  const sourceNode = nodes.value.find((n) => n.id === pipe.sourceNodeId);
  const targetNode = nodes.value.find((n) => n.id === pipe.targetNodeId);

  if (!sourceNode || !targetNode) return false;

  // Check orientation from ORIGINAL node positions (not fixed segment)
  const dx = Math.abs(targetNode.x - sourceNode.x);
  const dy = Math.abs(targetNode.y - sourceNode.y);

  // Add small threshold to prevent issues with very short pipes
  // If pipe is very short in both directions, default to vertical
  const threshold = 5; // 5px threshold

  if (dy < threshold && dx < threshold) {
    // Very short pipe - default to vertical orientation
    return true;
  }

  // Vertical pipe: dy > dx (ท่อวิ่งในแนวนอนมากกว่าแนวนอน)
  return dy > dx;
};

// Initialize fixed segment for a pipe (middle point between nodes)
const initializePipeFixedSegment = (pipe: any) => {
  if (pipeFixedSegments.value.has(pipe.id)) return;

  const sourceNode = nodes.value.find((n) => n.id === pipe.sourceNodeId);
  const targetNode = nodes.value.find((n) => n.id === pipe.targetNodeId);

  if (!sourceNode || !targetNode) {
    console.warn("initializePipeFixedSegment: nodes not found", pipe.id);
    return;
  }

  // Calculate middle point as initial fixed segment position
  const midX = (sourceNode.x + targetNode.x) / 2;
  const midY = (sourceNode.y + targetNode.y) / 2;

  // Calculate pipe length
  const dx = targetNode.x - sourceNode.x;
  const dy = targetNode.y - sourceNode.y;
  const pipeLength = Math.sqrt(dx * dx + dy * dy);

  // Fixed segment length: max 20px, but never more than 30% of pipe length
  // This keeps elbows short and close to the middle
  const maxLength = Math.min(20, pipeLength * 0.3);
  const fixedLength = Math.max(maxLength, 8); // At least 8px

  console.log(`Pipe ${pipe.id} initialized:`, {
    pipeLength: pipeLength.toFixed(2),
    fixedLength: fixedLength.toFixed(2),
    isVertical: Math.abs(dy) > Math.abs(dx)
  });

  pipeFixedSegments.value.set(pipe.id, {
    x: midX,
    y: midY,
    length: fixedLength
  });
};

// Start dragging a pipe
const startDragPipe = (pipe: any, event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation(); // Prevent node dragging

  // Initialize fixed segment if not exists
  initializePipeFixedSegment(pipe);

  const fixed = pipeFixedSegments.value.get(pipe.id);
  if (!fixed) return;

  draggingPipe.value = {
    pipe,
    startX: event.clientX,
    startY: event.clientY,
    isVertical: isPipeVertical(pipe),
    originalFixedX: fixed.x,
    originalFixedY: fixed.y
  };

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (!draggingPipe.value) return;

    const deltaX = (moveEvent.clientX - draggingPipe.value.startX) / zoom.value;
    const deltaY = (moveEvent.clientY - draggingPipe.value.startY) / zoom.value;

    // Get current fixed segment (not the old one)
    const currentFixed = pipeFixedSegments.value.get(
      draggingPipe.value.pipe.id
    );
    if (!currentFixed) return;

    // Update fixed segment position (perpendicular movement only)
    if (draggingPipe.value.isVertical) {
      // Vertical pipe → move left/right (X-axis only)
      const newX = draggingPipe.value.originalFixedX + deltaX;
      pipeFixedSegments.value.set(draggingPipe.value.pipe.id, {
        ...currentFixed, // ✅ Use current value
        x: newX,
        y: currentFixed.y // Keep Y unchanged
      });
    } else {
      // Horizontal pipe → move up/down (Y-axis only)
      const newY = draggingPipe.value.originalFixedY + deltaY;
      pipeFixedSegments.value.set(draggingPipe.value.pipe.id, {
        ...currentFixed, // ✅ Use current value
        x: currentFixed.x, // Keep X unchanged
        y: newY
      });
    }
  };

  const onMouseUp = async () => {
    if (draggingPipe.value) {
      const { pipe } = draggingPipe.value;
      const fixed = pipeFixedSegments.value.get(pipe.id);

      if (fixed) {
        try {
          const cornerPointsData = JSON.stringify([
            { x: fixed.x, y: fixed.y, length: fixed.length }
          ]);

          // ✅ 1. อัปเดตตัวแปรท่อในฝั่ง Frontend ก่อนเลย
          pipe.cornerPoints = cornerPointsData;

          // 💡 2. หา pipe ใน Array หลักแล้วอัปเดตมันด้วย เพื่อให้ Vue รับรู้และวาดใหม่
          const pipeIndex = pipes.value.findIndex((p) => p.id === pipe.id);
          if (pipeIndex !== -1) {
            pipes.value[pipeIndex].cornerPoints = cornerPointsData;
          }

          // v2: Per-version network (snapshot mode)
          if (props.networkData && props.versionId) {
            // Pipe cornerPoints already updated in local state
            // Just emit change to parent
            emit('networkChange', {
              ...currentNetwork.value,
              nodes: [...nodes.value],
              pipes: [...pipes.value]
            });

            toast.success("บันทึกตำแหน่งท่อเรียบร้อย");
            console.log("Pipe position saved (v2 snapshot mode)");
          }
          // v1: Legacy network from database
          else if (props.networkId) {
            // 3. เซฟลง Database
            await pipesApi.update(pipe.id, {
              cornerPoints: cornerPointsData
            });
            toast.success("บันทึกตำแหน่งท่อเรียบร้อย");
          }
        } catch (error: any) {
          initializePipeFixedSegment(pipe);
          toast.error(error.message || "Failed to update pipe position");
        }
      }
    }

    draggingPipe.value = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const addPipe = async (sourceId: number, targetId: number) => {
  console.log("=== addPipe START ===", { sourceId, targetId });

  // v2: Allow creating pipes without existing network
  if (!hasValidNetworkId.value && props.versionId) {
    console.log("Creating pipe - initializing network data");
    // Just continue - will create pipe in local state
  } else if (!hasValidNetworkId.value) {
    toast.error("กรุณาสร้าง Network ก่อน");
    console.error("addPipe: networkId is missing", {
      networkId: props.networkId,
      projectId: props.projectId
    });
    return;
  }
  console.log("✓ Network ID valid:", props.networkId);

  // Check if scale has been calibrated
  if (!scale.value || scale.value === 50) {
    // Allow connecting pipes but warn about scale
    console.warn("⚠️ Scale not calibrated, using default 50px/m");
    toast.info("💡 ยังไม่ได้สอบเทียบสเกล - ความยาวท่ออาจไม่ถูกต้อง");
    // Don't return - allow connecting pipes
  }
  console.log("✓ Using scale:", scale.value);

  // Calculate length based on positions and scale
  const source = nodes.value.find((n) => n.id === sourceId);
  const target = nodes.value.find((n) => n.id === targetId);

  if (!source || !target) {
    toast.error("ไม่พบ Node ต้นทางหรือปลายทาง");
    console.error("addPipe: source or target node not found", {
      sourceId,
      targetId,
      source,
      target
    });
    return;
  }
  console.log("✓ Nodes found:", { source, target });

  const dx = (target.x - source.x) / scale.value;
  const dy = (target.y - source.y) / scale.value;
  const length = Math.sqrt(dx * dx + dy * dy);

  console.log("✓ Calculated length:", length);

  // ✅ Calculate midpoint (default fixed segment position)
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  const fixedLength = 50; // Default fixed segment length in pixels

  // ✅ Create cornerPoints JSON string
  const cornerPoints = JSON.stringify([
    {
      x: midX,
      y: midY,
      length: fixedLength
    }
  ]);

  console.log("✓ Calculated initial cornerPoints:", {
    midX,
    midY,
    fixedLength,
    cornerPoints
  });

  try {
    let pipe;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Create pipe locally (no API call)
      pipe = {
        id: Date.now(), // Temporary ID
        sourceNodeId: sourceId,
        targetNodeId: targetId,
        length,
        nominalSize: "15",
        internalDiameter: 0.015,
        material: "PVC",
        cFactor: 150,
        cornerPoints,
        isCriticalPath: false
      };

      pipes.value.push(pipe);

      // Emit change to parent
      emit('networkChange', {
        ...currentNetwork.value,
        nodes: [...nodes.value],
        pipes: [...pipes.value]
      });

      console.log("✓ Pipe created (v2 snapshot mode):", pipe);
      toast.success(`เชื่อมท่อเรียบร้อย (ความยาว: ${length.toFixed(2)}m)`);
      console.log("=== addPipe SUCCESS (v2) ===");
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      console.log("Calling pipesApi.add with:", {
        networkId: props.networkId,
        sourceNodeId: sourceId,
        targetNodeId: targetId,
        length,
        nominalSize: "15",
        internalDiameter: 0.015,
        material: "PVC",
        cFactor: 150,
        cornerPoints
      });

      pipe = await pipesApi.add(props.networkId, {
        sourceNodeId: sourceId,
        targetNodeId: targetId,
        length,
        nominalSize: "15",
        internalDiameter: 0.015,
        material: "PVC",
        cFactor: 150,
        cornerPoints
      });

      console.log("✓ API response:", pipe);
      pipes.value.push(pipe);
      toast.success(`เชื่อมท่อเรียบร้อย (ความยาว: ${length.toFixed(2)}m)`);
      console.log("=== addPipe SUCCESS (v1) ===");
    }
    else {
      toast.error("ไม่พบ Network ที่จะเชื่อมท่อ");
      return;
    }
  } catch (error: any) {
    console.error("=== addPipe FAILED ===", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    toast.error(error.message || "เชื่อมท่อไม่สำเร็จ");
  }
};

const findCriticalPath = async () => {
  if (!hasValidNetworkId.value) {
    toast.error("กรุณาสร้าง Network ก่อน");
    return;
  }

  findingCriticalPath.value = true;

  try {
    // v2: Per-version network (snapshot mode) - calculate critical path locally
    if (props.networkData && props.versionId) {
      // Find SOURCE node (starting point)
      const sourceNode = nodes.value.find(n => n.type === 'SOURCE');
      if (!sourceNode) {
        toast.error('ไม่พบจุดเริ่มต้น (SOURCE node)');
        return;
      }

      // Build adjacency list for the graph
      const graph = new Map<number, number[]>();
      const pipeMap = new Map<string, number>(); // key: "sourceId-targetId", value: pipeId

      pipes.value.forEach(pipe => {
        const key = `${pipe.sourceNodeId}-${pipe.targetNodeId}`;
        pipeMap.set(key, pipe.id);

        if (!graph.has(pipe.sourceNodeId)) {
          graph.set(pipe.sourceNodeId, []);
        }
        graph.get(pipe.sourceNodeId)!.push(pipe.targetNodeId);
      });

      // Find longest path from SOURCE using BFS
      const findLongestPath = (startNodeId: number) => {
        const distances = new Map<number, number>();
        const previous = new Map<number, number>(); // To track path
        const queue: number[] = [startNodeId];
        distances.set(startNodeId, 0);

        while (queue.length > 0) {
          const current = queue.shift()!;

          if (graph.has(current)) {
            graph.get(current)!.forEach(neighbor => {
              // Find pipe length
              const pipe = pipes.value.find(p =>
                p.sourceNodeId === current && p.targetNodeId === neighbor
              );
              const edgeLength = pipe?.length || 0;

              const newDist = distances.get(current)! + edgeLength;

              if (!distances.has(neighbor) || newDist > distances.get(neighbor)!) {
                distances.set(neighbor, newDist);
                previous.set(neighbor, current);
                queue.push(neighbor);
              }
            });
          }
        }

        // Find node with maximum distance
        let maxDist = 0;
        let endNode = startNodeId;

        distances.forEach((dist, nodeId) => {
          if (dist > maxDist) {
            maxDist = dist;
            endNode = nodeId;
          }
        });

        // Reconstruct path
        const path: number[] = [];
        let current = endNode;
        while (current !== startNodeId && previous.has(current)) {
          path.unshift(current);
          current = previous.get(current)!;
        }
        path.unshift(startNodeId);

        return { path, totalDistance: maxDist };
      };

      const result = findLongestPath(sourceNode.id);

      // Get pipe IDs in critical path
      const criticalPipeIds = new Set<number>();
      for (let i = 0; i < result.path.length - 1; i++) {
        const from = result.path[i];
        const to = result.path[i + 1];
        const pipe = pipes.value.find(p =>
          p.sourceNodeId === from && p.targetNodeId === to
        );
        if (pipe) {
          criticalPipeIds.add(pipe.id);
        }
      }

      // Update pipes with critical path status
      pipes.value.forEach(pipe => {
        pipe.isCriticalPath = criticalPipeIds.has(pipe.id);
      });

      // Emit change to save critical path status
      emit('networkChange', {
        ...currentNetwork.value,
        nodes: [...nodes.value],
        pipes: [...pipes.value]
      });

      toast.success(`พบ Critical Path: ระยะทางรวม ${result.totalDistance.toFixed(1)}m (${criticalPipeIds.size} ท่อ)`);
    }
    // v1: Legacy network from database - use API
    else if (props.networkId) {
      const result = await networksApi.findCriticalPath(props.networkId);

      // Update pipes with critical path status
      pipes.value.forEach((pipe) => {
        pipe.isCriticalPath = result.pipeIds.includes(pipe.id);
      });

      toast.success(`Found critical path: ${result.totalLength.toFixed(1)}m`);
    }
  } catch (error: any) {
    console.error("Failed to find critical path:", error);
    toast.error(error.message || "Failed to find critical path");
  } finally {
    findingCriticalPath.value = false;
  }
};

const saveNetwork = async () => {
  saving.value = true;

  try {
    // Network is auto-saved on each action
    toast.success("Network saved successfully");
  } catch (error: any) {
    toast.error(error.message || "Failed to save network");
  } finally {
    saving.value = false;
  }
};

// Blueprint upload methods
const triggerBlueprintUpload = () => {
  blueprintInputRef.value?.click();
};

const handleBlueprintUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const floorNumber = blueprints.value.length + 1;

      const newBlueprint = {
        id: Date.now(),
        url,
        floorText: `ชั้น ${floorNumber}`
      };

      // Insert in correct floor order (1 → 2 → 3...)
      // Extract floor number from text (e.g., "ชั้น 1" -> 1)
      const getFloorNum = (text: string) => {
        const match = text.match(/ชั้น\s*(\d+)/);
        return match ? parseInt(match[1]) : 999;
      };

      const newFloorNum = getFloorNum(newBlueprint.floorText);
      let insertIndex = blueprints.value.length;

      for (let i = 0; i < blueprints.value.length; i++) {
        const existingFloorNum = getFloorNum(blueprints.value[i].floorText);
        if (newFloorNum < existingFloorNum) {
          insertIndex = i;
          break;
        }
      }

      blueprints.value.splice(insertIndex, 0, newBlueprint);

      showBlueprintUpload.value = false;
      toast.success(`อัปโหลดแบบชั้น ${floorNumber} เรียบร้อย`);
    };
    reader.readAsDataURL(file);
  }

  // Reset input
  target.value = "";
};

const clearBlueprints = () => {
  blueprints.value = [];
  scale.value = 50;
  zoom.value = 1;
  toast.success("ลบแบบทั้งหมดเรียบร้อย");
};

// Swap floor positions
const swapFloors = () => {
  if (blueprints.value.length !== 2) return;

  const temp = blueprints.value[0];
  blueprints.value[0] = blueprints.value[1];
  blueprints.value[1] = temp;

  toast.success("สลับตำแหน่งชั้นเรียบร้อย");
};

const getLayerColor = (index: number) => {
  const colors = [
    "#EF4444", // red-500
    "#3B82F6", // blue-500
    "#10B981", // green-500
    "#F59E0B", // amber-500
    "#8B5CF6", // purple-500
    "#EC4899" // pink-500
  ];
  return colors[index % colors.length];
};

// Zoom controls
const zoomIn = () => {
  zoom.value = Math.min(zoom.value * 1.2, 3);
};

const zoomOut = () => {
  zoom.value = Math.max(zoom.value / 1.2, 0.3);
};

const resetZoom = () => {
  zoom.value = 1;
};

// Calibration methods
const startCalibration = (floorIndex: number) => {
  console.log("startCalibration called with floorIndex:", floorIndex);
  calibrating.value = true;
  calibratingFloor.value = floorIndex;
  calibrationStep.value = 0;
  calibrationPoints.value = [];
  knownDistance.value = 1;
  console.log("calibrating.value set to:", calibrating.value);
};

const cancelCalibration = () => {
  calibrating.value = false;
  calibratingFloor.value = 0;
  calibrationStep.value = 0;
  calibrationPoints.value = [];
  knownDistance.value = 1;
};

const handleCanvasClickForCalibration = (
  event: MouseEvent,
  floorIndex: number = 0
) => {
  if (!calibrating.value || calibratingFloor.value !== floorIndex) return;

  const canvasEl = canvasRef.value;
  if (!canvasEl) return;

  // Check if already have 2 points
  if (calibrationPoints.value.length >= 2) {
    toast.warning("เลือกได้แค่ 2 จุดเท่านั้น กรุณากดยืนยันหรือยกเลิก");
    return;
  }

  const rect = canvasEl.getBoundingClientRect();
  // For calibration, use screen coordinates (not adjusted by zoom)
  // because we measure visible distance on screen
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  calibrationPoints.value.push({ x, y });

  if (calibrationPoints.value.length === 1) {
    calibrationStep.value = 1;
  } else if (calibrationPoints.value.length === 2) {
    const dx = calibrationPoints.value[1].x - calibrationPoints.value[0].x;
    const dy = calibrationPoints.value[1].y - calibrationPoints.value[0].y;
    calibrationDistance.value = Math.sqrt(dx * dx + dy * dy);
    calibrationStep.value = 2;
  }
};

const applyCalibration = () => {
  if (!knownDistance.value || knownDistance.value <= 0) {
    toast.error("กรุณาระบุระยะห่างจริง");
    return;
  }

  scale.value = calibrationDistance.value / knownDistance.value;
  calibrating.value = false;
  calibratingFloor.value = 0;
  calibrationStep.value = 0;
  calibrationPoints.value = [];
  toast.success(`สอบเทียบสเกลเรียบร้อย: ${Math.round(scale.value)} px/m`);
};

// Fixture modal methods
const openFixtureModal = async (node: any) => {
  // Get the node from the nodes array to get the latest fixtures data
  const nodeInArray = nodes.value.find((n) => n.id === node.id);
  selectedNode.value = nodeInArray || node;
  showFixtureModal.value = true;

  // Clear local input values
  Object.keys(fixtureInputValues).forEach(
    (key) => delete fixtureInputValues[key]
  );
  Object.keys(tempFixtureInputValues).forEach(
    (key) => delete tempFixtureInputValues[key]
  );

  // Load existing fixtures if any, otherwise start empty or load from API
  if (selectedNode.value.fixtures && selectedNode.value.fixtures.length > 0) {
    // Node has fixtures in memory, use them
    selectedNodeFixtures.value =
      selectedNode.value.fixtures.map(normalizeFixture);
  } else {
    // No fixtures in memory, try loading from API or start empty
    if (selectedNode.value.type === "FIXTURE") {
      await loadNodeFixtures(node.id);
    } else {
      selectedNodeFixtures.value = [];
    }
  }

  // Initialize input values with current quantities
  await nextTick();
  selectedNodeFixtures.value.forEach((fixture) => {
    fixtureInputValues[fixture.name] = fixture.quantity || 1;
  });

  // Force re-render
  inputKeyVersion.value++;
};

const addFixture = async (type: string) => {
  if (!selectedNode.value) return;

  try {
    // Check if fixture of this type already exists
    const existingFixture = selectedNodeFixtures.value.find(
      (f) => f.type === type
    );

    if (existingFixture) {
      // Update existing fixture: increase quantity by 1
      const newQuantity = (existingFixture.quantity || 1) + 1;

      // v2: Per-version network (snapshot mode)
      if (props.networkData && props.versionId) {
        // Update in local state (no API call)
        const index = selectedNodeFixtures.value.findIndex(
          (f) => f.id === existingFixture.id
        );
        if (index !== -1) {
          selectedNodeFixtures.value[index].quantity = newQuantity;
        }

        // Update local input value
        fixtureInputValues[existingFixture.name] = newQuantity;
        delete tempFixtureInputValues[existingFixture.name];

        // Force re-render
        inputKeyVersion.value++;

        // Update node fixtures in nodes array
        const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
        if (node) {
          node.fixtures = [...selectedNodeFixtures.value];

          // Emit change to parent
          emit('networkChange', {
            ...currentNetwork.value,
            nodes: [...nodes.value]
          });
        }

        // Also update selectedNode
        if (selectedNode.value) {
          selectedNode.value.fixtures = [...selectedNodeFixtures.value];
        }

        toast.success(
          `เพิ่มจำนวน ${getFixtureName(type)} เรียบร้อย (รวม ${newQuantity} ชิ้น)`
        );
        console.log("Fixture quantity updated (v2 snapshot mode)");
      }
      // v1: Legacy network from database
      else if (props.networkId) {
        const updatedFixture = await fixturesApi.update(existingFixture.id, {
          quantity: newQuantity
        });

        // Update in selectedNodeFixtures array
        const index = selectedNodeFixtures.value.findIndex(
          (f) => f.id === existingFixture.id
        );
        if (index !== -1) {
          selectedNodeFixtures.value[index] = {
            ...selectedNodeFixtures.value[index],
            ...updatedFixture,
            quantity: newQuantity
          };
        }

        // Update local input value
        fixtureInputValues[existingFixture.name] = newQuantity;
        delete tempFixtureInputValues[existingFixture.name];

        // Force re-render
        inputKeyVersion.value++;

        // Update node fixtures in nodes array
        const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
        if (node) {
          node.fixtures = [...selectedNodeFixtures.value];
        }

        // Also update selectedNode
        if (selectedNode.value) {
          selectedNode.value.fixtures = [...selectedNodeFixtures.value];
        }

        toast.success(
          `เพิ่มจำนวน ${getFixtureName(type)} เรียบร้อย (รวม ${newQuantity} ชิ้น)`
        );
      }
    } else {
      // v2: Per-version network (snapshot mode)
      if (props.networkData && props.versionId) {
        // Create new fixture locally (no API call)
        const newFixture = {
          id: Date.now(), // Temporary ID
          type: type,
          name: getFixtureName(type),
          fu: getFixtureFU(type),
          quantity: 1
        };

        // Add to selectedNodeFixtures
        selectedNodeFixtures.value.push(newFixture);

        // Initialize local input value
        fixtureInputValues[newFixture.name] = 1;

        // Force re-render
        inputKeyVersion.value++;

        // Update node fixtures in nodes array
        const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
        if (node) {
          node.fixtures = [...selectedNodeFixtures.value];

          // Emit change to parent
          emit('networkChange', {
            ...currentNetwork.value,
            nodes: [...nodes.value]
          });
        }

        // Also update selectedNode
        if (selectedNode.value) {
          selectedNode.value.fixtures = [...selectedNodeFixtures.value];
        }

        toast.success(`เพิ่ม ${getFixtureName(type)} เรียบร้อย`);
        console.log("Fixture added (v2 snapshot mode)");
      }
      // v1: Legacy network from database
      else if (props.networkId) {
        // Create new fixture
        const savedFixture = await fixturesApi.add(selectedNode.value.id, {
          type: type,
          quantity: 1
        });

        // Add to selectedNodeFixtures with the saved ID
        const newFixture = {
          ...savedFixture,
          name: getFixtureName(type),
          fu: getFixtureFU(type),
          quantity: 1
        };
        selectedNodeFixtures.value.push(newFixture);

        // Initialize local input value
        fixtureInputValues[newFixture.name] = 1;

        // Force re-render
        inputKeyVersion.value++;

        // Update node fixtures in nodes array (use spread to create new array)
        const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
        if (node) {
          node.fixtures = [...selectedNodeFixtures.value];
        }

        // Also update selectedNode
        if (selectedNode.value) {
          selectedNode.value.fixtures = [...selectedNodeFixtures.value];
        }

        toast.success(`เพิ่ม ${getFixtureName(type)} เรียบร้อย`);
      }
    }
  } catch (error: any) {
    console.error("Failed to add fixture:", error);
    toast.error(error.message || "เพิ่มสุขภัณฑ์ไม่สำเร็จ");
  }
};

const removeFixture = async (fixtureId: number) => {
  try {
    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Remove from local state (no API call)
      selectedNodeFixtures.value = selectedNodeFixtures.value.filter(
        (f) => f.id !== fixtureId
      );

      // Update node fixture count (use spread to create new array)
      const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
      if (node) {
        node.fixtures = [...selectedNodeFixtures.value];

        // Emit change to parent
        emit('networkChange', {
          ...currentNetwork.value,
          nodes: [...nodes.value]
        });
      }

      // Also update selectedNode (use spread to create new array)
      if (selectedNode.value) {
        selectedNode.value.fixtures = [...selectedNodeFixtures.value];
      }

      toast.success("ลบสุขภัณฑ์เรียบร้อย");
      console.log("Fixture removed (v2 snapshot mode)");
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      // Remove from database
      await fixturesApi.delete(fixtureId);
      selectedNodeFixtures.value = selectedNodeFixtures.value.filter(
        (f) => f.id !== fixtureId
      );

      // Update node fixture count (use spread to create new array)
      const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
      if (node) {
        node.fixtures = [...selectedNodeFixtures.value];
      }

      // Also update selectedNode (use spread to create new array)
      if (selectedNode.value) {
        selectedNode.value.fixtures = [...selectedNodeFixtures.value];
      }

      toast.success("ลบสุขภัณฑ์เรียบร้อย");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to remove fixture");
  }
};

// Remove fixture by name (for use with grouped summary)
const removeFixtureByName = async (fixtureName: string) => {
  if (!selectedNode.value) return;

  try {
    // Find the fixture by name
    const fixture = selectedNodeFixtures.value.find(
      (f) => f.name === fixtureName
    );
    if (!fixture) return;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Remove from local state (no API call)
      selectedNodeFixtures.value = selectedNodeFixtures.value.filter(
        (f) => f.id !== fixture.id
      );

      // Remove from local input values
      delete fixtureInputValues[fixtureName];
      delete tempFixtureInputValues[fixtureName];

      // Force re-render
      inputKeyVersion.value++;

      // Update node fixture count (use spread to create new array)
      const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
      if (node) {
        node.fixtures = [...selectedNodeFixtures.value];

        // Emit change to parent
        emit('networkChange', {
          ...currentNetwork.value,
          nodes: [...nodes.value]
        });
      }

      // Also update selectedNode (use spread to create new array)
      if (selectedNode.value) {
        selectedNode.value.fixtures = [...selectedNodeFixtures.value];
      }

      toast.success(`ลบ ${fixtureName} เรียบร้อย`);
      console.log("Fixture removed by name (v2 snapshot mode)");
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      // Remove from database
      await fixturesApi.delete(fixture.id);

      // Remove from selectedNodeFixtures
      selectedNodeFixtures.value = selectedNodeFixtures.value.filter(
        (f) => f.id !== fixture.id
      );

      // Remove from local input values
      delete fixtureInputValues[fixtureName];
      delete tempFixtureInputValues[fixtureName];

      // Force re-render
      inputKeyVersion.value++;

      // Update node fixture count (use spread to create new array)
      const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
      if (node) {
        node.fixtures = [...selectedNodeFixtures.value];
      }

      // Also update selectedNode (use spread to create new array)
      if (selectedNode.value) {
        selectedNode.value.fixtures = [...selectedNodeFixtures.value];
      }

      toast.success(`ลบ ${fixtureName} เรียบร้อย`);
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to remove fixture");
  }
};

// Adjust fixture quantity by +/- buttons (for grouped by type)
const adjustFixtureQuantityByType = async (
  fixtureType: string,
  delta: number
) => {
  if (!selectedNode.value) return;

  // Find all fixtures of this type
  const fixturesOfThisType = selectedNodeFixtures.value.filter(
    (f) => f.type === fixtureType
  );

  if (fixturesOfThisType.length === 0) return;

  // Get the first fixture (will modify its quantity)
  const firstFixture = fixturesOfThisType[0];
  const currentQuantity = firstFixture.quantity || 1;
  const newQuantity = currentQuantity + delta;

  // Validate quantity
  if (newQuantity < 1) {
    toast.warning("จำนวนต้องมีอย่างน้อย 1 ชิ้น");
    return;
  }

  // v2: Per-version network (snapshot mode)
  if (props.networkData && props.versionId) {
    // Update in local state (no API call)
    const index = selectedNodeFixtures.value.findIndex(
      (f) => f.id === firstFixture.id
    );
    if (index !== -1) {
      selectedNodeFixtures.value[index].quantity = newQuantity;
    }

    // Update local input value
    fixtureInputValues[firstFixture.name] = newQuantity;
    delete tempFixtureInputValues[firstFixture.name];

    // Force re-render
    inputKeyVersion.value++;

    // Update node fixtures in nodes array
    const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
    if (node) {
      node.fixtures = [...selectedNodeFixtures.value];

      // Emit change to parent
      emit('networkChange', {
        ...currentNetwork.value,
        nodes: [...nodes.value]
      });
    }

    // Also update selectedNode
    if (selectedNode.value) {
      selectedNode.value.fixtures = [...selectedNodeFixtures.value];
    }

    toast.success(
      `${delta > 0 ? "เพิ่ม" : "ลด"}จำนวน ${firstFixture.name} เรียบร้อย (รวม ${newQuantity} ชิ้น)`
    );
    console.log("Fixture quantity adjusted (v2 snapshot mode)");
  }
  // v1: Legacy network from database
  else if (props.networkId) {
    // Update in database
    const updatedFixture = await fixturesApi.update(firstFixture.id, {
      quantity: newQuantity
    });

    // Update in selectedNodeFixtures array
    const index = selectedNodeFixtures.value.findIndex(
      (f) => f.id === firstFixture.id
    );
    if (index !== -1) {
      selectedNodeFixtures.value[index] = {
        ...selectedNodeFixtures.value[index],
        ...updatedFixture,
        quantity: newQuantity
      };
    }

    // Update local input value
    fixtureInputValues[firstFixture.name] = newQuantity;
    delete tempFixtureInputValues[firstFixture.name];

    // Force re-render
    inputKeyVersion.value++;

    // Update node fixtures in nodes array
    const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
    if (node) {
      node.fixtures = [...selectedNodeFixtures.value];
    }

    // Also update selectedNode
    if (selectedNode.value) {
      selectedNode.value.fixtures = [...selectedNodeFixtures.value];
    }

    toast.success(
      `${delta > 0 ? "เพิ่ม" : "ลด"}จำนวน ${firstFixture.name} เรียบร้อย (รวม ${newQuantity} ชิ้น)`
    );
  }
};

// Handle input change for grouped fixture type
const handleFixtureTypeInput = (fixtureType: string, event: Event) => {
  // Just store the temp value for now
  const target = event.target as HTMLInputElement;
  // Do nothing on input, only save on blur/enter
};

// Handle blur for grouped fixture type
const handleFixtureTypeBlur = async (fixtureType: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const inputValue = target.value;
  const newQuantity = parseInt(inputValue);

  // Validate
  if (!inputValue || isNaN(newQuantity) || newQuantity < 1) {
    toast.warning("จำนวนต้องมีอย่างน้อย 1 ชิ้น");
    // Reset to original value
    await nextTick();
    const firstFixture = selectedNodeFixtures.value.find(
      (f) => f.type === fixtureType
    );
    if (firstFixture) {
      target.value = String(firstFixture.quantity || 1);
    }
    return;
  }

  // Find the first fixture of this type
  const firstFixture = selectedNodeFixtures.value.find(
    (f) => f.type === fixtureType
  );
  if (!firstFixture) return;

  // Don't update if same value
  if ((firstFixture.quantity || 1) === newQuantity) return;

  // Update the quantity
  await adjustFixtureQuantityByType(
    fixtureType,
    newQuantity - (firstFixture.quantity || 1)
  );

  // Force DOM update after save
  await nextTick();
  target.value = String(newQuantity);

  // Force re-render
  inputKeyVersion.value++;
};

// Handle Enter key for grouped fixture type
const handleFixtureTypeEnter = async (fixtureType: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  target.blur(); // Trigger blur to save
};

// Remove ALL fixtures by type
const removeAllFixturesByType = async (fixtureType: string) => {
  if (!selectedNode.value) return;

  try {
    // Find all fixtures of this type
    const fixturesToRemove = selectedNodeFixtures.value.filter(
      (f) => f.type === fixtureType
    );

    if (fixturesToRemove.length === 0) return;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Remove from local state (no API call)
      selectedNodeFixtures.value = selectedNodeFixtures.value.filter(
        (f) => f.type !== fixtureType
      );

      // Remove from local input values
      const firstFixture = fixturesToRemove[0];
      if (firstFixture) {
        delete fixtureInputValues[firstFixture.name];
        delete tempFixtureInputValues[firstFixture.name];
      }

      // Force re-render
      inputKeyVersion.value++;

      // Update node fixture count
      const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
      if (node) {
        node.fixtures = [...selectedNodeFixtures.value];

        // Emit change to parent
        emit('networkChange', {
          ...currentNetwork.value,
          nodes: [...nodes.value]
        });
      }

      // Also update selectedNode
      if (selectedNode.value) {
        selectedNode.value.fixtures = [...selectedNodeFixtures.value];
      }

      const fixtureName = firstFixture?.name || fixtureType;
      toast.success(
        `ลบ ${fixtureName} ทั้งหมด (${fixturesToRemove.length} ชิ้น) เรียบร้อย`
      );
      console.log("All fixtures of type removed (v2 snapshot mode)");
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      // Remove all from database
      await Promise.all(
        fixturesToRemove.map((fixture) => fixturesApi.delete(fixture.id))
      );

      // Remove from selectedNodeFixtures
      selectedNodeFixtures.value = selectedNodeFixtures.value.filter(
        (f) => f.type !== fixtureType
      );

      // Remove from local input values
      const firstFixture = fixturesToRemove[0];
      if (firstFixture) {
        delete fixtureInputValues[firstFixture.name];
        delete tempFixtureInputValues[firstFixture.name];
      }

      // Force re-render
      inputKeyVersion.value++;

      // Update node fixture count
      const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
      if (node) {
        node.fixtures = [...selectedNodeFixtures.value];
      }

      // Also update selectedNode
      if (selectedNode.value) {
        selectedNode.value.fixtures = [...selectedNodeFixtures.value];
      }

      const fixtureName = firstFixture?.name || fixtureType;
      toast.success(
        `ลบ ${fixtureName} ทั้งหมด (${fixturesToRemove.length} ชิ้น) เรียบร้อย`
      );
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to remove fixtures");
  }
};

// Get fixture input value (returns temp value if user is typing, otherwise returns actual quantity)
const getFixtureInputValue = (fixtureName: string, actualQuantity: number) => {
  // If there's a temp value (user is currently typing), return it
  if (tempFixtureInputValues[fixtureName] !== undefined) {
    return tempFixtureInputValues[fixtureName];
  }
  // Otherwise return the actual quantity from the fixture
  return String(actualQuantity);
};

// Handle input event (while typing)
const handleFixtureInputInput = (fixtureName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  tempFixtureInputValues[fixtureName] = target.value;
};

// Handle blur event (when user clicks away)
const handleFixtureInputBlur = async (fixtureName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const inputValue = target.value;
  const newQuantity = parseInt(inputValue);

  // Clear temp value FIRST
  delete tempFixtureInputValues[fixtureName];

  // Validate
  if (!inputValue || isNaN(newQuantity) || newQuantity < 1) {
    toast.warning("จำนวนต้องมีอย่างน้อย 1 ชิ้น");
    // Reset to original value - force re-render by updating fixtureInputValues
    await nextTick();
    const fixture = selectedNodeFixtures.value.find(
      (f) => f.name === fixtureName
    );
    if (fixture) {
      fixtureInputValues[fixtureName] = fixture.quantity || 1;
      // Force DOM update
      target.value = String(fixture.quantity || 1);
      // Force re-render
      inputKeyVersion.value++;
    }
    return;
  }

  // Don't update if same value
  const fixture = selectedNodeFixtures.value.find(
    (f) => f.name === fixtureName
  );
  if (fixture && fixture.quantity === newQuantity) {
    // Still update fixtureInputValues to ensure DOM is correct
    fixtureInputValues[fixtureName] = newQuantity;
    // Force re-render
    inputKeyVersion.value++;
    return;
  }

  // Update the quantity
  await updateFixtureQuantity(fixtureName, newQuantity);

  // Force DOM update after save
  await nextTick();
  target.value = String(newQuantity);

  // Force re-render to ensure consistency
  inputKeyVersion.value++;
};

// Handle Enter key
const handleFixtureInputEnter = async (fixtureName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  target.blur(); // Trigger blur to save
};

// Update fixture quantity (supports increase, decrease, and direct input)
const updateFixtureQuantity = async (
  fixtureName: string,
  newQuantity: number
) => {
  if (!selectedNode.value) return;

  try {
    // Validate quantity
    if (!newQuantity || newQuantity < 1) {
      toast.warning("จำนวนต้องมีอย่างน้อย 1 ชิ้น");
      return;
    }

    // Find the fixture by name
    const fixture = selectedNodeFixtures.value.find(
      (f) => f.name === fixtureName
    );
    if (!fixture) return;

    const currentQuantity = fixture.quantity || 1;

    // If quantity hasn't changed, don't update
    if (currentQuantity === newQuantity) return;

    // v2: Per-version network (snapshot mode)
    if (props.networkData && props.versionId) {
      // Update in local state (no API call)
      const index = selectedNodeFixtures.value.findIndex(
        (f) => f.id === fixture.id
      );
      if (index !== -1) {
        selectedNodeFixtures.value[index].quantity = newQuantity;
      }

      // Update local input value (not temp)
      fixtureInputValues[fixtureName] = newQuantity;
      delete tempFixtureInputValues[fixtureName];

      // Force re-render by incrementing key version
      inputKeyVersion.value++;

      // Update node fixtures in nodes array (use spread to create new array)
      const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
      if (node) {
        node.fixtures = [...selectedNodeFixtures.value];

        // Emit change to parent
        emit('networkChange', {
          ...currentNetwork.value,
          nodes: [...nodes.value]
        });
      }

      // Also update selectedNode (use spread to create new array)
      if (selectedNode.value) {
        selectedNode.value.fixtures = [...selectedNodeFixtures.value];
      }

      // Show appropriate message based on action
      if (newQuantity > currentQuantity) {
        toast.success(
          `เพิ่มจำนวน ${fixtureName} เรียบร้อย (รวม ${newQuantity} ชิ้น)`
        );
      } else {
        toast.success(
          `ลดจำนวน ${fixtureName} เรียบร้อย (เหลือ ${newQuantity} ชิ้น)`
        );
      }
      console.log("Fixture quantity updated (v2 snapshot mode)");
    }
    // v1: Legacy network from database
    else if (props.networkId) {
      // Update in database
      const updatedFixture = await fixturesApi.update(fixture.id, {
        quantity: newQuantity
      });

      // Update in selectedNodeFixtures array
      const index = selectedNodeFixtures.value.findIndex(
        (f) => f.id === fixture.id
      );
      if (index !== -1) {
        selectedNodeFixtures.value[index] = {
          ...selectedNodeFixtures.value[index],
          ...updatedFixture,
          quantity: newQuantity
        };
      }

      // Update local input value (not temp)
      fixtureInputValues[fixtureName] = newQuantity;
      delete tempFixtureInputValues[fixtureName];

      // Force re-render by incrementing key version
      inputKeyVersion.value++;

      // Update node fixtures in nodes array (use spread to create new array)
      const node = nodes.value.find((n) => n.id === selectedNode.value!.id);
      if (node) {
        node.fixtures = [...selectedNodeFixtures.value];
      }

      // Also update selectedNode (use spread to create new array)
      if (selectedNode.value) {
        selectedNode.value.fixtures = [...selectedNodeFixtures.value];
      }

      // Show appropriate message based on action
      if (newQuantity > currentQuantity) {
        toast.success(
          `เพิ่มจำนวน ${fixtureName} เรียบร้อย (รวม ${newQuantity} ชิ้น)`
        );
      } else {
        toast.success(
          `ลดจำนวน ${fixtureName} เรียบร้อย (เหลือ ${newQuantity} ชิ้น)`
        );
      }
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to update fixture quantity");
  }
};

// Close fixture modal
const closeFixtureModal = () => {
  showFixtureModal.value = false;
};

// Save and close fixture modal (updates the parent modal)
const saveAndCloseFixtureModal = () => {
  // Clear temp values
  Object.keys(tempFixtureInputValues).forEach(
    (key) => delete tempFixtureInputValues[key]
  );

  // CRITICAL: Update selectedNode fixtures before closing
  if (selectedNode.value) {
    selectedNode.value.fixtures = [...selectedNodeFixtures.value];
  }

  // Update node in nodes array too
  const nodeInArray = nodes.value.find((n) => n.id === selectedNode.value?.id);
  if (nodeInArray) {
    nodeInArray.fixtures = [...selectedNodeFixtures.value];
  }

  // Close modal
  showFixtureModal.value = false;

  toast.success("บันทึกข้อมูลสุขภัณฑ์เรียบร้อย");
};

// Helper: Normalize fixture data to ensure quantity is always defined
const normalizeFixture = (fixture: any) => ({
  ...fixture,
  name: fixture.name || getFixtureName(fixture.type),
  fu: Number(fixture.fu) || getFixtureFU(fixture.type), // Force Number conversion
  quantity: Number(fixture.quantity) || 1 // Force Number conversion, default to 1
});

const getFixtureName = (type: string): string => {
  const names: Record<string, string> = {
    WC_TANK: "โถส้วม (ถังน้ำ)",
    WC_VALVE: "โถส้วม (ลูกสูบ)",
    LAVATORY: "อ่างล้างหน้า",
    BATHTUB: "อ่างอาบน้ำ",
    SHOWER: "ฝักบัว",
    KITCHEN_SINK: "อ่างล้างจาน",
    LAUNDRY_TRAY: "อ่างล้างผ้า",
    DISHWASHER: "เครื่องล้างจาน",
    WASHING_MACHINE_3_5KG: "เครื่องซักผ้า 3.5kg",
    WASHING_MACHINE_7KG: "เครื่องซักผ้า 7kg",
    // HB Fixtures (ก๊อกน้ำล้างพื้น)
    HOSE_BIBB: "ก๊อกน้ำล้างพื้น (Hose Bibb)"
  };
  return names[type] || type;
};

const getFixtureFU = (type: string): number => {
  const fuValues: Record<string, number> = {
    WC_TANK: 3,
    WC_VALVE: 6,
    LAVATORY: 1,
    BATHTUB: 2,
    SHOWER: 2,
    KITCHEN_SINK: 2,
    LAUNDRY_TRAY: 3,
    DISHWASHER: 1,
    WASHING_MACHINE_3_5KG: 2,
    WASHING_MACHINE_7KG: 4,
    // HB Fixtures (ก๊อกน้ำล้างพื้น - ไม่มี FU, ใช้ 5 GPM โดยตรง)
    HOSE_BIBB: 0 // Hose Bibb - ไม่นับ FU, ใช้อัตราการไหล 5 GPM โดยตรง
  };
  return fuValues[type] || 0;
};

// Load network data
const loadNetwork = async () => {
  if (!props.networkId) {
    console.warn("NetworkBuilder: loadNetwork called but networkId is missing");
    return;
  }

  console.log("NetworkBuilder: Loading network", {
    projectId: props.projectId,
    networkId: props.networkId
  });

  try {
    const network = await networksApi.getCurrent(props.projectId);
    if (network) {
      console.log("NetworkBuilder: Network loaded successfully", network);

      // 🔍 DEBUG: Check cornerPoints from backend
      console.log("=".repeat(80));
      console.log("🔍 DEBUG: Checking cornerPoints from backend");
      console.log("Total pipes:", (network.pipes || []).length);
      (network.pipes || []).forEach((pipe, index) => {
        console.log(`Pipe ${index + 1} (ID: ${pipe.id}):`);
        console.log(`  - cornerPoints:`, pipe.cornerPoints);
        console.log(`  - cornerPoints type:`, typeof pipe.cornerPoints);
        console.log(
          `  - sourceNodeId: ${pipe.sourceNodeId}, targetNodeId: ${pipe.targetNodeId}`
        );
      });
      console.log("=".repeat(80));

      // Add floor property to nodes based on elevation
      nodes.value = (network.nodes || []).map((node) => ({
        ...node,
        floor: node.floor ?? 0 // Use floor from API, default to 0 if undefined
      }));
      pipes.value = network.pipes || [];
      emit("networkChange", network);
    } else {
      console.warn("NetworkBuilder: No network returned from API");
    }
  } catch (error: any) {
    console.error("NetworkBuilder: Failed to load network", error);
    toast.error(error.message || "โหลด Network ไม่สำเร็จ");
  }
};

// Hybrid Sizing events
const onHybridSelect = (method: "table26" | "hazenWilliams", result: any) => {
  console.log("Hybrid selected:", method, result);
  // Can be used to highlight pipes or show additional info
};

const onHybridApply = async (
  method: "table26" | "hazenWilliams",
  sizeMM: number
) => {
  if (!hasValidNetworkId.value) {
    toast.error("กรุณาสร้าง Network ก่อน");
    return;
  }

  try {
    // Use hybridSizingApi instead of networksApi.calculate
    const result = await hybridSizingApi.calculateNetwork(props.networkId, {
      systemType: props.systemType || "FLUSH_TANK",
      includeHoseBibb: false,
      hoseBibbGPM: 5
    });

    // Update pipe sizes based on hybrid sizing result
    // TODO: Apply the sizing results to pipes
    console.log("Hybrid sizing result:", result);

    // Reload network to get updated pipe sizes
    await loadNetwork();

    toast.success(
      `คำนวณขนาดท่อเสร็จสิ้น (วิธี: ${method === "table26" ? "ตาราง 2.6" : "Hazen-Williams"})`
    );
  } catch (error: any) {
    console.error("Failed to calculate hybrid sizing:", error);
    toast.error(error.message || "คำนวณขนาดท่อไม่สำเร็จ");
  }
};

// Watch for networkId changes (must be AFTER loadNetwork declaration)
watch(
  () => props.networkId,
  (newNetworkId) => {
    if (newNetworkId) {
      console.log("NetworkBuilder: networkId changed to", newNetworkId);
      loadNetwork();
    }
  },
  { immediate: false } // Don't trigger on mount, we handle it in onMounted
);

// Watch for networkData changes (v2 snapshot mode)
watch(
  () => props.networkData,
  (newNetworkData) => {
    if (newNetworkData && props.versionId) {
      console.log("NetworkBuilder: networkData changed (v2 mode)", {
        nodes: newNetworkData.nodes?.length || 0,
        pipes: newNetworkData.pipes?.length || 0
      });
      nodes.value = newNetworkData.nodes || [];
      pipes.value = newNetworkData.pipes || [];
    }
  },
  { deep: true, immediate: false } // Don't trigger on mount, we handle it in onMounted
);

// Watch nodes for debugging
watch(
  () => nodes.value,
  (newNodes) => {
    console.log("NetworkBuilder: Nodes updated", {
      count: newNodes.length,
      nodes: newNodes.map((n) => ({
        id: n.id,
        type: n.type,
        x: n.x,
        y: n.y,
        floor: n.floor
      }))
    });
  },
  { deep: true }
);

// Handle keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    if (drawingPipeFrom.value) {
      drawingPipeFrom.value = null;
    } else if (addingNodeType.value) {
      addingNodeType.value = null;
    }
  }
};

onMounted(() => {
  console.log("NetworkBuilder: Component mounted");

  // v2: Load from networkData prop (snapshot mode)
  if (props.networkData && props.versionId) {
    console.log("NetworkBuilder: Loading from v2 snapshot mode", props.networkData);
    nodes.value = props.networkData.nodes || [];
    pipes.value = props.networkData.pipes || [];
    console.log("✅ v2 data loaded:", {
      nodes: nodes.value.length,
      pipes: pipes.value.length
    });
  }
  // v1: Load from API (legacy mode)
  else if (props.networkId) {
    loadNetwork();
  }

  loadProjectParameters(); // Load project parameters from Step 1
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>
