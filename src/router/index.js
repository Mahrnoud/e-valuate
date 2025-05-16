// Modified router/index.js - Adding nested auth routes

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// Import views
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import ProfileView from '../views/ProfileView.vue'
import ContactsView from '../views/ContactsView.vue'
import RatingView from '../views/RatingView.vue'

// Import auth components for nested routes
import PhoneLogin from '../components/auth/PhoneLogin.vue'
import VerificationCode from '../components/auth/VerificationCode.vue'
import CompleteProfile from '../components/auth/CompleteProfile.vue'

// Define routes
const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { requiresAuth: true }
    },
    {
        path: '/auth',
        component: AuthView,
        meta: { guest: true },
        children: [
            {
                path: '',
                name: 'auth',
                component: PhoneLogin
            },
            {
                path: 'verify',
                name: 'auth-verify',
                component: VerificationCode
            },
            {
                path: 'profile',
                name: 'auth-profile',
                component: CompleteProfile
            }
        ]
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: { requiresAuth: true }
    },
    {
        path: '/contacts',
        name: 'contacts',
        component: ContactsView,
        meta: { requiresAuth: true }
    },
    {
        path: '/rate/:userId/:traitId',
        name: 'rate',
        component: RatingView,
        props: true
    },
    // Redirect unmatched routes to home
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

// Create router instance
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isLoggedIn = authStore.isAuthenticated

    console.log('Navigation guard: path =', to.path, 'isLoggedIn =', isLoggedIn,
        'requiresAuth =', to.meta.requiresAuth, 'guest =', to.meta.guest);

    // Check if route requires authentication
    if (to.meta.requiresAuth && !isLoggedIn) {
        console.log('Redirecting to auth because route requires auth but user is not logged in');
        next({ name: 'auth' })
    }
    // Prevent authenticated users from accessing guest routes
    else if (to.meta.guest && isLoggedIn && to.name !== 'auth-profile') {
        console.log('Redirecting to home because route is guest-only but user is logged in');
        next({ name: 'home' })
    } else {
        next()
    }
})

export default router
