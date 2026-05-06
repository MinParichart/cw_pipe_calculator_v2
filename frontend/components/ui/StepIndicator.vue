<template>
  <div class="step-indicator">
    <!-- Progress Bar Background -->
    <div class="progress-line-bg"></div>

    <!-- Progress Bar Fill -->
    <div
      class="progress-line-fill"
      :style="{ width: progressPercentage + '%' }"
    ></div>

    <!-- Steps -->
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="step-item"
      :class="getStepClasses(index)"
      @click="onStepClick(index)"
    >
      <!-- Step Circle -->
      <div class="step-circle" :class="getStepCircleClasses(index)">
        <!-- Complete Icon -->
        <svg
          v-if="isStepComplete(index)"
          class="step-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>

        <!-- Current Icon -->
        <svg
          v-else-if="isStepCurrent(index)"
          class="step-icon step-icon-current"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>

        <!-- Pending Number -->
        <span v-else class="step-number">
          {{ index + 1 }}
        </span>
      </div>

      <!-- Step Labels -->
      <div class="step-labels">
        <div class="step-title">{{ step.title }}</div>
        <div class="step-description">{{ step.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true,
    default: () => []
  },
  currentStep: {
    type: Number,
    default: 0
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['step-click'])

const progressPercentage = computed(() => {
  if (props.steps.length === 0) return 0
  return (props.currentStep / (props.steps.length - 1)) * 100
})

const isStepComplete = (index) => {
  return index < props.currentStep
}

const isStepCurrent = (index) => {
  return index === props.currentStep
}

const getStepClasses = (index) => {
  return {
    'step-complete': isStepComplete(index),
    'step-current': isStepCurrent(index),
    'step-pending': !isStepComplete(index) && !isStepCurrent(index),
    'step-clickable': props.clickable
  }
}

const getStepCircleClasses = (index) => {
  return {
    'circle-complete': isStepComplete(index),
    'circle-current': isStepCurrent(index),
    'circle-pending': !isStepComplete(index) && !isStepCurrent(index)
  }
}

const onStepClick = (index) => {
  if (props.clickable && index <= props.currentStep) {
    emit('step-click', index)
  }
}
</script>

<style scoped>
.step-indicator {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem 1rem;
  margin-bottom: 2rem;
  gap: 1rem;
}

.progress-line-bg {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #E0E0E0;
  transform: translateY(-50%);
  z-index: 0;
}

.progress-line-fill {
  position: absolute;
  top: 50%;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #4CAF50 0%, #2196F3 100%);
  transform: translateY(-50%);
  transition: width 0.5s ease-in-out;
  z-index: 0;
}

.step-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: default;
  flex: 1;
  min-width: 120px;
}

.step-item.step-clickable {
  cursor: pointer;
}

.step-item.step-clickable .step-circle:hover {
  transform: scale(1.1);
}

.step-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s ease;
  background-color: #FFFFFF;
  border: 2px solid #E0E0E0;
}

.step-circle.circle-complete {
  background-color: #4CAF50;
  border-color: #4CAF50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

.step-circle.circle-current {
  background-color: #2196F3;
  border-color: #2196F3;
  border-width: 3px;
  box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.2);
  animation: pulse-current 2s infinite;
}

@keyframes pulse-current {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(33, 150, 243, 0.1);
  }
}

.step-circle.circle-pending {
  background-color: #FFFFFF;
  border-color: #E0E0E0;
}

.step-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.step-icon-current {
  width: 20px;
  height: 20px;
}

.step-number {
  color: #6B7280;
  font-size: 16px;
  font-weight: 600;
}

.step-labels {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.75rem;
  text-align: center;
  min-width: 140px;
}

.step-title {
  font-size: 0.875rem;
  font-weight: 600;
  transition: color 0.3s ease;
}

.step-description {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  transition: color 0.3s ease;
}

.step-complete .step-title {
  color: #111827;
}

.step-complete .step-description {
  color: #374151;
}

.step-current .step-title {
  color: #2563EB;
}

.step-current .step-description {
  color: #3B82F6;
}

.step-pending .step-title {
  color: #6B7280;
}

.step-pending .step-description {
  color: #9CA3AF;
}

@media (max-width: 768px) {
  .step-indicator {
    padding: 1rem 0.5rem;
    margin-bottom: 1rem;
  }

  .step-item {
    min-width: 80px;
  }

  .step-circle {
    width: 40px;
    height: 40px;
  }

  .step-labels {
    min-width: 100px;
  }

  .step-title {
    font-size: 0.75rem;
  }

  .step-description {
    display: none;
  }
}

@media (max-width: 480px) {
  .step-item {
    min-width: 60px;
  }

  .step-circle {
    width: 32px;
    height: 32px;
  }

  .step-labels {
    min-width: 70px;
  }

  .step-title {
    font-size: 0.625rem;
  }
}
</style>
