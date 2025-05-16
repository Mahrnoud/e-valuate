<!-- views/RatingView.vue -->
<template>
  <div class="rating-view">
    <div v-if="isLoading" class="loading-container">
      <Spinner />
      <p>Loading rating...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <p class="error-details">
        This rating link may be invalid or expired. Please contact the person who sent you this link.
      </p>
    </div>

    <div v-else>
      <!-- Rating Flow -->
      <div v-if="!ratingComplete" class="rating-container">
        <div class="rating-header">
          <h1 class="rating-title">
            Rate {{ userBeingRated?.firstName || 'User' }} –
            <span class="trait-contrast">
              {{ currentTrait?.positiveName || '' }}
              <span class="text-muted">to</span>
              {{ currentTrait?.negativeName || '' }}
            </span>
          </h1>
          <p class="rating-subtitle">
            Your rating is anonymous. {{ userBeingRated?.firstName || 'They' }} will not know your answer.
          </p>
        </div>

        <RatingProgress :current-step="currentTraitIndex + 1" :total-steps="traits.length" />

        <div class="trait-card">
          <div class="trait-question">
            How would you rate {{ userBeingRated?.firstName || 'this person' }}
            on the scale from "{{ currentTrait?.positiveName }}" to "{{ currentTrait?.negativeName }}"?
          </div>

          <TraitSlider
              v-model="currentRating"
              :positive-label="currentTrait?.positiveName || ''"
              :negative-label="currentTrait?.negativeName || ''"
          />

          <div class="trait-actions">
            <button
                @click="skipCurrentTrait"
                class="skip-button"
                :disabled="isSubmitting"
            >
              Skip This Question
            </button>
            <button
                @click="submitRating"
                class="next-button"
                :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Saving...' : 'Next' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Rating Complete -->
      <div v-else class="completion-container">
        <div class="completion-card">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="completion-icon">
            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
          </svg>

          <h1 class="completion-title">Thank You for Your Feedback!</h1>
          <p class="completion-message">
            Your ratings have been saved. {{ userBeingRated?.firstName || 'The user' }}
            will see an aggregated version of all ratings once at least 5 people have provided feedback.
          </p>

          <div class="completion-actions">
            <button @click="closeWindow" class="close-button">Close Window</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRatings } from '@/composables/useRatings'
import TraitSlider from '../components/ratings/TraitSlider.vue'
import RatingProgress from '../components/ratings/RatingProgress.vue'
import Spinner from '../components/ui/Spinner.vue'

// Get route and params
const route = useRoute()
const userId = route.params.userId
const traitId = route.params.traitId
const token = route.query.token

// Use ratings composable
const {
  currentTrait,
  currentRating,
  userBeingRated,
  ratingToken,
  ratingComplete,
  traits,
  isLoading,
  error,
  initRatingFlow,
  getTraitDetails,
  submitCurrentRating,
  skipCurrentTrait
} = useRatings()

// Local state
const isSubmitting = ref(false)
const currentTraitIndex = ref(0)

// Initialize rating flow
onMounted(async () => {
  if (token) {
    // Initialize with token
    await initRatingFlow(token)
  } else if (userId && traitId) {
    // Initialize with specific user and trait IDs
    await getTraitDetails(userId, traitId)
  }

  // Calculate current trait index
  if (currentTrait.value && traits.value.length > 0) {
    currentTraitIndex.value = traits.value.findIndex(t => t.id === currentTrait.value.id)
    if (currentTraitIndex.value < 0) currentTraitIndex.value = 0
  }
})

// Submit rating and move to next trait
const submitRating = async () => {
  isSubmitting.value = true

  try {
    const success = await submitCurrentRating(currentRating.value)

    if (success) {
      // Update trait index if not complete
      if (!ratingComplete.value) {
        currentTraitIndex.value = traits.value.findIndex(t => t.id === currentTrait.value.id)
      }
    }
  } catch (err) {
    console.error('Failed to submit rating:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Close the window
const closeWindow = () => {
  window.close()
}
</script>

<style scoped>
.rating-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 300px;
  gap: 1rem;
  width: 100%;
}

.error-message {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ef4444;
}

.error-details {
  color: #6b7280;
  max-width: 400px;
  margin: 0 auto;
}

.rating-container {
  width: 100%;
  max-width: 600px;
}

.rating-header {
  margin-bottom: 2rem;
  text-align: center;
}

.rating-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.trait-contrast {
  color: #4f46e5;
}

.text-muted {
  color: #6b7280;
  font-weight: normal;
}

.rating-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.trait-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  margin-top: 2rem;
}

.trait-question {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
}

.trait-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.skip-button {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.skip-button:hover:not(:disabled) {
  background-color: #f9fafb;
}

.next-button {
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  border: none;
  border-radius: 0.375rem;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.next-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.next-button:disabled, .skip-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.completion-container {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.completion-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.completion-icon {
  color: #10b981;
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
}

.completion-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.completion-message {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.completion-actions {
  margin-top: 1rem;
}

.close-button {
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  border: none;
  border-radius: 0.375rem;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #4338ca;
}
</style>
