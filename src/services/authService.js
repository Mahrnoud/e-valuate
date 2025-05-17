import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.characterrating.com';

// Create axios instance with default config
const authApi = axios.create({
    baseURL: `${API_URL}/auth`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests when available
authApi.interceptors.request.use(config => {
    console.log('REQUEST CONFIG:', config.url, config.method);
    const token = localStorage.getItem('token');
    if (token) {
        console.log('Adding token to request');
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response logging
authApi.interceptors.response.use(
    response => {
        console.log('RESPONSE SUCCESS:', response.config.url, response.status);
        return response;
    },
    error => {
        console.error('RESPONSE ERROR:', error.config ? error.config.url : 'unknown URL', error.message);
        // Log more details if available
        if (error.response) {
            console.error('API Error Details:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        }

        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
            console.log('Unauthorized, removing token');
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

/**
 * Request a verification code for a phone number
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise} - API response
 */
const requestVerificationCode = async (phoneNumber) => {
    console.log('authService.requestVerificationCode called with:', phoneNumber);
    try {
        // Check if we're using the expected API format or if we need to transform data
        const body = { phone_number: phoneNumber };

        console.log('Sending request to /request-code with body:', body);
        const response = await authApi.post('/request-code', body);
        console.log('requestVerificationCode response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in requestVerificationCode:', error.message);
        throw error;
    }
};

/**
 * Verify code and authenticate user
 * @param {string} phoneNumber - User's phone number
 * @param {string} code - Verification code
 * @returns {Promise} - API response with user data and token
 */
const verifyCode = async (phoneNumber, code) => {
    console.log('authService.verifyCode called with:', phoneNumber, code);
    try {
        const body = { phone_number: phoneNumber, code };

        console.log('Sending request to /verify-code with body:', body);
        const response = await authApi.post('/verify-code', body);
        console.log('verifyCode response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in verifyCode:', error.message);
        throw error;
    }
};

/**
 * Update user profile
 * @param {Object} profileData - User profile data (firstName, lastName, email)
 * @returns {Promise} - API response with updated user
 */
const updateProfile = async (profileData) => {
    console.log('authService.updateProfile called with:', profileData);
    try {
        const body = {
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            email: profileData.email
        };

        console.log('Sending request to /profile with body:', body);
        const response = await authApi.put('/profile', body);
        console.log('updateProfile response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in updateProfile:', error.message);
        throw error;
    }
};

/**
 * Get current authenticated user data
 * @returns {Promise} - API response with user data
 */
const getCurrentUser = async () => {
    console.log('authService.getCurrentUser called');
    try {
        const response = await authApi.get('/me');
        console.log('getCurrentUser response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getCurrentUser:', error.message);
        throw error;
    }
};

export default {
    requestVerificationCode,
    verifyCode,
    updateProfile,
    getCurrentUser
};