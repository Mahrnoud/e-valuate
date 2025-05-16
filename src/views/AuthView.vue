<!-- views/AuthView.vue -->
<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-logo">
        <img src="../assets/logo.svg" alt="Character Rating" class="logo" />
      </div>

      <div class="auth-card">
        <transition name="fade" mode="out-in">
          <!-- Show phone login step -->
          <PhoneLogin v-if="step === 'phone'" />

          <!-- Show verification code step -->
          <VerificationCode v-else-if="step === 'code'" />

          <!-- Show complete profile step -->
          <CompleteProfile v-else-if="step === 'profile'" />
        </transition>
      </div>
    </div>

    <!-- Debug element to see current step (can be removed in production) -->
    <div class="debug-info" style="position: fixed; bottom: 10px; right: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px; font-size: 12px; color: #666;">
      Current step: {{ step }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import PhoneLogin from '../components/auth/PhoneLogin.vue'
import VerificationCode from '../components/auth/VerificationCode.vue'
import CompleteProfile from '../components/auth/CompleteProfile.vue'

// Get step from auth composable
const { step, resetFlow } = useAuth()

// Only reset flow on component mount if not already in progress
onMounted(() => {
  console.log("AuthView mounted, current step:", step.value)

  // Only reset if we're not in the middle of a flow
  if (step.value !== 'code' && step.value !== 'profile') {
    console.log("Resetting flow on mount")
    resetFlow()
  }
})

// Debug: watch for step changes
watch(step, (newStep, oldStep) => {
  console.log(`Step changed from ${oldStep} to ${newStep}`)
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>