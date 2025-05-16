// src/composables/useAuth.js - Modified for router navigation

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

export function useAuth() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Form state
    const phoneNumber = ref('')
    const verificationCode = ref('')
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')

    // We'll keep the step for backward compatibility
    const step = ref('phone') // 'phone', 'code', 'profile'

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
            console.log("requestCode successful, setting step to 'code'")
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
                console.log("Setting step to 'profile' in verifyCode")
                step.value = 'profile'
                router.push({ name: 'auth-profile' })
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
        console.log("Reset flow, step is now:", step.value)
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
