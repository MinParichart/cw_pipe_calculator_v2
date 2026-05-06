<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12c0-4.411-3.589-8-8-8v4zm8 0a8 8 0 00-8-8v8h8z"
      ></path>
    </svg>

    <!-- Icon Slot -->
    <slot name="icon"></slot>

    <!-- Default Slot (Text) -->
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'text', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const classes = []

  // Base styles
  classes.push('inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2')

  // Size
  if (props.size === 'small') {
    classes.push('px-4 py-2 text-sm')
  } else if (props.size === 'medium') {
    classes.push('px-6 py-3 text-base')
  } else if (props.size === 'large') {
    classes.push('px-8 py-4 text-lg')
  }

  // Variant & State
  if (props.disabled || props.loading) {
    classes.push('opacity-50 cursor-not-allowed')
  } else {
    if (props.variant === 'primary') {
      classes.push('bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500')
    } else if (props.variant === 'secondary') {
      classes.push('bg-transparent text-primary-500 border-2 border-primary-500 hover:bg-primary-50 focus:ring-primary-500')
    } else if (props.variant === 'text') {
      classes.push('bg-transparent text-primary-500 hover:text-primary-600 hover:underline focus:ring-primary-500')
    } else if (props.variant === 'danger') {
      classes.push('bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500')
    }
  }

  // Full width
  if (props.fullWidth) {
    classes.push('w-full')
  }

  return classes.join(' ')
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
