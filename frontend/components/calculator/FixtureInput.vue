<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-medium text-gray-900">บ้าน/ชั้นที่ {{ floorNumber }}</h3>
      <p class="mt-1 text-sm text-gray-500">ระบุจำนวนสุขัณฑ์ในแต่ละชนิด</p>
    </div>

    <!-- Bathroom Fixtures -->
    <div class="bg-gray-50 rounded-lg p-4 space-y-4">
      <h4 class="text-sm font-medium text-gray-700 flex items-center">
        <svg class="h-4 w-4 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        ห้องน้ำ
      </h4>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- WC Flush Tank -->
        <div class="fixture-input">
          <label class="label">โถส้วมมุอ้วก</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.wcTank"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.WC_TANK.total }}</span>
          </div>
        </div>

        <!-- WC Flush Valve -->
        <div class="fixture-input">
          <label class="label">โถส้วมลูกสูบ</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.wcValve"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.WC_VALVE.total }}</span>
          </div>
        </div>

        <!-- Lavatory -->
        <div class="fixture-input">
          <label class="label">อ่างล้างหน้า</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.lavatory"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.LAVATORY.total }}</span>
          </div>
        </div>

        <!-- Shower -->
        <div class="fixture-input">
          <label class="label">ฝักบัวอาบน้ำ</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.shower"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.SHOWER.total }}</span>
          </div>
        </div>

        <!-- Bathtub -->
        <div class="fixture-input">
          <label class="label">อ่างอาบน้ำ</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.bathtub"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.BATHTUB.total }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Kitchen & Laundry -->
    <div class="bg-gray-50 rounded-lg p-4 space-y-4">
      <h4 class="text-sm font-medium text-gray-700 flex items-center">
        <svg class="h-4 w-4 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        ครัวและห้องซักผ้า
      </h4>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Kitchen Sink -->
        <div class="fixture-input">
          <label class="label">อ่างล้างจาน</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.kitchenSink"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.KITCHEN_SINK.total }}</span>
          </div>
        </div>

        <!-- Dishwasher -->
        <div class="fixture-input">
          <label class="label">เครื่องล้างจาน</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.dishwasher"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.DISHWASHER.total }}</span>
          </div>
        </div>

        <!-- Laundry Tray -->
        <div class="fixture-input">
          <label class="label">อ่างล้างผ้า</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.laundryTray"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.LAUNDRY_TRAY.total }}</span>
          </div>
        </div>

        <!-- Washing Machine 3.5kg -->
        <div class="fixture-input">
          <label class="label">เครื่องซักผ้า 3.5 กก.</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.washingMachine35"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.WASHING_MACHINE_3_5KG.total }}</span>
          </div>
        </div>

        <!-- Washing Machine 7kg -->
        <div class="fixture-input">
          <label class="label">เครื่องซักผ้า 7 กก.</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.washingMachine7"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.WASHING_MACHINE_7KG.total }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- External -->
    <div class="bg-gray-50 rounded-lg p-4 space-y-4">
      <h4 class="text-sm font-medium text-gray-700 flex items-center">
        <svg class="h-4 w-4 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        ภายนอกอาคาร
      </h4>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="fixture-input">
          <label class="label">ก๊อกน้ำกลางแจ้ง (Hose Bibb)</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.hoseBibb"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.HOSE_BIBB.total }}</span>
          </div>
        </div>

        <div class="fixture-input">
          <label class="label">เครื่องดื่มน้ำดื่ม</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.drinkingFountain"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.DRINKING_FOUNTAIN.total }}</span>
          </div>
        </div>

        <div class="fixture-input">
          <label class="label">สุขา (Urinal)</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.urinalValve"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.URINAL_VALVE.total }}</span>
          </div>
        </div>

        <div class="fixture-input">
          <label class="label">อ่างล้างขนาดใหญ่ (Service Sink)</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="localFixtures.serviceSink"
              type="number"
              min="0"
              class="input"
              @input="$emit('update:fixtures', localFixtures)"
            />
            <span class="text-xs text-gray-500">FU: {{ FIXTURE_UNITS.SERVICE_SINK.total }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FU Summary -->
    <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-primary-900">Fixture Units รวม</h4>
          <p class="text-xs text-primary-600">จากชั้นที่ {{ floorNumber }}</p>
        </div>
        <div class="text-2xl font-bold text-primary-600">
          {{ totalFU }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FIXTURE_UNITS } from '~/composables/usePipeCalculator'

interface FixtureInput {
  wcTank: number
  wcValve: number
  lavatory: number
  bathtub: number
  shower: number
  kitchenSink: number
  laundryTray: number
  dishwasher: number
  washingMachine35: number
  washingMachine7: number
  hoseBibb: number
  drinkingFountain: number
  urinalValve: number
  serviceSink: number
}

const props = defineProps<{
  fixtures: FixtureInput
  floorNumber: number
}>()

const emit = defineEmits<{
  'update:fixtures': [fixtures: FixtureInput]
}>()

const localFixtures = ref<FixtureInput>({ ...props.fixtures })

// Watch for external changes
watch(() => props.fixtures, (newVal) => {
  localFixtures.value = { ...newVal }
}, { deep: true })

// Calculate total FU
const totalFU = computed(() => {
  const mapping: Record<keyof FixtureInput, number> = {
    wcTank: FIXTURE_UNITS.WC_TANK.total,
    wcValve: FIXTURE_UNITS.WC_VALVE.total,
    lavatory: FIXTURE_UNITS.LAVATORY.total,
    bathtub: FIXTURE_UNITS.BATHTUB.total,
    shower: FIXTURE_UNITS.SHOWER.total,
    kitchenSink: FIXTURE_UNITS.KITCHEN_SINK.total,
    laundryTray: FIXTURE_UNITS.LAUNDRY_TRAY.total,
    dishwasher: FIXTURE_UNITS.DISHWASHER.total,
    washingMachine35: FIXTURE_UNITS.WASHING_MACHINE_3_5KG.total,
    washingMachine7: FIXTURE_UNITS.WASHING_MACHINE_7KG.total,
    hoseBibb: FIXTURE_UNITS.HOSE_BIBB.total,
    drinkingFountain: FIXTURE_UNITS.DRINKING_FOUNTAIN.total,
    urinalValve: FIXTURE_UNITS.URINAL_VALVE.total,
    serviceSink: FIXTURE_UNITS.SERVICE_SINK.total,
  }

  return Object.entries(localFixtures.value).reduce((sum, [key, value]) => {
    return sum + (value * (mapping[key as keyof FixtureInput] || 0))
  }, 0)
})
</script>

<style scoped>
.fixture-input label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
</style>
