<!-- views/ProfileView.vue -->
<template>
  <div class="profile-view">
    <div v-if="isLoading" class="loading-container">
      <Spinner />
      <p>Loading profile...</p>
    </div>

    <div v-else-if="!user" class="error-container">
      <p>Could not load profile data. Please try again later.</p>
      <BaseButton @click="initProfile">Retry</BaseButton>
    </div>

    <div v-else class="profile-content">
      <!-- Profile Header -->
      <ProfileHeader
          :user="user"
          :topTraits="topPositiveTraits"
      />

      <!-- Main Profile Content -->
      <div class="profile-main">
        <div class="profile-section">
          <h2 class="section-title">Top Personality Traits</h2>
          <p class="section-description">
            These are your highest-rated personality traits based on feedback from your social circles.
          </p>

          <div v-if="topPositiveTraits.length === 0" class="empty-state">
            <p>You haven't received enough ratings yet.</p>
            <p class="suggestion">Invite more contacts to rate you to see your top traits.</p>
            <BaseButton @click="navigateToContacts" variant="primary">Invite Contacts</BaseButton>
          </div>

          <TraitsSummary v-else :traits="topPositiveTraits" />
        </div>

        <div class="profile-section">
          <h2 class="section-title">Circle Perceptions</h2>
          <p class="section-description">
            See how different social circles perceive you. Results are only visible after receiving at least 5 ratings in a circle.
          </p>

          <div v-if="!hasCircleData" class="empty-state">
            <p>You haven't received enough ratings from your circles yet.</p>
            <p class="suggestion">Create circles and invite contacts to rate you.</p>
            <BaseButton @click="navigateToContacts" variant="primary">Manage Circles</BaseButton>
          </div>

          <div v-else class="circles-grid">
            <div v-for="circle in circles" :key="circle.id" class="circle-card">
              <CircleStatus
                  :circle-name="circle.name"
                  :status="getCircleStatus(circle.id)"
              />
            </div>
          </div>
        </div>

        <div class="profile-section">
          <h2 class="section-title">Personal Information</h2>

          <form @submit.prevent="updateProfileInfo" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input
                    id="firstName"
                    v-model="profileData.firstName"
                    type="text"
                    :disabled="isUpdating"
                    required
                />
              </div>

              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input
                    id="lastName"
                    v-model="profileData.lastName"
                    type="text"
                    :disabled="isUpdating"
                    required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                  id="email"
                  v-model="profileData.email"
                  type="email"
                  :disabled="isUpdating"
                  required
              />
            </div>

            <div class="form-group">
              <label for="phoneNumber">Phone Number</label>
              <input
                  id="phoneNumber"
                  v-model="profileData.phoneNumber"
                  type="tel"
                  disabled
              />
              <p class="helper-text">Phone number cannot be changed</p>
            </div>

            <div v-if="error" class="error-message">{{ error }}</div>

            <div class="form-actions">
              <BaseButton
                  type="submit"
                  variant="primary"
                  :loading="isUpdating"
                  :disabled="!isProfileChanged"
              >
                {{ isUpdating ? 'Saving...' : 'Save Changes' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useProfile } from '../composables/useProfile'
import ProfileHeader from '../components/profile/ProfileHeader.vue'
import TraitsSummary from '../components/profile/TraitsSummary.vue'
import CircleStatus from '../components/profile/CircleStatus.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import Spinner from '../components/ui/Spinner.vue'

// Router
const router = useRouter()

// Profile composable
const {
  user,
  isLoading,
  error,
  topPositiveTraits,
  circleStatuses,
  circles,
  initProfile,
  updateProfile
} = useProfile()

// Local state
const isUpdating = ref(false)
const profileData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
})

// Computed properties
const hasCircleData = computed(() => {
  return Object.keys(circleStatuses.value).length > 0 &&
      Object.values(circleStatuses.value).some(status => status.hasEnoughRatings)
})

const isProfileChanged = computed(() => {
  if (!user.value) return false

  return profileData.firstName !== user.value.firstName ||
      profileData.lastName !== user.value.lastName ||
      profileData.email !== user.value.email
})

// Initialize profile data
onMounted(async () => {
  await initProfile()

  // Populate form with user data
  if (user.value) {
    profileData.firstName = user.value.firstName || ''
    profileData.lastName = user.value.lastName || ''
    profileData.email = user.value.email || ''
    profileData.phoneNumber = user.value.phoneNumber || ''
  }
})

// Get circle status
const getCircleStatus = (circleId) => {
  const status = circleStatuses.value[circleId]

  if (!status) {
    return {
      status: 'neutral',
      hasEnoughRatings: false,
      positivePercentage: 0
    }
  }

  return status
}

// Navigate to contacts page
const navigateToContacts = () => {
  router.push({ name: 'contacts' })
}

// Update profile information
const updateProfileInfo = async () => {
  if (!isProfileChanged.value) return

  isUpdating.value = true

  try {
    const updatedUser = await updateProfile({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email
    })

    if (updatedUser) {
      // Update successful
    }
  } catch (err) {
    console.error('Failed to update profile:', err)
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
.profile-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.section-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
}

.suggestion {
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.circles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.circle-card {
  background-color: #f9fafb;
  border-radius: 0.375rem;
  overflow: hidden;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.875rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.form-group input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.helper-text {
  font-size: 0.75rem;
  color: #6b7280;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
