<!-- views/AuthView.vue -->
<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-logo">
        <img src="../assets/logo.svg" alt="Character Rating" class="logo" />
      </div>

      <div class="auth-card">
        <!-- Use router-view instead of conditionally rendering components based on step -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { resetFlow } = useAuth()

// Only reset flow on component mount if not in a specific auth route
onMounted(() => {
  console.log("AuthView mounted, current route:", route.path)

  // Only reset if we're just at the main auth route
  if (route.path === '/auth') {
    console.log("Resetting flow on mount")
    resetFlow()
  }
})
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 480px;
}

.auth-logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  height: 80px;
}

.auth-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
