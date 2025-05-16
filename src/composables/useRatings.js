// composables/useRatings.js - Ratings composable
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRatingsStore } from '../store/ratings'
import ratingsService from '../services/ratingsService'

export function useRatings() {
    const route = useRoute()
    const router = useRouter()
    const ratingsStore = useRatingsStore()

    // Rating state
    const currentTrait = ref(null)
    const currentRating = ref(0)
    const userBeingRated = ref(null)
    const ratingToken = ref('')
    const ratingComplete = ref(false)

    // Computed properties
    const traits = computed(() => ratingsStore.traits)
    const userRatings = computed(() => ratingsStore.userRatings)
    const traitsSortedByRating = computed(() => ratingsStore.traitsSortedByRating)
    const topPositiveTraits = computed(() => ratingsStore.topPositiveTraits)
    const circleStatuses = computed(() => ratingsStore.circleStatuses)
    const isLoading = computed(() => ratingsStore.isLoading)
    const error = computed(() => ratingsStore.error)

    /**
     * Initialize ratings data
     */
    const initRatings = async () => {
        await ratingsStore.loadTraits()
    }

    /**
     * Load user ratings
     * @param {string} userId - User ID
     */
    const loadUserRatings = async (userId) => {
        return await ratingsStore.loadUserRatings(userId)
    }

    /**
     * Initialize rating flow with token
     * @param {string} token - Rating invitation token
     */
    const initRatingFlow = async (token) => {
        try {
            // Validate token
            const validationData = await ratingsService.validateRatingToken(token)

            if (validationData) {
                userBeingRated.value = validationData.user
                ratingToken.value = token

                // Load traits if not already loaded
                if (!traits.value.length) {
                    await ratingsStore.loadTraits()
                }

                // Set first trait
                if (traits.value.length > 0) {
                    currentTrait.value = traits.value[0]
                }

                return true
            }

            return false
        } catch (err) {
            return false
        }
    }

    /**
     * Get trait details for rating page
     * @param {string} userId - User ID
     * @param {string} traitId - Trait ID
     */
    const getTraitDetails = async (userId, traitId) => {
        try {
            const details = await ratingsService.getTraitDetails(userId, traitId)

            if (details) {
                currentTrait.value = details.trait
                userBeingRated.value = details.user
                return details
            }

            return null
        } catch (err) {
            return null
        }
    }

    /**
     * Submit rating for current trait
     * @param {number} rating - Rating value (-1 to 1)
     */
    const submitCurrentRating = async (rating) => {
        if (!userBeingRated.value || !currentTrait.value) return false

        const success = await ratingsStore.submitRating(
            userBeingRated.value.id,
            currentTrait.value.id,
            rating
        )

        if (success) {
            // Find index of current trait
            const traitIndex = traits.value.findIndex(t => t.id === currentTrait.value.id)

            // Check if there are more traits to rate
            if (traitIndex < traits.value.length - 1) {
                // Move to next trait
                currentTrait.value = traits.value[traitIndex + 1]
                currentRating.value = 0
            } else {
                // Rating flow complete
                ratingComplete.value = true
            }

            return true
        }

        return false
    }

    /**
     * Skip rating for current trait
     */
    const skipCurrentTrait = () => {
        if (!currentTrait.value) return false

        // Find index of current trait
        const traitIndex = traits.value.findIndex(t => t.id === currentTrait.value.id)

        // Check if there are more traits to rate
        if (traitIndex < traits.value.length - 1) {
            // Move to next trait
            currentTrait.value = traits.value[traitIndex + 1]
            currentRating.value = 0
            return true
        } else {
            // Rating flow complete
            ratingComplete.value = true
            return false
        }
    }

    return {
        // State
        currentTrait,
        currentRating,
        userBeingRated,
        ratingToken,
        ratingComplete,

        // Computed
        traits,
        userRatings,
        traitsSortedByRating,
        topPositiveTraits,
        circleStatuses,
        isLoading,
        error,

        // Methods
        initRatings,
        loadUserRatings,
        initRatingFlow,
        getTraitDetails,
        submitCurrentRating,
        skipCurrentTrait
    }
}
