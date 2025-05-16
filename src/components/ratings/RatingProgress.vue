<!-- components/ratings/RatingProgress.vue -->
<template>
  <div class="rating-progress">
    <div class="progress-bar">
      <div
          class="progress-fill"
          :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>

    <div class="progress-text">
      Question {{ currentStep }} of {{ totalSteps }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  totalSteps: {
    type: Number,
    required: true
  }
})

// Compute progress percentage
const progressPercentage = computed(() => {
  if (props.totalSteps <= 0) return 0
  return (props.currentStep / props.totalSteps) * 100
})
</script>

<style scoped>
.rating-progress {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #4f46e5;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}
</style>
