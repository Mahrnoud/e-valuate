<!-- components/auth/CompleteProfile.vue -->
<template>
  <div class="complete-profile">
    <h1 class="title">Complete Your Profile</h1>
    <p class="subtitle">Just a few more details to get started</p>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="firstName" class="label">First Name</label>
        <input
            id="firstName"
            type="text"
            v-model="firstName"
            placeholder="John"
            class="input"
            :disabled="isLoading"
            required
        />
      </div>

      <div class="form-group">
        <label for="lastName" class="label">Last Name</label>
        <input
            id="lastName"
            type="text"
            v-model="lastName"
            placeholder="Doe"
            class="input"
            :disabled="isLoading"
            required
        />
      </div>

      <div class="form-group">
        <label for="email" class="label">Email Address</label>
        <input
            id="email"
            type="email"
            v-model="email"
            placeholder="john.doe@example.com"
            class="input"
            :disabled="isLoading"
            required
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button
          type="submit"
          class="submit-button"
          :disabled="isLoading || !isFormValid"
      >
        <span v-if="isLoading">Saving...</span>
        <span v-else>Complete Registration</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '../../composables/useAuth'

// Import auth composable
const {
  firstName,
  lastName,
  email,
  completeProfile,
  isLoading,
  error
} = useAuth()

// Computed property for form validation
const isFormValid = computed(() => {
  return firstName.value && lastName.value && isValidEmail(email.value)
})

// Basic email validation
const isValidEmail = (email) => {
  if (!email) return false
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

// Handle form submission
const handleSubmit = async () => {
  if (isFormValid.value) {
    await completeProfile()
  }
}
</script>

<style scoped>
.complete-profile {
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
