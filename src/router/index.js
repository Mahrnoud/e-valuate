// router/index.js - Vue Router configuration
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

// Import views
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import ProfileView from '../views/ProfileView.vue'
import ContactsView from '../views/ContactsView.vue'
import RatingView from '../views/RatingView.vue'

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
        name: 'auth',
        component: AuthView,
        meta: { guest: true }
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

    // Check if route requires authentication
    if (to.meta.requiresAuth && !isLoggedIn) {
        next({ name: 'auth' })
    }
    // Prevent authenticated users from accessing guest routes
    else if (to.meta.guest && isLoggedIn) {
        next({ name: 'home' })
    } else {
        next()
    }
})

export default router
