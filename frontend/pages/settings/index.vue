<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">ตั้งค่าระบบ</h1>
          <p class="mt-1 text-sm text-gray-600">
            ปรับแต่งการตั้งค่าตามความต้องการของคุณ
          </p>
        </div>

        <div class="space-y-6">
          <!-- Units Settings -->
          <div class="card">
            <div class="flex items-center mb-4">
              <svg class="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h2 class="text-lg font-medium text-gray-900">หน่วยวัด</h2>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ระบบหน่วยวัด
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <label class="relative flex cursor-pointer">
                    <input
                      v-model="settings.unitSystem"
                      type="radio"
                      value="si"
                      class="peer sr-only"
                    >
                    <div class="w-full rounded-lg border-2 border-gray-200 p-4 text-center peer-checked:border-primary peer-checked:bg-blue-600 peer-checked:bg-opacity-5 transition-all">
                      <div class="text-2xl mb-2">📏</div>
                      <div class="font-medium text-gray-900">Metric (SI)</div>
                      <div class="text-xs text-gray-500 mt-1">เมตร, บาร์, ลิตร/วินาที</div>
                    </div>
                  </label>
                  <label class="relative flex cursor-pointer">
                    <input
                      v-model="settings.unitSystem"
                      type="radio"
                      value="imperial"
                      class="peer sr-only"
                    >
                    <div class="w-full rounded-lg border-2 border-gray-200 p-4 text-center peer-checked:border-primary peer-checked:bg-blue-600 peer-checked:bg-opacity-5 transition-all">
                      <div class="text-2xl mb-2">🇺🇸</div>
                      <div class="font-medium text-gray-900">Imperial</div>
                      <div class="text-xs text-gray-500 mt-1">ฟุต, PSI, GPM</div>
                    </div>
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    หน่วยความยาว
                  </label>
                  <select
                    v-model="settings.lengthUnit"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="m">เมตร (m)</option>
                    <option value="ft">ฟุต (ft)</option>
                    <option value="in">นิ้ว (in)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    หน่วยความดัน
                  </label>
                  <select
                    v-model="settings.pressureUnit"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="bar">บาร์ (bar)</option>
                    <option value="psi">PSI</option>
                    <option value="kPa">กิโลปาสคาล (kPa)</option>
                    <option value="mwg">เมตรน้ำ (m.wg)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    หน่วยอัตราการไหล
                  </label>
                  <select
                    v-model="settings.flowRateUnit"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="lps">ลิตร/วินาที (LPS)</option>
                    <option value="gpm">GPM</option>
                    <option value="lpm">ลิตร/นาที (LPM)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    หน่วยเส้นผ่านศูนย์กลางท่อ
                  </label>
                  <select
                    v-model="settings.pipeDiameterUnit"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="in">นิ้ว (in)</option>
                    <option value="mm">มิลลิเมตร (mm)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Calculation Defaults -->
          <div class="card">
            <div class="flex items-center mb-4">
              <svg class="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 class="text-lg font-medium text-gray-900">ค่าเริ่มต้นการคำนวณ</h2>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    ค่า C-Factor เริ่มต้น
                  </label>
                  <input
                    v-model.number="settings.defaultCFactor"
                    type="number"
                    min="1"
                    max="150"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                  <p class="text-xs text-gray-500 mt-1">
                    ท่อ PVC: 120-150, เหล็ก: 100-130, ทองแดง: 130-150
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    ความดันน้ำแรงเข้าเริ่มต้น (bar)
                  </label>
                  <input
                    v-model.number="settings.defaultInletPressure"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    ความดันต่ำสุดที่ต้องการ (bar)
                  </label>
                  <input
                    v-model.number="settings.defaultMinPressure"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    ระดับท่อแขวนสูงสุดเริ่มต้น (เมตร)
                  </label>
                  <input
                    v-model.number="settings.defaultMaxPipeHeight"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  ประเภทอาคารเริ่มต้น
                </label>
                <select
                  v-model="settings.defaultBuildingType"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="residential">ที่อยู่อาศัย</option>
                  <option value="commercial">พาณิชย์</option>
                  <option value="industrial">อุตสาหกรรม</option>
                  <option value="institutional">สถาบัน</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Display Settings -->
          <div class="card">
            <div class="flex items-center mb-4">
              <svg class="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h2 class="text-lg font-medium text-gray-900">การแสดงผล</h2>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  ภาษา
                </label>
                <select
                  v-model="settings.language"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="th">ไทย</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    v-model="settings.showCalculationSteps"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-primary"
                  >
                  <span class="ml-2 text-sm text-gray-700">แสดงขั้นตอนการคำนวณโดยเริ่มต้น</span>
                </label>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    v-model="settings.autoSave"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-primary"
                  >
                  <span class="ml-2 text-sm text-gray-700">บันทึกอัตโนมัติทุก 5 นาที</span>
                </label>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    v-model="settings.darkMode"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-primary"
                  >
                  <span class="ml-2 text-sm text-gray-700">โหมดมืด</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="card">
            <div class="flex items-center mb-4">
              <svg class="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h2 class="text-lg font-medium text-gray-900">การแจ้งเตือน</h2>
            </div>

            <div class="space-y-4">
              <div>
                <label class="flex items-center">
                  <input
                    v-model="settings.notifications.email"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-primary"
                  >
                  <span class="ml-2 text-sm text-gray-700">อีเมล</span>
                </label>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    v-model="settings.notifications.browser"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-primary"
                  >
                  <span class="ml-2 text-sm text-gray-700">เบราว์เซอร์</span>
                </label>
              </div>

              <div class="border-t pt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">แจ้งเตือนเมื่อ:</p>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="settings.notifications.calculationComplete"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-primary"
                    >
                    <span class="ml-2 text-sm text-gray-700">คำนวณเสร็จสิ้น</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="settings.notifications.projectShared"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-primary"
                    >
                    <span class="ml-2 text-sm text-gray-700">โปรเจกต์ถูกแชร์</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="settings.notifications.versionSaved"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-primary"
                    >
                    <span class="ml-2 text-sm text-gray-700">บันทึกเวอร์ชัน</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex gap-4">
            <button
              @click="saveSettings"
              :disabled="saving"
              class="flex-1 btn btn-primary text-lg py-3"
            >
              <span v-if="saving">กำลังบันทึก...</span>
              <span v-else>บันทึกการตั้งค่า</span>
            </button>
            <button
              @click="resetToDefaults"
              class="btn btn-secondary"
            >
              คืนค่าเริ่มต้น
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

// State
const saving = ref(false)
const settings = ref({
  // Units
  unitSystem: 'si',
  lengthUnit: 'm',
  pressureUnit: 'bar',
  flowRateUnit: 'lps',
  pipeDiameterUnit: 'mm',

  // Calculation defaults
  defaultCFactor: 120,
  defaultInletPressure: 3.0,
  defaultMinPressure: 1.5,
  defaultMaxPipeHeight: 3.0,
  defaultBuildingType: 'residential',

  // Display
  language: 'th',
  showCalculationSteps: false,
  autoSave: true,
  darkMode: false,

  // Notifications
  notifications: {
    email: true,
    browser: false,
    calculationComplete: true,
    projectShared: true,
    versionSaved: false,
  },
})

// Methods
const loadSettings = async () => {
  try {
    // TODO: Load from API
    // const data = await settingsApi.get()
    // settings.value = data
  } catch (error: any) {
    console.error('Failed to load settings:', error)
  }
}

const saveSettings = async () => {
  saving.value = true

  try {
    // TODO: Save to API
    // await settingsApi.update(settings.value)
    await new Promise(resolve => setTimeout(resolve, 500))

    toast.success('บันทึกการตั้งค่าเรียบร้อย')
  } catch (error: any) {
    toast.error(error.message || 'Failed to save settings')
  } finally {
    saving.value = false
  }
}

const resetToDefaults = () => {
  if (confirm('คุณแน่ใจหรือไม่ที่จะคืนค่าการตั้งค่าทั้งหมด?')) {
    settings.value = {
      unitSystem: 'si',
      lengthUnit: 'm',
      pressureUnit: 'bar',
      flowRateUnit: 'lps',
      pipeDiameterUnit: 'mm',
      defaultCFactor: 120,
      defaultInletPressure: 3.0,
      defaultMinPressure: 1.5,
      defaultMaxPipeHeight: 3.0,
      defaultBuildingType: 'residential',
      language: 'th',
      showCalculationSteps: false,
      autoSave: true,
      darkMode: false,
      notifications: {
        email: true,
        browser: false,
        calculationComplete: true,
        projectShared: true,
        versionSaved: false,
      },
    }
    toast.success('คืนค่าเริ่มต้นเรียบร้อย')
  }
}

// Load settings on mount
onMounted(() => {
  loadSettings()
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard',
})
</script>
