<!-- Modified components/auth/VerificationCode.vue - Using router navigation -->
<template>
  <div class="verification-code">
    <h1 class="title">Verify Your Phone</h1>
    <p class="subtitle">
      Enter the 6-digit code sent to {{ formatPhone(phoneNumber) }}
    </p>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="code" class="label">Verification Code</label>
        <div class="code-input-container">
          <input
              ref="codeInput"
              id="code"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              v-model="verificationCode"
              placeholder="000000"
              class="code-input"
              :disabled="isLoading"
              maxlength="6"
              pattern="[0-9]*"
              required
          />
        </div>
        <div class="helper-actions">
          <button type="button" class="text-button" @click="resendCode">
            Resend Code
          </button>
          <button type="button" class="text-button" @click="goBack">
            Change Phone Number
          </button>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button
          type="submit"
          class="submit-button"
          :disabled="isLoading || verificationCode.length < 6"
      >
        <span v-if="isLoading">Verifying...</span>
        <span v-else>Verify</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Get router
const router = useRouter()

// Input reference
const codeInput = ref(null)

// Import auth composable
const {
  phoneNumber,
  verificationCode,
  verifyCode,
  requestCode,
  isLoading,
  error
} = useAuth()

// Format phone number for display
const formatPhone = (phone) => {
  // Simple formatting, would be improved in real app
  if (!phone) return ''

  // Keep last 4 digits, hide the rest
  const length = phone.length
  if (length <= 4) return phone

  const lastFour = phone.substring(length - 4)
  return `******${lastFour}`
}

// Focus code input on mount
onMounted(() => {
  codeInput.value?.focus()
})

// Handle form submission
const handleSubmit = async () => {
  const success = await verifyCode()

  // The verifyCode function handles navigation in most cases,
  // but we could add additional logic here if needed
}

// Go back to phone number input
const goBack = () => {
  router.push({ name: 'auth' })
}

// Resend verification code
const resendCode = async () => {
  if (phoneNumber.value) {
    await requestCode()
  }
}
</script>

<style scoped>
.verification-code {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: 600;
  font-size: 0.875rem;
}

.code-input-container {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.code-input {
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  padding: 0.75rem;
  text-align: center;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
}

.code-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.helper-actions {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.text-button {
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0;
  text-decoration: underline;
}

.text-button:hover {
  color: #4338ca;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.submit-button {
  background-color: #4f46e5;
  color: white;
  font-weight: 600;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.submit-button:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}
</style>
