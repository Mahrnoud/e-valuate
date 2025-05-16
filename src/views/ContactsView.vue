<!-- views/ContactsView.vue -->
<template>
  <div class="contacts-view">
    <div class="page-header">
      <h1 class="page-title">Contacts</h1>
      <p class="page-description">
        Manage your contacts and organize them into social circles
      </p>
    </div>

    <div class="contacts-layout">
      <div class="sidebar">
        <CircleSelector
            v-model="selectedCircleId"
            @create-circle="showCreateCircleModal = true"
            @edit-circle="handleEditCircle"
            @select-circle="handleSelectCircle"
        />
      </div>

      <div class="main-content">
        <div class="actions-bar">
          <button
              class="action-button primary"
              @click="showAddContactModal = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
            <span>Add Contact</span>
          </button>

          <button
              class="action-button secondary"
              @click="handleImportContacts"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span>Import Contacts</span>
          </button>
        </div>

        <ContactList
            :contacts="filteredContacts"
            :title="contactListTitle"
            @edit="handleEditContact"
            @delete="handleDeleteContact"
        />
      </div>
    </div>

    <!-- Add Contact Modal -->
    <div v-if="showAddContactModal" class="modal-backdrop" @click="showAddContactModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Add New Contact</h3>
          <button class="close-button" @click="showAddContactModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ContactForm @added="handleContactAdded" />
      </div>
    </div>

    <!-- Edit Contact Modal -->
    <div v-if="showEditContactModal" class="modal-backdrop" @click="showEditContactModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Edit Contact</h3>
          <button class="close-button" @click="showEditContactModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="form-container">
          <form @submit.prevent="handleUpdateContact" class="form">
            <div class="form-group">
              <label for="editName" class="label">Name</label>
              <input
                  id="editName"
                  type="text"
                  v-model="editingContact.name"
                  placeholder="John Doe"
                  class="input"
                  :disabled="isLoading"
                  required
              />
            </div>

            <div class="form-group">
              <label for="editPhone" class="label">Phone Number</label>
              <input
                  id="editPhone"
                  type="tel"
                  v-model="editingContact.phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  class="input"
                  :disabled="isLoading"
                  required
              />
            </div>

            <div class="form-group">
              <label for="editEmail" class="label">Email (Optional)</label>
              <input
                  id="editEmail"
                  type="email"
                  v-model="editingContact.email"
                  placeholder="john.doe@example.com"
                  class="input"
                  :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label for="editCircle" class="label">Social Circle</label>
              <select
                  id="editCircle"
                  v-model="editingContact.circleId"
                  class="select"
                  :disabled="isLoading"
                  required
              >
                <option value="" disabled>Select a circle</option>
                <option v-for="circle in circles" :key="circle.id" :value="circle.id">
                  {{ circle.name }}
                </option>
              </select>
            </div>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-button" @click="showEditContactModal = false">
                Cancel
              </button>
              <button
                  type="submit"
                  class="submit-button"
                  :disabled="isLoading || !isEditFormValid"
              >
                <span v-if="isLoading">Updating...</span>
                <span v-else>Update Contact</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Create Circle Modal -->
    <div v-if="showCreateCircleModal" class="modal-backdrop" @click="showCreateCircleModal = false">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Create New Circle</h3>
          <button class="close-button" @click="showCreateCircleModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="form-container">
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

            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-button" @click="showCreateCircleModal = false">
                Cancel
              </button>
              <button
                  type="submit"
                  class="submit-button"
                  :disabled="isLoading || !newCircle.name"
              >
                <span v-if="isLoading">Creating...</span>
                <span v-else>Create Circle</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-backdrop" @click="showDeleteModal = false">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Delete Contact</h3>
          <button class="close-button" @click="showDeleteModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="confirmation-content">
          <p class="confirmation-message">
            Are you sure you want to delete this contact? This action cannot be undone.
          </p>

          <div class="form-actions">
            <button type="button" class="cancel-button" @click="showDeleteModal = false">
              Cancel
            </button>
            <button
                type="button"
                class="delete-button"
                :disabled="isLoading"
                @click="confirmDeleteContact"
            >
              <span v-if="isLoading">Deleting...</span>
              <span v-else>Delete Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContacts } from '@/composables/useContacts'
import CircleSelector from '../components/contacts/CircleSelector.vue'
import ContactList from '../components/contacts/ContactList.vue'
import ContactForm from '../components/contacts/ContactForm.vue'

// Get contacts composable
const {
  contacts,
  circles,
  contactsByCircle,
  selectedContactIds,
  newCircle,
  isLoading,
  error,
  initContacts,
  createCircle,
  addContact,
  updateContact,
  deleteContact,
  selectCircle,
  clearSelection
} = useContacts()

// Local state
const selectedCircleId = ref('all')
const showAddContactModal = ref(false)
const showEditContactModal = ref(false)
const showCreateCircleModal = ref(false)
const showDeleteModal = ref(false)
const editingContact = ref({
  id: '',
  name: '',
  phoneNumber: '',
  email: '',
  circleId: ''
})
const deletingContactId = ref('')

// Computed properties
const filteredContacts = computed(() => {
  if (selectedCircleId.value === 'all') {
    return contacts.value
  }

  return contactsByCircle.value[selectedCircleId.value] || []
})

const contactListTitle = computed(() => {
  if (selectedCircleId.value === 'all') {
    return 'All Contacts'
  }

  const circle = circles.value.find(c => c.id === selectedCircleId.value)
  return circle ? `${circle.name} Contacts` : 'Contacts'
})

const isEditFormValid = computed(() => {
  return editingContact.value.name &&
      editingContact.value.phoneNumber &&
      editingContact.value.circleId
})

// Initialize contacts data
onMounted(async () => {
  await initContacts()
})

// Handle adding a new contact
const handleContactAdded = (contact) => {
  showAddContactModal.value = false

  // If a circle is selected, update selection to show the new contact
  if (selectedCircleId.value !== 'all' && selectedCircleId.value !== contact.circleId) {
    selectedCircleId.value = contact.circleId
  }
}

// Handle editing a contact
const handleEditContact = (contact) => {
  editingContact.value = { ...contact }
  showEditContactModal.value = true
}

// Handle updating a contact
const handleUpdateContact = async () => {
  if (isEditFormValid.value) {
    const success = await updateContact(editingContact.value.id, editingContact.value)

    if (success) {
      showEditContactModal.value = false

      // If a different circle is selected, update selection to show the updated contact
      if (selectedCircleId.value !== 'all' && selectedCircleId.value !== editingContact.value.circleId) {
        selectedCircleId.value = editingContact.value.circleId
      }
    }
  }
}

// Handle deleting a contact
const handleDeleteContact = (contactId) => {
  deletingContactId.value = contactId
  showDeleteModal.value = true
}

// Confirm contact deletion
const confirmDeleteContact = async () => {
  if (deletingContactId.value) {
    const success = await deleteContact(deletingContactId.value)

    if (success) {
      showDeleteModal.value = false
      deletingContactId.value = ''
    }
  }
}

// Handle creating a new circle
const handleCreateCircle = async () => {
  if (newCircle.value.name) {
    const circle = await createCircle()

    if (circle) {
      showCreateCircleModal.value = false
      selectedCircleId.value = circle.id
    }
  }
}

// Handle editing a circle (placeholder - would be implemented similarly to contacts)
const handleEditCircle = (circle) => {
  // Circle editing functionality would be implemented here
  console.log('Edit circle:', circle)
}

// Handle selecting all contacts in a circle
const handleSelectCircle = (circleId) => {
  selectCircle(circleId)
}

// Handle importing contacts (placeholder)
const handleImportContacts = () => {
  // Contact import functionality would be implemented here
  console.log('Import contacts')
}
</script>

<style scoped>
.contacts-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: 1rem;
  color: #6b7280;
}

.contacts-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .contacts-layout {
    grid-template-columns: 1fr;
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.actions-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.action-button.primary {
  background-color: #4f46e5;
  color: white;
}

.action-button.primary:hover {
  background-color: #4338ca;
}

.action-button.secondary {
  background-color: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.action-button.secondary:hover {
  background-color: #f9fafb;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
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
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #6b7280;
  transition: background-color 0.2s, color 0.2s;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.form-container {
  padding: 1.5rem;
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

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.form-actions {
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

.delete-button {
  background-color: #ef4444;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.delete-button:hover:not(:disabled) {
  background-color: #dc2626;
}

.delete-button:disabled {
  background-color: #fca5a5;
  cursor: not-allowed;
}

.confirmation-content {
  padding: 1.5rem;
}

.confirmation-message {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 1.5rem;
}
</style>
