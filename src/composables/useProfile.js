import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRatingsStore } from '@/store/ratings'
import { useContactsStore } from '@/store/contacts'

export function useProfile() {
    const authStore = useAuthStore()
    const ratingsStore = useRatingsStore()
    const contactsStore = useContactsStore()

    // Computed properties
    const user = computed(() => authStore.user)
    const isLoading = computed(() => authStore.isLoading || ratingsStore.isLoading)
    const error = computed(() => authStore.error || ratingsStore.error)
    const topPositiveTraits = computed(() => ratingsStore.topPositiveTraits)
    const circleStatuses = computed(() => ratingsStore.circleStatuses)
    const circles = computed(() => contactsStore.circles)

    /**
     * Initialize profile data
     */
    const initProfile = async () => {
        // Load user if not already loaded
        if (!user.value) {
            await authStore.loadUser()
        }

        // Load ratings data
        if (user.value) {
            await Promise.all([
                ratingsStore.loadTraits(),
                ratingsStore.loadUserRatings(user.value.id),
                contactsStore.loadCircles()
            ])
        }
    }

    /**
     * Update user profile
     * @param {Object} profileData - Updated profile data
     */
    const updateProfile = async (profileData) => {
        return await authStore.completeProfile(profileData)
    }

    /**
     * Get circle name by ID
     * @param {string} circleId - Circle ID
     * @returns {string} - Circle name
     */
    const getCircleName = (circleId) => {
        const circle = circles.value.find(c => c.id === circleId)
        return circle ? circle.name : 'Unknown Circle'
    }

    return {
        // Computed
        user,
        isLoading,
        error,
        topPositiveTraits,
        circleStatuses,
        circles,

        // Methods
        initProfile,
        updateProfile,
        getCircleName
    }
}
