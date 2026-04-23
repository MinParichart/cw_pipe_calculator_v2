<script setup lang="ts">
const props = defineProps<{
  stepName?: string
  nextRoute?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button
    @click="handleClick"
    :disabled="disabled"
    class="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span>ดำเนินการต่อ</span>
    <svg
      class="ml-2 h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  </button>
</template>
