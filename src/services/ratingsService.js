// services/ratingsService.js - Ratings service
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
 * @param {string} userId - User being rated
 * @param {string} traitId - Trait being rated
 * @param {number} rating - Rating value (-1 to 1)
 * @returns {Promise} - API response with rating confirmation
 */
const submitRating = async (userId, traitId, rating) => {
    const response = await ratingsApi.post('/submit', {
        userId,
        traitId,
        rating
    })
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
