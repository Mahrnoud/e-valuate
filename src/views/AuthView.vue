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
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import PhoneLogin from '../components/auth/PhoneLogin.vue'
import VerificationCode from '../components/auth/VerificationCode.vue'
import CompleteProfile from '../components/auth/CompleteProfile.vue'

// Get step from auth composable
const { step, resetFlow } = useAuth()

// Reset flow on component mount
onMounted(() => {
  resetFlow()
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
