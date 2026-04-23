<template>
  <div v-if="toasts.length > 0" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md animate-slide-in',
        toastClasses[toast.type]
      ]"
    >
      <div class="flex items-start gap-3">
        <span class="text-xl">{{ toastIcons[toast.type] }}</span>
        <div class="flex-1">
          <p class="font-medium">{{ toast.message }}</p>
        </div>
        <button
          @click="removeToast(toast.id)"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

const toasts = ref<Toast[]>([])
let toastId = 0

const toastClasses = {
  success: 'bg-green-50 border border-green-200 text-green-800',
  error: 'bg-red-50 border border-red-200 text-red-800',
  warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border border-blue-200 text-blue-800',
}

const toastIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

const addToast = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
  const id = toastId++
  toasts.value.push({ id, message, type })

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expose methods globally
defineExpose({
  addToast,
  removeToast,
})

// Provide toast methods for composables
provide('toast', {
  success: (message: string, duration?: number) => addToast(message, 'success', duration),
  error: (message: string, duration?: number) => addToast(message, 'error', duration),
  warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
  info: (message: string, duration?: number) => addToast(message, 'info', duration),
})
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
