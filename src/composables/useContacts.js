// composables/useContacts.js - Contacts composable
import { ref, computed } from 'vue'
import { useContactsStore } from '../store/contacts'

export function useContacts() {
    const contactsStore = useContactsStore()

    // Contact form state
    const newContact = ref({
        name: '',
        phoneNumber: '',
        circleId: '',
        email: '' // Optional
    })

    // Circle form state
    const newCircle = ref({
        name: ''
    })

    // Selected contacts for invitations
    const selectedContactIds = ref([])

    // Computed properties
    const contacts = computed(() => contactsStore.contacts)
    const circles = computed(() => contactsStore.circles)
    const contactsByCircle = computed(() => contactsStore.contactsByCircle)
    const isLoading = computed(() => contactsStore.isLoading)
    const error = computed(() => contactsStore.error)

    /**
     * Initialize contacts data
     */
    const initContacts = async () => {
        await Promise.all([
            loadCircles(),
            loadContacts()
        ])
    }

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
            newCircle.value.name = ''
            return circle
        }

        return null
    }

    /**
     * Load user contacts
     */
    const loadContacts = async () => {
        return await contactsStore.loadContacts()
    }

    /**
     * Add a new contact
     */
    const addContact = async () => {
        if (!newContact.value.name || !newContact.value.phoneNumber || !newContact.value.circleId) {
            return null
        }

        const contact = await contactsStore.addContact(newContact.value)

        if (contact) {
            // Reset form
            newContact.value = {
                name: '',
                phoneNumber: '',
                circleId: '',
                email: ''
            }
            return contact
        }

        return null
    }

    /**
     * Update an existing contact
     * @param {string} contactId - Contact ID
     * @param {Object} contactData - Updated contact data
     */
    const updateContact = async (contactId, contactData) => {
        return await contactsStore.updateContact(contactId, contactData)
    }

    /**
     * Delete a contact
     * @param {string} contactId - Contact ID
     */
    const deleteContact = async (contactId) => {
        return await contactsStore.deleteContact(contactId)
    }

    /**
     * Toggle contact selection for invitations
     * @param {string} contactId - Contact ID
     */
    const toggleContactSelection = (contactId) => {
        const index = selectedContactIds.value.indexOf(contactId)

        if (index === -1) {
            selectedContactIds.value.push(contactId)
        } else {
            selectedContactIds.value.splice(index, 1)
        }
    }

    /**
     * Select all contacts in a circle
     * @param {string} circleId - Circle ID
     */
    const selectCircle = (circleId) => {
        const circleContacts = contactsByCircle.value[circleId] || []

        circleContacts.forEach(contact => {
            if (!selectedContactIds.value.includes(contact.id)) {
                selectedContactIds.value.push(contact.id)
            }
        })
    }

    /**
     * Deselect all contacts
     */
    const clearSelection = () => {
        selectedContactIds.value = []
    }

    /**
     * Send rating invitations to selected contacts
     */
    const sendInvitations = async () => {
        if (selectedContactIds.value.length === 0) return null

        const result = await contactsStore.sendRatingInvitations(selectedContactIds.value)

        if (result) {
            // Clear selection after successful invitation
            clearSelection()
            return result
        }

        return null
    }

    return {
        // State
        newContact,
        newCircle,
        selectedContactIds,

        // Computed
        contacts,
        circles,
        contactsByCircle,
        isLoading,
        error,

        // Methods
        initContacts,
        loadCircles,
        createCircle,
        loadContacts,
        addContact,
        updateContact,
        deleteContact,
        toggleContactSelection,
        selectCircle,
        clearSelection,
        sendInvitations
    }
}
