<!-- components/contacts/ContactForm.vue -->
<template>
  <div class="contact-form">
    <h2 class="form-title">Add New Contact</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="contactName" class="label">Name</label>
        <input
            id="contactName"
            type="text"
            v-model="newContact.name"
            placeholder="John Doe"
            class="input"
            :disabled="isLoading"
            required
        />
      </div>

      <div class="form-group">
        <label for="contactPhone" class="label">Phone Number</label>
        <input
            id="contactPhone"
            type="tel"
            v-model="newContact.phoneNumber"
            placeholder="+1 (555) 123-4567"
            class="input"
            :disabled="isLoading"
            required
        />
      </div>

      <div class="form-group">
        <label for="contactEmail" class="label">Email (Optional)</label>
        <input
            id="contactEmail"
            type="email"
            v-model="newContact.email"
            placeholder="john.doe@example.com"
            class="input"
            :disabled="isLoading"
        />
      </div>

      <div class="form-group">
        <label for="contactCircle" class="label">Social Circle</label>
        <select
            id="contactCircle"
            v-model="newContact.circleId"
            class="select"
            :disabled="isLoading"
            required
        >
          <option value="" disabled>Select a circle</option>
          <option v-for="circle in circles" :key="circle.id" :value="circle.id">
            {{ circle.name }}
          </option>
        </select>

        <div class="create-circle-link">
          <button type="button" class="text-button" @click="showCreateCircle = true">
            + Create new circle
          </button>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <button
            type="submit"
            class="submit-button"
            :disabled="isLoading || !isFormValid"
        >
          <span v-if="isLoading">Adding...</span>
          <span v-else>Add Contact</span>
        </button>
      </div>
    </form>

    <!-- Create circle modal -->
    <div v-if="showCreateCircle" class="modal-backdrop" @click="showCreateCircle = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Create New Circle</h3>

        <form @submit.prevent="handleCreateCircle" class="form">
          <div class="form-group">
            <label for="circleName" class="label">Circle Name</label>
            <input
                id="circleName"
                type="text"
                v-model="newCircle.name"
                placeholder="Family, Work, School, etc."
                class="input"
                :disabled="isLoading"
                required
                autofocus
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-button" @click="showCreateCircle = false">
              Cancel
            </button>
            <button
                type="submit"
                class="submit-button"
                :disabled="isLoading || !newCircle.name"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useContacts } from '../../composables/useContacts'

// Get contacts composable
const {
  newContact,
  newCircle,
  circles,
  isLoading,
  error,
  addContact,
  createCircle
} = useContacts()

// Local state
const showCreateCircle = ref(false)

// Computed property for form validation
const isFormValid = computed(() => {
  return newContact.value.name &&
      newContact.value.phoneNumber &&
      newContact.value.circleId
})

// Handle contact form submission
const handleSubmit = async () => {
  if (isFormValid.value) {
    const result = await addContact()
    if (result) {
      // Emit success event
      emit('added', result)
    }
  }
}

// Handle circle creation
const handleCreateCircle = async () => {
  if (newCircle.value.name) {
    const result = await createCircle()
    if (result) {
      // Close modal and select the newly created circle
      showCreateCircle.value = false
      newContact.value.circleId = result.id
    }
  }
}

// Define emits
const emit = defineEmits(['added'])
</script>

<style scoped>
.contact-form {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.input,
.select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.create-circle-link {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.25rem;
}

.text-button {
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0;
}

.text-button:hover {
  text-decoration: underline;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.submit-button {
  background-color: #4f46e5;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.submit-button:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button {
  background-color: white;
  color: #4b5563;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #f9fafb;
}
</style>
