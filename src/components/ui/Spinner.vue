<!-- components/ui/Spinner.vue -->
<template>
  <div class="spinner-container" :class="{ 'is-overlay': overlay }">
    <div
        class="spinner"
        :class="[`size-${size}`, { 'with-label': !!label }]"
        :style="{ borderColor: color, borderTopColor: 'transparent' }"
    ></div>
    <div v-if="label" class="spinner-label">{{ label }}</div>
  </div>
</template>

<script setup>
// Props
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: '#4f46e5'
  },
  label: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner-container.is-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 50;
}

.spinner {
  border-style: solid;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner.size-small {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}

.spinner.size-medium {
  width: 2.5rem;
  height: 2.5rem;
  border-width: 3px;
}

.spinner.size-large {
  width: 4rem;
  height: 4rem;
  border-width: 4px;
}

.spinner.with-label {
  margin-bottom: 0.75rem;
}

.spinner-label {
  font-size: 0.875rem;
  color: #6b7280;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
