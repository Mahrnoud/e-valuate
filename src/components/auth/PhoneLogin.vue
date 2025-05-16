<!-- components/auth/PhoneLogin.vue -->
<template>
  <div class="phone-login">
    <h1 class="title">Welcome to Character Rating</h1>
    <p class="subtitle">Enter your phone number to get started</p>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="phoneNumber" class="label">Phone Number</label>
        <input
            id="phoneNumber"
            type="tel"
            v-model="phoneNumber"
            placeholder="+1 (555) 123-4567"
            class="input"
            :disabled="isLoading"
            required
        />
        <p class="helper-text">We'll send you a verification code</p>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button
          type="submit"
          class="submit-button"
          :disabled="isLoading || !phoneNumber"
      >
        <span v-if="isLoading">Sending...</span>
        <span v-else>Send Code</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useAuth } from '../../composables/useAuth'

// Import auth composable
const {
  phoneNumber,
  requestCode,
  isLoading,
  error
} = useAuth()

// Format phone number as user types
watch(phoneNumber, (newValue) => {
  // Basic formatting example (would be improved in real app)
  if (newValue && !newValue.startsWith('+') && newValue.length > 0) {
    phoneNumber.value = '+' + newValue
  }
})

// Handle form submission
const handleSubmit = async () => {
  await requestCode()
}
</script>

<style scoped>
.phone-login {
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

.input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.helper-text {
  font-size: 0.75rem;
  color: #666;
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
