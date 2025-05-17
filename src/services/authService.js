// services/authService.js - Authentication service
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.characterrating.com'

// Create axios instance with default config
const authApi = axios.create({
    baseURL: `${API_URL}/auth`,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add auth token to requests when available
authApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle error responses
authApi.interceptors.response.use(
    response => response,
    error => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
        }
        return Promise.reject(error)
    }
)

/**
 * Request a verification code for a phone number
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise} - API response
 */
const requestVerificationCode = async (phoneNumber) => {
    const response = await authApi.post('/request-code', { phone_number:phoneNumber })
    return response.data
}

/**
 * Verify code and authenticate user
 * @param {string} phoneNumber - User's phone number
 * @param {string} code - Verification code
 * @returns {Promise} - API response with user data and token
 */
const verifyCode = async (phoneNumber, code) => {
    const response = await authApi.post('/verify-code', { phone_number:phoneNumber, code })
    return response.data
}

/**
 * Update user profile
 * @param {Object} profileData - User profile data (firstName, lastName, email)
 * @returns {Promise} - API response with updated user
 */
const updateProfile = async (profileData) => {
    const response = await authApi.put('/profile', {
        first_name:profileData.firstName,
        last_name:profileData.lastName,
        email:profileData.email
    })
    return response.data
}

/**
 * Get current authenticated user data
 * @returns {Promise} - API response with user data
 */
const getCurrentUser = async () => {
    const response = await authApi.get('/me')
    return response.data
}

export default {
    requestVerificationCode,
    verifyCode,
    updateProfile,
    getCurrentUser
}
