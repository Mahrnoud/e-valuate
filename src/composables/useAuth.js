// src/composables/useAuth.js - Modified to persist state during navigation

import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// Create global refs to ensure state persists between route changes
const globalPhoneNumber = ref(localStorage.getItem('auth_phoneNumber') || '');
const globalVerificationCode = ref('');
const globalStep = ref(localStorage.getItem('auth_step') || 'phone');
const globalFirstName = ref('');
const globalLastName = ref('');
const globalEmail = ref('');

// Sync with localStorage when changes occur
watch(globalPhoneNumber, (newVal) => {
    localStorage.setItem('auth_phoneNumber', newVal);
});

watch(globalStep, (newVal) => {
    localStorage.setItem('auth_step', newVal);
    console.log("Step changed to:", newVal);
});

export function useAuth() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Use the global state
    const phoneNumber = globalPhoneNumber;
    const verificationCode = globalVerificationCode;
    const step = globalStep;
    const firstName = globalFirstName;
    const lastName = globalLastName;
    const email = globalEmail;

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

        console.log(`Verifying code ${verificationCode.value} for phone ${phoneNumber.value}`);

        const user = await authStore.verifyCode(phoneNumber.value, verificationCode.value)

        if (user) {
            // Check if profile is complete
            if (user.isProfileComplete) {
                // Clear temporary auth data from localStorage
                localStorage.removeItem('auth_phoneNumber');
                localStorage.removeItem('auth_step');

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
            // Clear temporary auth data from localStorage
            localStorage.removeItem('auth_phoneNumber');
            localStorage.removeItem('auth_step');

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

        // Clear localStorage items
        localStorage.removeItem('auth_phoneNumber');
        localStorage.removeItem('auth_step');

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
