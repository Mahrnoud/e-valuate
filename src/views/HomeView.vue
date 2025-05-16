<!-- views/HomeView.vue -->
<template>
  <div class="home-view">
    <div class="page-header">
      <h1 class="page-title">Welcome to Character Rating</h1>
      <p class="page-description">
        Discover how others perceive you by inviting your contacts to rate your personality traits
      </p>
    </div>

    <div class="home-layout">
      <div class="main-panel">
        <div class="panel-content">
          <h2 class="panel-title">Get Started</h2>
          <p>
            Follow these steps to start collecting feedback:
          </p>

          <div class="steps-container">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3 class="step-title">Import your contacts</h3>
                <p class="step-description">
                  Add contacts manually or import from your phone to organize them into circles.
                </p>
                <router-link :to="{ name: 'contacts' }" class="action-button primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  <span>Manage Contacts</span>
                </router-link>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3 class="step-title">Send rating invitations</h3>
                <p class="step-description">
                  Invite your contacts to provide anonymous feedback on your personality traits.
                </p>
                <button
                    @click="showInviteModal = true"
                    class="action-button primary"
                    :disabled="!hasContacts"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span>Send Invitations</span>
                </button>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3 class="step-title">View your profile and results</h3>
                <p class="step-description">
                  Once you receive at least 5 ratings per circle, you'll see aggregated feedback.
                </p>
                <router-link :to="{ name: 'profile' }" class="action-button primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>View Profile</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="side-panel">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <span>Loading stats...</span>
        </div>
        <div v-else class="panel-content">
          <h2 class="panel-title">Your Stats</h2>

          <div v-if="!hasContacts" class="empty-stats">
            <p>You haven't added any contacts yet.</p>
            <router-link :to="{ name: 'contacts' }" class="action-button secondary">
              Add Contacts
            </router-link>
          </div>
          <div v-else class="stats-grid">
            <div class="stat-card">
              <h3 class="stat-title">Contacts</h3>
              <div class="stat-value">{{ contacts.length }}</div>
            </div>

            <div class="stat-card">
              <h3 class="stat-title">Circles</h3>
              <div class="stat-value">{{ circles.length }}</div>
            </div>

            <div class="stat-card">
              <h3 class="stat-title">Ratings Received</h3>
              <div class="stat-value">{{ Object.keys(userRatings).length || 0 }}</div>
            </div>

            <div class="stat-card highlight">
              <h3 class="stat-title">Top Trait</h3>
              <div v-if="topPositiveTraits.length > 0" class="stat-value trait">
                {{ topPositiveTraits[0]?.trait?.name || 'None yet' }}
              </div>
              <div v-else class="stat-value trait empty">
                Not enough ratings
              </div>
            </div>
          </div>

          <div class="recent-ratings" v-if="hasContacts">
            <h3 class="section-title">Recent Activity</h3>
            <div v-if="notifications.length > 0" class="notifications-list">
              <div v-for="notification in recentNotifications" :key="notification.id" class="notification-item">
                <div class="notification-content">{{ notification.message }}</div>
                <div class="notification-time">{{ formatTimeAgo(notification.createdAt) }}</div>
              </div>
            </div>
            <div v-else class="empty-notifications">
              <p>No recent activity to display.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Modal -->
    <div v-if="showInviteModal" class="modal-backdrop" @click="showInviteModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Send Rating Invitations</h3>
          <button class="close-button" @click="showInviteModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="modal-description">
            Select the contacts you'd like to invite to rate your personality traits:
          </p>

          <ContactList
              :contacts="contacts"
              :hideActions="false"
              title="Your Contacts"
          />

          <div class="modal-actions">
            <button class="cancel-button" @click="showInviteModal = false">
              Cancel
            </button>
            <button
                class="invite-button"
                @click="handleSendInvitations"
                :disabled="selectedContactIds.length === 0 || isLoading"
            >
              <span v-if="isLoading">Sending...</span>
              <span v-else>Send Invitations ({{ selectedContactIds.length }})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContacts } from '../composables/useContacts'
import { useNotifications } from '../composables/useNotifications'
import { useRatings } from '../composables/useRatings'
import { useAuth } from '../composables/useAuth'
import ContactList from '../components/contacts/ContactList.vue'

// Show/hide invite modal
const showInviteModal = ref(false)

// Get composables
const {
  contacts,
  circles,
  selectedContactIds,
  isLoading: contactsLoading,
  initContacts,
  sendInvitations
} = useContacts()

const {
  notifications,
  initNotifications,
  isLoading: notificationsLoading
} = useNotifications()

const {
  userRatings,
  topPositiveTraits,
  initRatings,
  isLoading: ratingsLoading
} = useRatings()

const { user } = useAuth()

// Computed properties
const isLoading = computed(() =>
    contactsLoading.value || notificationsLoading.value || ratingsLoading.value
)

const hasContacts = computed(() => contacts.value?.length > 0)

const recentNotifications = computed(() => {
  return notifications.value
      .slice(0, 3)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Initialize data
onMounted(async () => {
  await Promise.all([
    initContacts(),
    initNotifications(),
    initRatings()
  ])

  // Load user ratings if user exists
  if (user.value) {
    await loadUserRatings(user.value.id)
  }
})

// Format time ago
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Unknown'

  const now = new Date()
  const date = new Date(timestamp)
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

// Handle sending invitations
const handleSendInvitations = async () => {
  if (selectedContactIds.value.length === 0) return

  const result = await sendInvitations()

  if (result) {
    showInviteModal.value = false
    // Reload notifications to show the latest activity
    await initNotifications()
  }
}
</script>

<style scoped>
.home-view {
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

.home-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .home-layout {
    grid-template-columns: 1fr;
  }
}

.main-panel, .side-panel {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.panel-content {
  padding: 1.5rem;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.step-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.step-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #4f46e5;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.step-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  text-decoration: none;
}

.action-button.primary {
  background-color: #4f46e5;
  color: white;
}

.action-button.primary:hover:not(:disabled) {
  background-color: #4338ca;
}

.action-button.primary:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}

.action-button.secondary {
  background-color: #f3f4f6;
  color: #4b5563;
}

.action-button.secondary:hover {
  background-color: #e5e7eb;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #6b7280;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
  text-align: center;
}

.stat-card.highlight {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
}

.stat-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.stat-value.trait {
  font-size: 1.125rem;
}

.stat-value.empty {
  font-size: 0.875rem;
  color: #6b7280;
}

.empty-stats {
  text-align: center;
  padding: 1.5rem;
  color: #6b7280;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.notification-content {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.empty-notifications {
  text-align: center;
  padding: 1rem;
  color: #6b7280;
  font-style: italic;
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
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
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

.modal-body {
  padding: 1.5rem;
}

.modal-description {
  color: #4b5563;
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

.invite-button {
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

.invite-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.invite-button:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}
</style>
