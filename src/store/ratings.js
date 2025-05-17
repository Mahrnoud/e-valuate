// store/ratings.js - Ratings store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ratingsService } from '@/services/mockAdapter';

export const useRatingsStore = defineStore('ratings', () => {
    // State
    const traits = ref([])
    const userRatings = ref({})
    const isLoading = ref(false)
    const error = ref(null)

    // Computed
    const traitsSortedByRating = computed(() => {
        // Defensive check to ensure traits.value is an array
        if (!Array.isArray(traits.value)) {
            console.warn('Expected traits.value to be an array but got:', traits.value);
            return [];
        }

        // Get average ratings for each trait
        const averageRatings = {};

        // Initialize with 0
        traits.value.forEach(trait => {
            averageRatings[trait.id] = {
                trait: trait,
                positiveCount: 0,
                negativeCount: 0,
                average: 0,
                total: 0
            };
        });

        // Calculate averages
        Object.values(userRatings.value).forEach(circleRatings => {
            Object.entries(circleRatings).forEach(([traitId, ratings]) => {
                if (!averageRatings[traitId]) return;

                const positiveCount = ratings.filter(r => r > 0).length;
                const negativeCount = ratings.filter(r => r < 0).length;
                const sum = ratings.reduce((acc, val) => acc + val, 0);
                const avg = ratings.length > 0 ? sum / ratings.length : 0;

                averageRatings[traitId].positiveCount += positiveCount;
                averageRatings[traitId].negativeCount += negativeCount;
                averageRatings[traitId].total += ratings.length;

                // Recalculate the overall average
                averageRatings[traitId].average =
                    (averageRatings[traitId].average * (averageRatings[traitId].total - ratings.length) + sum) /
                    averageRatings[traitId].total;
            });
        });

        // Convert to array and sort by average (descending)
        return Object.values(averageRatings)
            .sort((a, b) => b.average - a.average);
    });

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
        isLoading.value = true;
        error.value = null;

        try {
            const result = await ratingsService.getTraits();

            // Handle different API response formats
            // If result is an object with a data property, use that
            if (result && typeof result === 'object' && result.data) {
                traits.value = Array.isArray(result.data) ? result.data : [];
            }
            // If result is already an array, use it directly
            else if (Array.isArray(result)) {
                traits.value = result;
            }
            // Otherwise, set to empty array
            else {
                console.warn('Unexpected response format from getTraits API:', result);
                traits.value = [];
            }

            return traits.value;
        } catch (err) {
            error.value = err.message || 'Failed to load traits';
            traits.value = []; // Ensure traits is always an array even on error
            return [];
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Load user ratings data
     * @param {string} userId - User ID
     */
    async function loadUserRatings(userId) {
        isLoading.value = true;
        error.value = null;

        try {
            const result = await ratingsService.getUserRatings(userId);

            // Handle different API response formats
            if (result && typeof result === 'object') {
                // If result has a data property, use that
                if (result.data) {
                    userRatings.value = result.data;
                }
                // Otherwise use the entire result
                else {
                    userRatings.value = result;
                }
            } else {
                console.warn('Unexpected response format from getUserRatings API:', result);
                userRatings.value = {};
            }

            return userRatings.value;
        } catch (err) {
            error.value = err.message || 'Failed to load user ratings';
            return {};
        } finally {
            isLoading.value = false;
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