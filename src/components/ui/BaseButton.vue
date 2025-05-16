<!-- components/ui/BaseButton.vue -->
<template>
  <button
      :class="buttonClasses"
      :type="type"
      :disabled="disabled || loading"
      @click="handleClick"
  >
    <!-- Loading spinner -->
    <div v-if="loading" class="spinner"></div>

    <!-- Button content -->
    <span v-if="loading && loadingText" class="button-text">{{ loadingText }}</span>
    <span v-else class="button-text"><slot></slot></span>

    <!-- Right icon if provided -->
    <span v-if="rightIcon && !loading" class="right-icon">
      <slot name="right-icon"></slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'tertiary', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: ''
  },
  rightIcon: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// Compute button classes based on props
const buttonClasses = computed(() => {
  return {
    'base-button': true,
    [`variant-${props.variant}`]: true,
    [`size-${props.size}`]: true,
    'is-loading': props.loading,
    'is-block': props.block,
    'has-right-icon': props.rightIcon && !props.loading
  }
})

// Handle click event
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

/* Variant styles */
.variant-primary {
  background-color: #4f46e5;
  color: white;
}

.variant-primary:hover:not(:disabled) {
  background-color: #4338ca;
}

.variant-primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.4);
}

.variant-secondary {
  background-color: white;
  color: #4b5563;
  border-color: #d1d5db;
}

.variant-secondary:hover:not(:disabled) {
  background-color: #f9fafb;
}

.variant-secondary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.4);
}

.variant-tertiary {
  background-color: transparent;
  color: #4f46e5;
}

.variant-tertiary:hover:not(:disabled) {
  background-color: rgba(79, 70, 229, 0.1);
}

.variant-tertiary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.variant-danger {
  background-color: #ef4444;
  color: white;
}

.variant-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.variant-danger:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.4);
}

/* Size styles */
.size-small {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
}

.size-medium {
  font-size: 0.875rem;
  padding: 0.625rem 1rem;
}

.size-large {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
}

/* Block style */
.is-block {
  display: flex;
  width: 100%;
}

/* Disabled state */
.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading state */
.is-loading {
  cursor: wait;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Right icon */
.right-icon {
  margin-left: 0.25rem;
  display: flex;
  align-items: center;
}
</style>
