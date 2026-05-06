<template>
  <div
    :class="cardClasses"
    @click="handleClick"
  >
    <!-- Header Slot -->
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200">
      <slot name="header"></slot>
    </div>

    <!-- Default Slot -->
    <div :class="paddingClasses">
      <slot></slot>
    </div>

    <!-- Footer Slot -->
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'normal',
    validator: (value) => ['none', 'small', 'normal', 'large'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const cardClasses = computed(() => {
  const classes = []

  // Base styles
  classes.push('bg-white rounded-lg transition-all duration-300')

  // Shadow
  if (props.hoverable || props.clickable) {
    classes.push('hover:shadow-lg')
  } else {
    classes.push('shadow-md')
  }

  // Border
  if (props.border) {
    classes.push('border border-gray-200')
  }

  // Cursor
  if (props.clickable) {
    classes.push('cursor-pointer')
  }

  return classes.join(' ')
})

const paddingClasses = computed(() => {
  if (props.padding === 'none') return ''
  if (props.padding === 'small') return 'px-4 py-3'
  if (props.padding === 'normal') return 'px-6 py-4'
  if (props.padding === 'large') return 'px-8 py-6'
  return ''
})

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>
