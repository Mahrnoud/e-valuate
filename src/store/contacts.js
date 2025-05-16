// store/contacts.js - Contacts and circles store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import contactsService from '../services/contactsService'
import { contactsService } from '@/services/mockAdapter';

export const useContactsStore = defineStore('contacts', () => {
    // State
    const contacts = ref([])
    const circles = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    // Computed
    const contactsByCircle = computed(() => {
        const grouped = {}

        circles.value.forEach(circle => {
            grouped[circle.id] = contacts.value.filter(contact =>
                contact.circleId === circle.id
            )
        })

        return grouped
    })

    // Actions

    /**
     * Load user circles
     */
    async function loadCircles() {
        isLoading.value = true
        error.value = null

        try {
            const result = await contactsService.getCircles()
            circles.value = result
            return result
        } catch (err) {
            error.value = err.message || 'Failed to load circles'
            return []
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Create new circle
     * @param {Object} circleData - Circle data
     */
    async function createCircle(circleData) {
        isLoading.value = true
        error.value = null

        try {
            const result = await contactsService.createCircle(circleData)
            circles.value.push(result)
            return result
        } catch (err) {
            error.value = err.message || 'Failed to create circle'
            return null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Load user contacts
     */
    async function loadContacts() {
        isLoading.value = true
        error.value = null

        try {
            const result = await contactsService.getContacts()
            contacts.value = result
            return result
        } catch (err) {
            error.value = err.message || 'Failed to load contacts'
            return []
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Add new contact
     * @param {Object} contactData - Contact data
     */
    async function addContact(contactData) {
        isLoading.value = true
        error.value = null

        try {
            const result = await contactsService.addContact(contactData)
            contacts.value.push(result)
            return result
        } catch (err) {
            error.value = err.message || 'Failed to add contact'
            return null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Update existing contact
     * @param {string} contactId - Contact ID
     * @param {Object} contactData - Updated contact data
     */
    async function updateContact(contactId, contactData) {
        isLoading.value = true
        error.value = null

        try {
            const result = await contactsService.updateContact(contactId, contactData)

            // Update contact in local state
            const index = contacts.value.findIndex(c => c.id === contactId)
            if (index !== -1) {
                contacts.value[index] = result
            }

            return result
        } catch (err) {
            error.value = err.message || 'Failed to update contact'
            return null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Delete contact
     * @param {string} contactId - Contact ID
     */
    async function deleteContact(contactId) {
        isLoading.value = true
        error.value = null

        try {
            await contactsService.deleteContact(contactId)

            // Remove contact from local state
            contacts.value = contacts.value.filter(c => c.id !== contactId)

            return true
        } catch (err) {
            error.value = err.message || 'Failed to delete contact'
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Send rating invitations to contacts
     * @param {Array} contactIds - Array of contact IDs
     */
    async function sendRatingInvitations(contactIds) {
        isLoading.value = true
        error.value = null

        try {
            const result = await contactsService.sendRatingInvitations(contactIds)
            return result
        } catch (err) {
            error.value = err.message || 'Failed to send invitations'
            return null
        } finally {
            isLoading.value = false
        }
    }

    return {
        // State
        contacts,
        circles,
        isLoading,
        error,

        // Computed
        contactsByCircle,

        // Actions
        loadCircles,
        createCircle,
        loadContacts,
        addContact,
        updateContact,
        deleteContact,
        sendRatingInvitations
    }
})
