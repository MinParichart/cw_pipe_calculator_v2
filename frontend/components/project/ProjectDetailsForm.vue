<script setup lang="ts">
const props = defineProps<{
  project?: any
  criteria?: any
}>()

const emit = defineEmits<{
  submit: [project: any]
  cancel: []
}>()

const form = ref({
  name: props.project?.name || '',
  description: props.project?.description || '',
  buildingType: props.criteria?.buildingType || 'APARTMENT',
  floors: props.criteria?.floors || 1,
})

const buildingTypeOptions = [
  { value: 'APARTMENT', label: 'อาคารพักอาศัย/คอนโด' },
  { value: 'HOUSE', label: 'บ้านเดี่ยว/ทาวน์โฮม' },
  { value: 'OFFICE', label: 'อาคารสำนักงาน' },
  { value: 'HOSPITAL', label: 'โรงพยาบาล' },
  { value: 'SCHOOL', label: 'โรงเรียน' },
  { value: 'HOTEL', label: 'โรงแรม' },
  { value: 'FACTORY', label: 'โรงงาน' },
  { value: 'OTHER', label: 'อื่นๆ' },
]

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Header -->
    <div class="mb-4">
      <h3 class="text-lg font-bold text-gray-900">
        แก้ไขรายละเอียดโปรเจกต์
      </h3>
    </div>

    <!-- Project Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        ชื่อโปรเจกต์
      </label>
      <input
        v-model="form.name"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        required
        placeholder="เช่น บ้านลาดพร้าว 2 ชั้น"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        รายละเอียด
      </label>
      <textarea
        v-model="form.description"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        placeholder="รายละเอียดเกี่ยวกับโปรเจกต์..."
      />
    </div>

    <!-- Building Type & Floors -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          ประเภทอาคาร
        </label>
        <select
          v-model="form.buildingType"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          required
        >
          <option
            v-for="option in buildingTypeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          จำนวนชั้น
        </label>
        <input
          v-model.number="form.floors"
          type="number"
          min="1"
          max="100"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          required
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-3 border-t">
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
      >
        บันทึก
      </button>
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
      >
        ยกเลิก
      </button>
    </div>
  </form>
</template>
