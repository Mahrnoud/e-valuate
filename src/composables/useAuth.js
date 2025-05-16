// src/composables/useAuth.js - Modified version

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

export function useAuth() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Verification flow state
    const phoneNumber = ref('')
    const verificationCode = ref('')
    const step = ref('phone') // 'phone', 'code', 'profile'

    // Profile state
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')

    // Computed properties
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const user = computed(() => authStore.user)
    const isLoading = computed(() => authStore.isLoading)
    const error = computed(() => authStore.error)

    /**
     * Request verification code for phone number
     */
    const requestCode = async () => {
        if (!phoneNumber.value) return false

        const success = await authStore.requestVerificationCode(phoneNumber.value)

        if (success) {
            step.value = 'code'
            return true
        }

        return false
    }

    /**
     * Verify code and authenticate
     */
    const verifyCode = async () => {
        if (!verificationCode.value) return false

        const user = await authStore.verifyCode(phoneNumber.value, verificationCode.value)

        if (user) {
            // Check if profile is complete
            if (user.isProfileComplete) {
                router.push({ name: 'home' })
            } else {
                step.value = 'profile'
            }
            return true
        }

        return false
    }

    /**
     * Complete user profile
     */
    const completeProfile = async () => {
        if (!firstName.value || !lastName.value || !email.value) return false

        const profileData = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value
        }

        const updatedUser = await authStore.completeProfile(profileData)

        if (updatedUser) {
            router.push({ name: 'home' })
            return true
        }

        return false
    }

    /**
     * Log out user
     */
    const logout = () => {
        authStore.logout()
        router.push({ name: 'auth' })
    }

    /**
     * Reset verification flow state
     */
    const resetFlow = () => {
        phoneNumber.value = ''
        verificationCode.value = ''
        firstName.value = ''
        lastName.value = ''
        email.value = ''
        step.value = 'phone'
    }

    /**
     * Initialize auth state
     */
    const initAuth = async () => {
        if (isAuthenticated.value && !user.value) {
            await authStore.loadUser()
        }
    }

    return {
        // State
        phoneNumber,
        verificationCode,
        step,
        firstName,
        lastName,
        email,

        // Computed
        isAuthenticated,
        user,
        isLoading,
        error,

        // Methods
        requestCode,
        verifyCode,
        completeProfile,
        logout,
        resetFlow,
        initAuth
    }
}
