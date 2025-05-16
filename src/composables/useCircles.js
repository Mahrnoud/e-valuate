// composables/useCircles.js - Circles composable
import { computed } from 'vue'
import { useContactsStore } from '../store/contacts'

export function useCircles() {
    const contactsStore = useContactsStore()

    // Circle form state
    const newCircle = ref({
        name: ''
    })

    // Computed properties
    const circles = computed(() => contactsStore.circles)
    const isLoading = computed(() => contactsStore.isLoading)
    const error = computed(() => contactsStore.error)

    /**
     * Load user circles
     */
    const loadCircles = async () => {
        return await contactsStore.loadCircles()
    }

    /**
     * Create a new circle
     */
    const createCircle = async () => {
        if (!newCircle.value.name) return null

        const circle = await contactsStore.createCircle(newCircle.value)

        if (circle) {
            // Reset form
            newCircle.value = { name: '' }
            return circle
        }

        return null
    }

    /**
     * Update a circle
     * @param {string} circleId - Circle ID
     * @param {Object} circleData - Updated circle data
     */
    const updateCircle = async (circleId, circleData) => {
        return await contactsStore.updateCircle(circleId, circleData)
    }

    /**
     * Delete a circle
     * @param {string} circleId - Circle ID
     */
    const deleteCircle = async (circleId) => {
        return await contactsStore.deleteCircle(circleId)
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
        // State
        newCircle,

        // Computed
        circles,
        isLoading,
        error,

        // Methods
        loadCircles,
        createCircle,
        updateCircle,
        deleteCircle,
        getCircleName
    }
}
