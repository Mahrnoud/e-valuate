<!-- components/contacts/ContactList.vue -->
<template>
  <div class="contact-list">
    <div class="list-header">
      <h2 class="list-title">{{ title }}</h2>

      <div class="header-actions" v-if="!hideActions">
        <span class="selection-info" v-if="selectedContactIds.length > 0">
          {{ selectedContactIds.length }} selected
        </span>

        <button
            v-if="selectedContactIds.length > 0"
            class="action-button invite-button"
            @click="sendInvitations"
            :disabled="isLoading"
        >
          Send Rating Invitations
        </button>

        <button
            v-if="selectedContactIds.length > 0"
            class="action-button clear-button"
            @click="clearSelection"
        >
          Clear Selection
        </button>
      </div>
    </div>

    <div v-if="!contacts || contacts.length === 0" class="empty-state">
      <p>No contacts found in this circle</p>
    </div>

    <ul v-else class="contacts-grid">
      <li
          v-for="contact in contacts"
          :key="contact.id"
          class="contact-card"
          :class="{ 'selected': isSelected(contact.id) }"
          @click="handleContactClick(contact.id)"
      >
        <div class="contact-avatar">
          {{ getInitials(contact.name) }}
        </div>

        <div class="contact-info">
          <h3 class="contact-name">{{ contact.name }}</h3>
          <p class="contact-detail">{{ contact.phoneNumber }}</p>
          <p v-if="contact.email" class="contact-detail secondary">{{ contact.email }}</p>
        </div>

        <div class="contact-actions" v-if="!hideActions">
          <button
              class="icon-button edit-button"
              @click.stop="emit('edit', contact)"
              title="Edit contact"
          >
            <span class="sr-only">Edit</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>

          <button
              class="icon-button delete-button"
              @click.stop="emit('delete', contact.id)"
              title="Delete contact"
          >
            <span class="sr-only">Delete</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>

        <div class="selection-indicator" v-if="!hideActions">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon" v-if="!isSelected(contact.id)">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon" v-else>
            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
          </svg>
        </div>
      </li>
    </ul>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useContacts } from '../../composables/useContacts'

// Props
const props = defineProps({
  contacts: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Contacts'
  },
  hideActions: {
    type: Boolean,
    default: false
  }
})

// Get contacts composable
const {
  selectedContactIds,
  isLoading,
  error,
  toggleContactSelection,
  clearSelection,
  sendInvitations
} = useContacts()

// Check if contact is selected
const isSelected = (contactId) => {
  return selectedContactIds.value.includes(contactId)
}

// Handle contact card click for selection
const handleContactClick = (contactId) => {
  if (!props.hideActions) {
    toggleContactSelection(contactId)
  }
}

// Get initials from contact name
const getInitials = (name) => {
  if (!name) return '?'

  return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
}

// Define emits
const emit = defineEmits(['edit', 'delete'])
</script>

<style scoped>
.contact-list {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.list-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.selection-info {
  font-size: 0.875rem;
  color: #4b5563;
}

.action-button {
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background-color 0.2s;
}

.invite-button {
  background-color: #4f46e5;
  color: white;
}

.invite-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.invite-button:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}

.clear-button {
  background-color: #f3f4f6;
  color: #4b5563;
}

.clear-button:hover {
  background-color: #e5e7eb;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  transition: background-color 0.2s, border-color 0.2s;
  cursor: pointer;
}

.contact-card:hover {
  background-color: #f9fafb;
}

.contact-card.selected {
  background-color: #eff6ff;
  border-color: #93c5fd;
}

.contact-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: #4f46e5;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-detail {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-detail.secondary {
  font-size: 0.75rem;
  color: #6b7280;
}

.contact-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.contact-card:hover .contact-actions {
  opacity: 1;
}

.icon-button {
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

.icon-button:hover {
  background-color: #f3f4f6;
}

.edit-button:hover {
  color: #4f46e5;
}

.delete-button:hover {
  color: #ef4444;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.selection-indicator {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #4f46e5;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
