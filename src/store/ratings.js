// store/ratings.js - Ratings store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ratingsService from '../services/ratingsService'

export const useRatingsStore = defineStore('ratings', () => {
    // State
    const traits = ref([])
    const userRatings = ref({})
    const isLoading = ref(false)
    const error = ref(null)

    // Computed
    const traitsSortedByRating = computed(() => {
        // Get average ratings for each trait
        const averageRatings = {}

        // Initialize with 0
        traits.value.forEach(trait => {
            averageRatings[trait.id] = {
                trait: trait,
                positiveCount: 0,
                negativeCount: 0,
                average: 0,
                total: 0
            }
        })

        // Calculate averages
        Object.values(userRatings.value).forEach(circleRatings => {
            Object.entries(circleRatings).forEach(([traitId, ratings]) => {
                if (!averageRatings[traitId]) return

                const positiveCount = ratings.filter(r => r > 0).length
                const negativeCount = ratings.filter(r => r < 0).length
                const sum = ratings.reduce((acc, val) => acc + val, 0)
                const avg = ratings.length > 0 ? sum / ratings.length : 0

                averageRatings[traitId].positiveCount += positiveCount
                averageRatings[traitId].negativeCount += negativeCount
                averageRatings[traitId].total += ratings.length

                // Recalculate the overall average
                averageRatings[traitId].average =
                    (averageRatings[traitId].average * (averageRatings[traitId].total - ratings.length) + sum) /
                    averageRatings[traitId].total
            })
        })

        // Convert to array and sort by average (descending)
        return Object.values(averageRatings)
            .sort((a, b) => b.average - a.average)
    })

    const topPositiveTraits = computed(() => {
        return traitsSortedByRating.value
            .filter(t => t.average > 0)
            .slice(0, 2)
    })

    const circleStatuses = computed(() => {
        const statuses = {}

        Object.entries(userRatings.value).forEach(([circleId, traitRatings]) => {
            let positiveCount = 0
            let totalCount = 0

            // Count all ratings across traits for this circle
            Object.values(traitRatings).forEach(ratings => {
                ratings.forEach(rating => {
                    totalCount++
                    if (rating > 0) positiveCount++
                })
            })

            // Determine if circle has enough ratings
            const hasEnoughRatings = totalCount >= 5

            // Calculate percentage of positive ratings
            const positivePercentage = totalCount > 0 ? (positiveCount / totalCount) * 100 : 0

            // Determine status
            let status = 'neutral'
            if (hasEnoughRatings) {
                status = positivePercentage >= 51 ? 'positive' : 'negative'
            }

            statuses[circleId] = {
                circleId,
                hasEnoughRatings,
                positivePercentage,
                status
            }
        })

        return statuses
    })

    // Actions

    /**
     * Load all available personality traits
     */
    async function loadTraits() {
        isLoading.value = true
        error.value = null

        try {
            const result = await ratingsService.getTraits()
            traits.value = result
            return result
        } catch (err) {
            error.value = err.message || 'Failed to load traits'
            return []
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Load user ratings data
     * @param {string} userId - User ID
     */
    async function loadUserRatings(userId) {
        isLoading.value = true
        error.value = null

        try {
            const result = await ratingsService.getUserRatings(userId)
            userRatings.value = result
            return result
        } catch (err) {
            error.value = err.message || 'Failed to load user ratings'
            return {}
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Submit rating for a user trait
     * @param {string} userId - User being rated
     * @param {string} traitId - Trait being rated
     * @param {number} rating - Rating value (-1 to 1)
     */
    async function submitRating(userId, traitId, rating) {
        isLoading.value = true
        error.value = null

        try {
            await ratingsService.submitRating(userId, traitId, rating)
            return true
        } catch (err) {
            error.value = err.message || 'Failed to submit rating'
            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        // State
        traits,
        userRatings,
        isLoading,
        error,

        // Computed
        traitsSortedByRating,
        topPositiveTraits,
        circleStatuses,

        // Actions
        loadTraits,
        loadUserRatings,
        submitRating
    }
})
