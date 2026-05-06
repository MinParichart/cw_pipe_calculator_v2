<template>
  <div class="input-wrapper">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Prefix Icon/Solt -->
      <div v-if="$slots.prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <slot name="prefix"></slot>
      </div>

      <!-- Input Element -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Suffix Icon/Slot -->
      <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <slot name="suffix"></slot>
      </div>

      <!-- Error Icon -->
      <div
        v-if="error && !$slots.suffix"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <svg class="h-5 w-5 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Helper Text -->
    <p
      v-if="helperText && !error"
      class="mt-1 text-xs text-gray-500"
    >
      {{ helperText }}
    </p>

    <!-- Error Text -->
    <p
      v-if="error"
      class="mt-1 text-xs text-danger-600"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`
const isFocused = ref(false)

const inputClasses = computed(() => {
  const classes = []

  // Base styles
  classes.push('block w-full px-4 py-3 rounded-lg border transition-all duration-200')
  classes.push('text-base bg-white')

  // States
  if (props.disabled) {
    classes.push('bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed')
  } else if (props.readonly) {
    classes.push('bg-gray-50 border-gray-300')
  } else if (props.error) {
    classes.push('border-danger-500 focus:ring-danger-500 focus:border-danger-500')
  } else if (isFocused.value) {
    classes.push('border-primary-500 focus:ring-primary-500 focus:border-primary-500')
  } else {
    classes.push('border-gray-300 focus:border-primary-500 focus:ring-primary-500')
  }

  // Focus ring
  if (!props.disabled && !props.readonly) {
    classes.push('focus:outline-none focus:ring-2')
  }

  // Prefix/Suffix padding
  if (props.$slots?.prefix) {
    classes.push('pl-10')
  }
  if (props.$slots?.suffix || props.error) {
    classes.push('pr-10')
  }

  return classes.join(' ')
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}
</script>
