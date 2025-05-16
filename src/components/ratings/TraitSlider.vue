<!-- components/ratings/TraitSlider.vue -->
<template>
  <div class="trait-slider">
    <div class="trait-labels">
      <div class="trait-label positive">{{ positiveLabel }}</div>
      <div class="trait-label negative">{{ negativeLabel }}</div>
    </div>

    <div class="slider-container">
      <div class="slider-track">
        <div
            class="slider-progress"
            :style="{ width: progressWidth + '%', left: progressLeft + '%' }"
        ></div>
      </div>

      <div class="slider-marks">
        <div class="mark positive-max" @click="setValue(1)">
          <div class="mark-indicator" :class="{ active: modelValue === 1 }"></div>
          <div class="mark-label">Very {{ positiveLabel }}</div>
        </div>

        <div class="mark positive" @click="setValue(0.5)">
          <div class="mark-indicator" :class="{ active: modelValue === 0.5 }"></div>
          <div class="mark-label">Somewhat {{ positiveLabel }}</div>
        </div>

        <div class="mark neutral" @click="setValue(0)">
          <div class="mark-indicator" :class="{ active: modelValue === 0 }"></div>
          <div class="mark-label">Neutral</div>
        </div>

        <div class="mark negative" @click="setValue(-0.5)">
          <div class="mark-indicator" :class="{ active: modelValue === -0.5 }"></div>
          <div class="mark-label">Somewhat {{ negativeLabel }}</div>
        </div>

        <div class="mark negative-max" @click="setValue(-1)">
          <div class="mark-indicator" :class="{ active: modelValue === -1 }"></div>
          <div class="mark-label">Very {{ negativeLabel }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props and emits
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  positiveLabel: {
    type: String,
    required: true
  },
  negativeLabel: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Convert rating value (-1 to 1) to progress width percentage
const progressWidth = computed(() => {
  // If the value is negative, we need the width to be half of the slider plus the percentage from center
  if (props.modelValue < 0) {
    return Math.abs(props.modelValue) * 50
  }

  // If the value is positive, we need the width to be half of the slider plus the percentage from center
  return props.modelValue * 50
})

// Compute the starting position of the progress bar
const progressLeft = computed(() => {
  // If negative, start from the center (50%) - the width
  if (props.modelValue < 0) {
    return 50 - progressWidth.value
  }

  // If positive or neutral, start from center (50%)
  return 50
})

// Set the value when clicking on a mark
const setValue = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.trait-slider {
  width: 100%;
  padding: 2rem 0;
}

.trait-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.trait-label {
  font-weight: 600;
  font-size: 1rem;
}

.trait-label.positive {
  color: #16a34a;
}

.trait-label.negative {
  color: #dc2626;
}

.slider-container {
  margin: 0 1rem;
}

.slider-track {
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  position: relative;
  margin-bottom: 2rem;
}

.slider-progress {
  position: absolute;
  height: 100%;
  background-color: #4f46e5;
  border-radius: 9999px;
}

.slider-marks {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.mark {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.mark-indicator {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: 2px solid #e5e7eb;
  background-color: white;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.mark-indicator.active {
  border-color: #4f46e5;
  background-color: #4f46e5;
  transform: scale(1.1);
}

.mark-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.mark.positive-max .mark-indicator.active {
  border-color: #16a34a;
  background-color: #16a34a;
}

.mark.negative-max .mark-indicator.active {
  border-color: #dc2626;
  background-color: #dc2626;
}

@media (max-width: 640px) {
  .mark-label {
    font-size: 0.6rem;
  }
}
</style>
