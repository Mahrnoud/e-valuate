// store/auth.js - Authentication store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)
    const isLoading = ref(false)
    const error = ref(null)

    // Computed
    const isAuthenticated = computed(() => !!token.value)

    // Actions

    /**
     * Request phone verification code
     * @param {string} phoneNumber - User's phone number
     */
    async function requestVerificationCode(phoneNumber) {
        isLoading.value = true
        error.value = null

        try {
            await authService.requestVerificationCode(phoneNumber)
            return true
        } catch (err) {
            error.value = err.message || 'Failed to send verification code'
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Verify code and authenticate user
     * @param {string} phoneNumber - User's phone number
     * @param {string} code - Verification code
     */
    async function verifyCode(phoneNumber, code) {
        isLoading.value = true
        error.value = null

        try {
            const response = await authService.verifyCode(phoneNumber, code)

            // Store authentication data
            token.value = response.token
            user.value = response.user

            // Save token to local storage
            localStorage.setItem('token', token.value)

            return response.user
        } catch (err) {
            error.value = err.message || 'Invalid verification code'
            return null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Complete user profile
     * @param {Object} profileData - User profile data
     */
    async function completeProfile(profileData) {
        isLoading.value = true
        error.value = null

        try {
            const updatedUser = await authService.updateProfile(profileData)
            user.value = updatedUser
            return updatedUser
        } catch (err) {
            error.value = err.message || 'Failed to update profile'
            return null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Load current user data
     */
    async function loadUser() {
        if (!token.value) return null

        isLoading.value = true
        error.value = null

        try {
            const userData = await authService.getCurrentUser()
            user.value = userData
            return userData
        } catch (err) {
            error.value = err.message || 'Failed to load user data'
            logout()
            return null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Logout user
     */
    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
    }

    return {
        // State
        user,
        token,
        isLoading,
        error,

        // Computed
        isAuthenticated,

        // Actions
        requestVerificationCode,
        verifyCode,
        completeProfile,
        loadUser,
        logout
    }
})
