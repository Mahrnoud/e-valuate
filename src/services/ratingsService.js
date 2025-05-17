// services/ratingsService.js - Updated to work with snake_case API
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.characterrating.com'

// Create axios instance with default config
const ratingsApi = axios.create({
    baseURL: `${API_URL}/ratings`,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add auth token to requests when available
ratingsApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/**
 * Get all available personality traits
 * @returns {Promise} - API response with traits array
 */
const getTraits = async () => {
    const response = await ratingsApi.get('/traits')
    return response.data
}

/**
 * Get ratings for a specific user
 * @param {string} userId - User ID
 * @returns {Promise} - API response with ratings data
 */
const getUserRatings = async (userId) => {
    const response = await ratingsApi.get(`/users/${userId}`)
    return response.data
}

/**
 * Submit a rating for a user and trait
 * @param {Object} data - Rating data in snake_case format
 *                        (user_id, trait_id, rating)
 * @returns {Promise} - API response with rating confirmation
 */
const submitRating = async (data) => {
    // The data object should contain user_id, trait_id, and rating in snake_case
    const response = await ratingsApi.post('/submit', data)
    return response.data
}

/**
 * Validate a rating token
 * @param {string} token - Rating invitation token
 * @returns {Promise} - API response with token validation data
 */
const validateRatingToken = async (token) => {
    const response = await ratingsApi.get(`/validate-token/${token}`)
    return response.data
}

/**
 * Get trait information for rating page
 * @param {string} userId - User ID
 * @param {string} traitId - Trait ID
 * @returns {Promise} - API response with trait details
 */
const getTraitDetails = async (userId, traitId) => {
    const response = await ratingsApi.get(`/trait-details/${userId}/${traitId}`)
    return response.data
}

export default {
    getTraits,
    getUserRatings,
    submitRating,
    validateRatingToken,
    getTraitDetails
}