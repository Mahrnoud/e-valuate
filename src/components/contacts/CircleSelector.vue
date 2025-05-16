<!-- components/contacts/CircleSelector.vue -->
<template>
  <div class="circle-selector">
    <h2 class="selector-title">Social Circles</h2>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <span>Loading circles...</span>
    </div>

    <div v-else-if="!circles || circles.length === 0" class="empty-state">
      <p>No social circles found</p>
      <button class="action-button" @click="emit('create-circle')">
        Create Your First Circle
      </button>
    </div>

    <ul v-else class="circles-list">
      <li>
        <button
            class="circle-item"
            :class="{ 'active': selectedCircleId === 'all' }"
            @click="selectCircle('all')"
        >
          <div class="circle-icon all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <span class="circle-name">All Contacts</span>
          <span class="contact-count">{{ getTotalContactCount() }}</span>
        </button>
      </li>

      <li v-for="circle in circles" :key="circle.id">
        <button
            class="circle-item"
            :class="{ 'active': selectedCircleId === circle.id }"
            @click="selectCircle(circle.id)"
        >
          <div class="circle-icon">
            {{ getCircleInitial(circle.name) }}
          </div>
          <span class="circle-name">{{ circle.name }}</span>
          <span class="contact-count">{{ getContactCount(circle.id) }}</span>

          <div class="circle-actions">
            <button
                class="icon-button select-all-button"
                @click.stop="emit('select-circle', circle.id)"
                title="Select all contacts in this circle"
            >
              <span class="sr-only">Select All</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button
                class="icon-button edit-button"
                @click.stop="emit('edit-circle', circle)"
                title="Edit circle"
            >
              <span class="sr-only">Edit</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          </div>
        </button>
      </li>
    </ul>

    <div class="selector-actions">
      <button class="create-button" @click="emit('create-circle')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>New Circle</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useContacts } from '../../composables/useContacts'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: 'all'
  }
})

// Emit events
const emit = defineEmits(['update:modelValue', 'create-circle', 'edit-circle', 'select-circle'])

// Use contacts composable
const {
  circles,
  contacts,
  contactsByCircle,
  isLoading
} = useContacts()

// Selected circle ID (two-way binding)
const selectedCircleId = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Select a circle
const selectCircle = (circleId) => {
  selectedCircleId.value = circleId
}

// Get contact count for a specific circle
const getContactCount = (circleId) => {
  return (contactsByCircle.value[circleId] || []).length
}

// Get total contact count
const getTotalContactCount = () => {
  return contacts.value.length
}

// Get first letter of circle name for the icon
const getCircleInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?'
}
</script>

<style scoped>
.circle-selector {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
}

.selector-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 1rem 0;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
}

.action-button {
  margin-top: 1rem;
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

.action-button:hover {
  background-color: #4338ca;
}

.circles-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.circle-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
  font-size: 0.875rem;
}

.circle-item:hover {
  background-color: #f9fafb;
}

.circle-item.active {
  background-color: #eff6ff;
  font-weight: 600;
}

.circle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background-color: #4f46e5;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 9999px;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.circle-icon.all {
  background-color: #4b5563;
  padding: 0.5rem;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.circle-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-count {
  background-color: #e5e7eb;
  color: #4b5563;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  margin-left: 0.75rem;
  margin-right: 0.75rem;
}

.circle-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.circle-item:hover .circle-actions {
  opacity: 1;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #6b7280;
  transition: background-color 0.2s, color 0.2s;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.select-all-button:hover {
  color: #4f46e5;
}

.edit-button:hover {
  color: #4f46e5;
}

.selector-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

.create-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  color: #4f46e5;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border: 1px dashed #4f46e5;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: rgba(79, 70, 229, 0.05);
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
