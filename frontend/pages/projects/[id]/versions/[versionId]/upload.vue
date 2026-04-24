<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Version Steps Indicator -->
    <VersionSteps :version-id="versionId" />

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <!-- Back & Title Row -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <button
                @click="goBack"
                class="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                ย้อนกลับ
              </button>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">อัปโหลด Blueprint</h1>
                <p class="mt-1 text-sm text-gray-600">
                  Upload reference file (DXF blueprint)
                </p>
              </div>
            </div>

            <!-- Version Badge -->
            <div class="flex items-center gap-3">
              <div class="bg-orange-100 border border-orange-200 rounded-lg px-4 py-2">
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <p class="text-xs text-orange-600 font-medium">Version</p>
                    <p class="text-lg font-bold text-orange-900">{{ version?.name || `Version ${version?.versionNumber || '-'}` }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Blueprint Upload Form -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">อัปโหลด Blueprint</h3>
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div class="space-y-4">
                <!-- Step 1: Floor & Type (First!) -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-blue-900 mb-3">
                    <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs mr-2">1</span>
                    ระบุตำแหน่ง
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Floor Selection -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        ชั้น <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="blueprintFloor"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        required
                      >
                        <option value="">เลือกชั้น...</option>
                        <option value="roof">ดาดฟ้า (Roof)</option>
                        <option value="2">ชั้น 2</option>
                        <option value="1">ชั้น 1</option>
                        <option value="ground">ชั้นจอด (Ground)</option>
                        <option value="basement">ชั้นใต้ดิน (Basement)</option>
                        <option value="site">แปลนไซต์ (Site Plan)</option>
                        <option value="section">Section / ตัดแบบ</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                      <p class="text-xs text-gray-500 mt-1">เลือกชั้นที่ต้องการอัปโหลดแปลน</p>
                    </div>

                    <!-- Blueprint Type -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        ประเภทแปลน
                      </label>
                      <select
                        v-model="blueprintType"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
                        <option value="floor_plan">Floor Plan (แปลนชั้น)</option>
                        <option value="elevation">Elevation (ด้านข้าง)</option>
                        <option value="section">Section (ตัดแบบ)</option>
                        <option value="detail">Detail (รายละเอียด)</option>
                        <option value="riser">Riser Diagram (แปลนแนวตั้ง)</option>
                        <option value="site">Site Plan (แปลนไซต์)</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                      <p class="text-xs text-gray-500 mt-1">เลือกประเภทของแปลน</p>
                    </div>
                  </div>
                </div>

                <!-- Existing Blueprint Warning -->
                <div v-if="existingBlueprint" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <svg class="h-5 w-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-yellow-900">
                        พบ Blueprint เดิมในชั้นนี้
                      </p>
                      <p class="text-xs text-yellow-700 mt-1">
                        {{ existingBlueprint.name }} ({{ existingBlueprint.typeText }}) - อัปโหลดเมื่อ {{ formatDate(existingBlueprint.createdAt) }}
                      </p>
                      <div class="mt-2 flex gap-2">
                        <button
                          @click="deleteExistingAndContinue"
                          class="text-xs px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                          ลบเดิม และอัปโหลดใหม่
                        </button>
                        <button
                          @click="cancelUpload"
                          class="text-xs px-3 py-1 border border-yellow-600 text-yellow-700 rounded hover:bg-yellow-50"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Upload File -->
                <div v-if="!existingBlueprint" class="space-y-3">
                  <h4 class="text-sm font-semibold text-gray-700">
                    <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs mr-2">2</span>
                    เลือกไฟล์ Blueprint
                  </h4>

                  <!-- Upload Area -->
                  <div
                    class="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer"
                    :class="isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-500'"
                    @click="$refs.fileInput?.click()"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleDrop"
                  >
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="mt-2 text-sm text-gray-600">
                      <span class="font-medium text-orange-600">คลิกเพื่ออัปโหลด</span>
                      หรือลากไฟล์มาวาง
                    </p>
                    <p class="mt-1 text-xs text-orange-600 font-medium">
                      รองรับไฟล์รูปภาพเท่านั้น (PNG, JPG, GIF) สูงสุด 10MB
                    </p>
                    <input
                      ref="fileInput"
                      type="file"
                      class="hidden"
                      accept="image/png,image/jpeg,image/gif"
                      @change="handleFileUpload"
                    />
                  </div>

                  <!-- Selected File Info -->
                  <div v-if="blueprintFile" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <svg class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ blueprintFile.name }}</p>
                          <p class="text-xs text-gray-500">{{ formatFileSize(blueprintFile.size) }}</p>
                        </div>
                      </div>
                      <button
                        @click="clearFile"
                        class="text-red-600 hover:text-red-700"
                      >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Step 3: Scale & Notes -->
                <div v-if="blueprintFile && !existingBlueprint" class="space-y-4">
                  <h4 class="text-sm font-semibold text-gray-700">
                    <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs mr-2">3</span>
                    รายละเอียดเพิ่มเติม
                  </h4>

                  <!-- Scale Selection -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      สเกลแปลน <span class="text-red-500">*</span>
                    </label>

                    <!-- Preset Scales -->
                    <div class="mb-3">
                      <div class="grid grid-cols-4 gap-2">
                        <button
                          v-for="preset in scalePresets"
                          :key="preset.value"
                          @click="blueprintScale = preset.value"
                          type="button"
                          class="px-3 py-2 text-sm border rounded-lg transition-colors"
                          :class="blueprintScale === preset.value
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'"
                        >
                          {{ preset.label }}
                        </button>
                      </div>
                    </div>

                    <!-- Custom Scale Input -->
                    <div class="flex gap-2">
                      <input
                        v-model="blueprintScale"
                        type="text"
                        placeholder="หรือกรอกเอง เช่น 1:150"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <button
                        v-if="blueprintScale && !scalePresets.find(p => p.value === blueprintScale)"
                        @click="blueprintScale = ''"
                        type="button"
                        class="px-3 py-2 text-gray-500 hover:text-gray-700"
                      >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      เลือก preset หรือกรอกสเกลเอง (รูปแบบ 1:100)
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      หมายเหตุ
                    </label>
                    <textarea
                      v-model="manualNotes"
                      rows="3"
                      placeholder="ระบุรายละเอียดเพิ่มเติม เช่น ทิศทาย, จุดสำคัญ..."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Save Button -->
                  <button
                    type="button"
                    @click.prevent="saveBlueprint"
                    :disabled="!blueprintFile || !blueprintFloor || !blueprintScale || saving"
                    class="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="saving">กำลังบันทึก...</span>
                    <span v-else>บันทึก Blueprint</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Uploaded Blueprints List -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Blueprint ที่อัปโหลดแล้ว
                <span class="text-sm font-normal text-gray-500">({{ blueprints.length }})</span>
              </h3>

              <div v-if="blueprints.length === 0" class="text-center py-8">
                <svg class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-gray-500 text-sm">ยังไม่ได้อัปโหลด Blueprint</p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="bp in blueprints"
                  :key="bp.id"
                  class="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                  :class="currentBlueprintId === bp.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'"
                  @click="previewBlueprint(bp)"
                >
                  <div class="flex gap-3">
                    <div class="w-20 h-20 flex-shrink-0">
                      <img
                        :src="bp.url"
                        :alt="bp.name"
                        class="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ bp.name }}</p>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {{ bp.floorText }}
                        </span>
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {{ bp.typeText }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">Scale: {{ bp.scale }}</p>
                      <div class="mt-2 flex items-center justify-between">
                        <span class="text-xs text-gray-400">{{ formatDateShort(bp.createdAt) }}</span>
                        <div class="flex gap-2">
                          <button
                            @click.stop="openEditModal(bp)"
                            class="text-blue-600 hover:text-blue-700 text-xs"
                          >
                            แก้ไข
                          </button>
                          <button
                            @click.stop="deleteBlueprint(bp.id)"
                            class="text-red-600 hover:text-red-700 text-xs"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Action Bar -->
        <div class="mt-6 bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              <span v-if="blueprints.length === 0">
                ยังไม่ได้อัปโหลด Blueprint
              </span>
              <span v-else>
                อัปโหลดแล้ว <span class="font-medium text-gray-900">{{ blueprints.length }}</span> รูป
              </span>
            </div>
            <div class="flex gap-3">
              <BackButton @click="goToPrevStep" />
              <NextStepButton @click="goToNextStep" :disabled="blueprints.length === 0" />
            </div>
          </div>
        </div>

        <!-- Edit Blueprint Modal -->
        <div
          v-if="editingBlueprint"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          @click="closeEditModal"
        >
          <div
            class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">แก้ไข Blueprint</h3>
              <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <!-- Blueprint Preview -->
              <div class="mb-4">
                <img
                  :src="editingBlueprint.url"
                  :alt="editingBlueprint.name"
                  class="w-full h-48 object-cover rounded-lg border"
                />
                <p class="text-sm font-medium text-gray-900 mt-2">{{ editingBlueprint.name }}</p>
              </div>

              <!-- Floor Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ชั้น <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="editingBlueprint.editFloor"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="roof">ดาดฟ้า (Roof)</option>
                  <option value="2">ชั้น 2</option>
                  <option value="1">ชั้น 1</option>
                  <option value="ground">ชั้นจอด (Ground)</option>
                  <option value="basement">ชั้นใต้ดิน (Basement)</option>
                  <option value="site">แปลนไซต์ (Site Plan)</option>
                  <option value="section">Section / ตัดแบบ</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <!-- Blueprint Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ประเภทแปลน
                </label>
                <select
                  v-model="editingBlueprint.editType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                >
                  <option value="floor_plan">Floor Plan (แปลนชั้น)</option>
                  <option value="elevation">Elevation (ด้านข้าง)</option>
                  <option value="section">Section (ตัดแบบ)</option>
                  <option value="detail">Detail (รายละเอียด)</option>
                  <option value="riser">Riser Diagram (แปลนแนวตั้ง)</option>
                  <option value="site">Site Plan (แปลนไซต์)</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <!-- Scale Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  สเกลแปลน <span class="text-red-500">*</span>
                </label>

                <!-- Preset Scales -->
                <div class="mb-3">
                  <div class="grid grid-cols-4 gap-2">
                    <button
                      v-for="preset in scalePresets"
                      :key="preset.value"
                      @click="editingBlueprint.editScale = preset.value"
                      type="button"
                      class="px-3 py-2 text-sm border rounded-lg transition-colors"
                      :class="editingBlueprint.editScale === preset.value
                        ? 'bg-orange-600 border-orange-600 text-white'
                        : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'"
                    >
                      {{ preset.label }}
                    </button>
                  </div>
                </div>

                <!-- Custom Scale Input -->
                <input
                  v-model="editingBlueprint.editScale"
                  type="text"
                  placeholder="หรือกรอกเอง เช่น 1:150"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                <p class="text-xs text-gray-500 mt-1">
                  เลือก preset หรือกรอกสเกลเอง (รูปแบบ 1:100)
                </p>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  หมายเหตุ
                </label>
                <textarea
                  v-model="editingBlueprint.editNotes"
                  rows="3"
                  placeholder="ระบุรายละเอียดเพิ่มเติม..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-3 pt-4 border-t">
                <button
                  @click="closeEditModal"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  ยกเลิก
                </button>
                <button
                  @click="saveBlueprintEdit"
                  :disabled="!editingBlueprint.editScale"
                  class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Modal -->
        <div
          v-if="previewingBlueprint"
          class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          @click="previewingBlueprint = null"
        >
          <div
            class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            @click.stop
          >
            <div class="p-4 border-b flex items-center justify-between">
              <h3 class="text-lg font-medium">{{ previewingBlueprint.name }}</h3>
              <button @click="previewingBlueprint = null" class="text-gray-400 hover:text-gray-600">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-4">
              <img
                :src="previewingBlueprint.url"
                :alt="previewingBlueprint.name"
                class="w-full rounded"
              />
              <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium">ชั้น:</span> {{ previewingBlueprint.floorText }}
                </div>
                <div>
                  <span class="font-medium">ประเภท:</span> {{ previewingBlueprint.typeText }}
                </div>
                <div>
                  <span class="font-medium">สเกล:</span> {{ previewingBlueprint.scale }}
                </div>
                <div>
                  <span class="font-medium">อัปโหลด:</span> {{ formatDate(previewingBlueprint.createdAt) }}
                </div>
              </div>
              <div v-if="previewingBlueprint.notes" class="mt-3 p-3 bg-gray-50 rounded">
                <span class="font-medium">หมายเหตุ:</span> {{ previewingBlueprint.notes }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import VersionSteps from '~/components/workflow/VersionSteps.vue'
import BackButton from '~/components/navigation/BackButton.vue'
import NextStepButton from '~/components/navigation/NextStepButton.vue'
import { useVersionStore } from '~/stores/versionStore'
import { useWorkflowStore } from '~/stores/workflowStore'
import { documentsApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const versionStore = useVersionStore()
const workflowStore = useWorkflowStore()

// Computed
const versionId = computed(() => parseInt(route.params.versionId as string))

// State
const loading = ref(true)
const version = ref<any>(null)
const blueprintFile = ref<File | null>(null)
const blueprintFloor = ref('')
const blueprintType = ref('floor_plan')
const blueprintScale = ref('')
const manualNotes = ref('')
const saving = ref(false)
const blueprints = ref<any[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const currentBlueprintId = ref<number | null>(null)
const previewingBlueprint = ref<any>(null)
const editingBlueprint = ref<any>(null)

// Scale Presets
const scalePresets = [
  { value: '1:50', label: '1:50' },
  { value: '1:100', label: '1:100' },
  { value: '1:200', label: '1:200' },
  { value: '1:500', label: '1:500' },
]

// Computed
const existingBlueprint = computed(() => {
  if (!blueprintFloor.value || !blueprintType.value) return null
  return blueprints.value.find(
    bp => bp.floor === blueprintFloor.value && bp.type === blueprintType.value
  ) || null
})

// Methods
const loadVersion = async () => {
  loading.value = true
  try {
    const versionId = parseInt(route.params.versionId as string)
    const result = await versionStore.loadVersions(parseInt(route.params.id as string))

    if (result.success) {
      const found = versionStore.versions.find(v => v.id === versionId)
      if (found) {
        version.value = found
      }
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to load version')
  } finally {
    loading.value = false
  }
}

const loadFromAPI = async () => {
  try {
    const versionId = parseInt(route.params.versionId as string)
    console.log('📋 Loading blueprints for version:', versionId)
    const loadedBlueprints = await documentsApi.listByVersion(versionId)
    console.log('📋 Loaded blueprints:', loadedBlueprints)
    blueprints.value = loadedBlueprints || []
    console.log('📋 Blueprints state after load:', blueprints.value.length)
  } catch (error: any) {
    console.error('Failed to load blueprints from API:', error)
    blueprints.value = []
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 10MB')
      return
    }

    // Validate file type - only images allowed (PDF cannot be CSS background)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    if (!validTypes.includes(file.type)) {
      toast.error('Blueprint รองรับเฉพาะไฟล์รูปภาพ (PNG, JPG, GIF) เท่านั้น\nกรุณาแปลง PDF เป็นรูปภาพก่อนอัปโหลด')
      return
    }

    blueprintFile.value = file
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 10MB')
      return
    }

    // Validate file type - only images allowed (PDF cannot be CSS background)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    if (!validTypes.includes(file.type)) {
      toast.error('Blueprint รองรับเฉพาะไฟล์รูปภาพ (PNG, JPG, GIF) เท่านั้น\nกรุณาแปลง PDF เป็นรูปภาพก่อนอัปโหลด')
      return
    }

    blueprintFile.value = file
  }
}

const clearFile = () => {
  blueprintFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const cancelUpload = () => {
  blueprintFloor.value = ''
  blueprintType.value = 'floor_plan'
  blueprintFile.value = null
  blueprintScale.value = ''
  manualNotes.value = ''
}

const deleteExistingAndContinue = () => {
  if (existingBlueprint.value) {
    deleteBlueprint(existingBlueprint.value.id)
    toast.success('ลบ Blueprint เดิมเรียบร้อย')
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const getFloorText = (floor: string): string => {
  const floors: Record<string, string> = {
    roof: 'ดาดฟ้า',
    '2': 'ชั้น 2',
    '1': 'ชั้น 1',
    ground: 'ชั้นจอด',
    basement: 'ชั้นใต้ดิน',
    site: 'แปลนไซต์',
    section: 'Section / ตัดแบบ',
    other: 'อื่นๆ',
  }
  return floors[floor] || floor
}

// Get floor order number for sorting (lower = first)
const getFloorOrder = (floor: string): number => {
  const orders: Record<string, number> = {
    basement: 0,  // ชั้นใต้ดิน - อยู่ล่างสุด
    ground: 1,    // ชั้นจอด
    '1': 2,       // ชั้น 1
    '2': 3,       // ชั้น 2
    roof: 4,      // ดาดฟ้า
    site: 5,      // แปลนไซต์
    section: 6,   // Section
    other: 99,    // อื่นๆ - อยู่ท้ายสุด
  }
  return orders[floor] ?? 99
}

const getTypeText = (type: string): string => {
  const types: Record<string, string> = {
    floor_plan: 'Floor Plan',
    elevation: 'Elevation',
    section: 'Section',
    detail: 'Detail',
    riser: 'Riser Diagram',
    site: 'Site Plan',
    other: 'อื่นๆ',
  }
  return types[type] || type
}

const previewBlueprint = (bp: any) => {
  currentBlueprintId.value = bp.id
  previewingBlueprint.value = bp
}

const saveBlueprint = async () => {
  if (!blueprintFile.value) {
    toast.error('กรุณาเลือกไฟล์ Blueprint')
    return
  }

  if (!blueprintFloor.value) {
    toast.error('กรุณาระบุชั้น')
    return
  }

  if (!blueprintScale.value) {
    toast.error('กรุณาระบุสเกลแปลน')
    return
  }

  saving.value = true

  try {
    const versionId = parseInt(route.params.versionId as string)

    const uploadedBlueprint = await documentsApi.uploadForVersion(
      versionId,
      blueprintFile.value,
      {
        floor: blueprintFloor.value,
        type: blueprintType.value,
        scale: blueprintScale.value,
      }
    )

    // Insert in correct floor order (basement → ground → 1 → 2 → roof)
    const newFloorOrder = getFloorOrder(uploadedBlueprint.floor)
    let insertIndex = blueprints.value.length

    for (let i = 0; i < blueprints.value.length; i++) {
      const existingFloorOrder = getFloorOrder(blueprints.value[i].floor)
      if (newFloorOrder < existingFloorOrder) {
        insertIndex = i
        break
      }
    }

    // Add computed properties
    uploadedBlueprint.floorText = getFloorText(uploadedBlueprint.floor)
    uploadedBlueprint.typeText = getTypeText(uploadedBlueprint.type)

    blueprints.value.splice(insertIndex, 0, uploadedBlueprint)

    toast.success('อัปโหลด Blueprint เรียบร้อย')

    // Reset form
    blueprintFile.value = null
    blueprintFloor.value = ''
    blueprintType.value = 'floor_plan'
    blueprintScale.value = ''
    manualNotes.value = ''
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    toast.error(error.message || 'อัปโหลด Blueprint ไม่สำเร็จ')
  } finally {
    saving.value = false
  }
}

const deleteBlueprint = async (id: number) => {
  if (confirm('คุณต้องการลบ Blueprint นี้?')) {
    try {
      await documentsApi.delete(id)
      blueprints.value = blueprints.value.filter(bp => bp.id !== id)
      if (currentBlueprintId.value === id) {
        currentBlueprintId.value = null
        previewingBlueprint.value = null
      }
      toast.success('ลบ Blueprint เรียบร้อย')
    } catch (error: any) {
      toast.error(error.message || 'ลบ Blueprint ไม่สำเร็จ')
    }
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    month: 'short',
    day: 'numeric'
  })
}

const goToNextStep = () => {
  console.log('🚀🚀🚀 goToNextStep CLICKED! 🚀🚀🚀')
  console.log('📋 Blueprints count:', blueprints.value.length)
  console.log('📋 Blueprints array:', blueprints.value)

  if (blueprints.value.length === 0) {
    console.error('❌ No blueprints, blocking navigation')
    toast.error('กรุณาอัปโหลด Blueprint อย่างน้อย 1 รูป')
    return
  }

  const targetUrl = `/projects/${route.params.id}/versions/${route.params.versionId}/network`
  console.log('🎯 Navigating to:', targetUrl)

  try {
    router.push(targetUrl)
    console.log('✅ Navigation initiated')
  } catch (error) {
    console.error('❌ Navigation failed:', error)
  }
}

const goToPrevStep = () => {
  router.push(`/projects/${route.params.id}`)
}

const goBack = () => {
  router.push(`/projects/${route.params.id}`)
}

// Edit blueprint functions
const openEditModal = (bp: any) => {
  editingBlueprint.value = {
    ...bp,
    editFloor: bp.floor,
    editType: bp.type,
    editScale: bp.scale,
    editNotes: bp.notes || ''
  }
}

const closeEditModal = () => {
  editingBlueprint.value = null
}

const saveBlueprintEdit = () => {
  if (!editingBlueprint.value) return

  const blueprintIndex = blueprints.value.findIndex(bp => bp.id === editingBlueprint.value.id)
  if (blueprintIndex === -1) {
    toast.error('ไม่พบ Blueprint')
    return
  }

  // Update blueprint (in memory only - database update would require PUT endpoint)
  blueprints.value[blueprintIndex] = {
    ...blueprints.value[blueprintIndex],
    floor: editingBlueprint.value.editFloor,
    floorText: getFloorText(editingBlueprint.value.editFloor),
    type: editingBlueprint.value.editType,
    typeText: getTypeText(editingBlueprint.value.editType),
    scale: editingBlueprint.value.editScale,
    notes: editingBlueprint.value.editNotes,
  }

  toast.success('แก้ไข Blueprint เรียบร้อย')
  closeEditModal()
}

// Load version and blueprints on mount
onMounted(async () => {
  console.log('🔄 Page mounted, loading data...')
  await loadVersion()
  await loadFromAPI()

  // Set current step in workflow
  workflowStore.setCurrentStep('versionUpload')

  console.log('✅ Page mount complete, blueprints:', blueprints.value.length)
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard'
})
</script>
