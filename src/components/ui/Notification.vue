<!-- components/ui/Notification.vue -->
<template>
  <transition name="notification">
    <div v-if="show" class="notification" :class="notificationClass">
      <!-- Icon -->
      <div class="notification-icon">
        <!-- Success Icon -->
        <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
        </svg>

        <!-- Info Icon -->
        <svg v-else-if="type === 'info'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
        </svg>

        <!-- Warning Icon -->
        <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
        </svg>

        <!-- Error Icon -->
        <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Content -->
      <div class="notification-content">
        {{ message }}
      </div>

      <!-- Close button -->
      <button @click="close" class="notification-close">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'info', 'warning', 'error'].includes(value)
  },
  message: {
    type: String,
    required: true
  }
})

// Emit events
const emit = defineEmits(['close'])

// Compute class based on notification type
const notificationClass = computed(() => {
  return {
    [`type-${props.type}`]: true
  }
})

// Close notification
const close = () => {
  emit('close')
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  max-width: 20rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  z-index: 100;
}

.notification.type-success {
  background-color: #f0fdf4;
  border-left: 4px solid #22c55e;
}

.notification.type-info {
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
}

.notification.type-warning {
  background-color: #fffbeb;
  border-left: 4px solid #f59e0b;
}

.notification.type-error {
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
}

.notification-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.type-success .notification-icon {
  color: #16a34a;
}

.type-info .notification-icon {
  color: #2563eb;
}

.type-warning .notification-icon {
  color: #d97706;
}

.type-error .notification-icon {
  color: #dc2626;
}

.notification-content {
  flex: 1;
  font-size: 0.875rem;
  color: #4b5563;
  margin-top: 0.125rem;
}

.notification-close {
  width: 1.5rem;
  height: 1.5rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  color: #6b7280;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
