// services/contactsService.js - Contacts and circles service
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.characterrating.com'

// Create axios instance with default config
const contactsApi = axios.create({
    baseURL: `${API_URL}/contacts`,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add auth token to requests
contactsApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/**
 * Get all user circles
 * @returns {Promise} - API response with circles array
 */
const getCircles = async () => {
    const response = await contactsApi.get('/circles')
    return response.data
}

/**
 * Create a new circle
 * @param {Object} circleData - Circle data (name)
 * @returns {Promise} - API response with created circle
 */
const createCircle = async (circleData) => {
    const response = await contactsApi.post('/circles', circleData)
    return response.data
}

/**
 * Update a circle
 * @param {string} circleId - Circle ID
 * @param {Object} circleData - Updated circle data
 * @returns {Promise} - API response with updated circle
 */
const updateCircle = async (circleId, circleData) => {
    const response = await contactsApi.put(`/circles/${circleId}`, circleData)
    return response.data
}

/**
 * Delete a circle
 * @param {string} circleId - Circle ID
 * @returns {Promise} - API response
 */
const deleteCircle = async (circleId) => {
    const response = await contactsApi.delete(`/circles/${circleId}`)
    return response.data
}

/**
 * Get all user contacts
 * @returns {Promise} - API response with contacts array
 */
const getContacts = async () => {
    const response = await contactsApi.get('/')
    return response.data
}

/**
 * Add a new contact
 * @param {Object} contactData - Contact data with snake_case keys
 * @returns {Promise} - API response with created contact
 */
const addContact = async (contactData) => {
    // Note: We're using the snake_case keys as expected by the API
    // The adapter layer will handle conversion between camelCase and snake_case
    const response = await contactsApi.post('/', contactData)
    return response.data
}

/**
 * Update a contact
 * @param {string} contactId - Contact ID
 * @param {Object} contactData - Updated contact data with snake_case keys
 * @returns {Promise} - API response with updated contact
 */
const updateContact = async (contactId, contactData) => {
    // The adapter layer will handle conversion between camelCase and snake_case
    const response = await contactsApi.put(`/${contactId}`, contactData)
    return response.data
}

/**
 * Delete a contact
 * @param {string} contactId - Contact ID
 * @returns {Promise} - API response
 */
const deleteContact = async (contactId) => {
    const response = await contactsApi.delete(`/${contactId}`)
    return response.data
}

/**
 * Send rating invitations to contacts
 * @param {Object} data - Object with contact_ids array
 * @returns {Promise} - API response with invitation results
 */
const sendRatingInvitations = async (data) => {
    // The data object should contain contact_ids in snake_case format
    const response = await contactsApi.post('/send-invitations', data)
    return response.data
}

/**
 * Import contacts from phone
 * @param {Array} contacts - Array of contact objects
 * @returns {Promise} - API response with import results
 */
const importContacts = async (contacts) => {
    const response = await contactsApi.post('/import', { contacts })
    return response.data
}

export default {
    getCircles,
    createCircle,
    updateCircle,
    deleteCircle,
    getContacts,
    addContact,
    updateContact,
    deleteContact,
    sendRatingInvitations,
    importContacts
}