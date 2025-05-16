<!-- App.vue - Root component -->
<template>
  <div class="app-container">
    <AppHeader />
    <Notification v-if="notification.show"
                  :type="notification.type"
                  :message="notification.message"
                  @close="closeNotification" />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import AppHeader from './components/ui/AppHeader.vue'
import AppFooter from './components/ui/AppFooter.vue'
import Notification from './components/ui/Notification.vue'

// Notification state
const notification = reactive({
  show: false,
  type: 'info',
  message: '',
  timeout: null
})

// Handle showing notifications
const showNotification = (message, type = 'info', duration = 3000) => {
  // Clear any existing timeout
  if (notification.timeout) {
    clearTimeout(notification.timeout)
  }

  // Set notification data
  notification.show = true
  notification.type = type
  notification.message = message

  // Auto-hide after duration
  notification.timeout = setTimeout(() => {
    closeNotification()
  }, duration)
}

// Close notification
const closeNotification = () => {
  notification.show = false
}

// Expose notification function to other components
defineExpose({ showNotification })
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
