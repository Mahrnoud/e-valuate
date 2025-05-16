<!-- components/ui/AppHeader.vue -->
<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo section -->
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <img src="../../assets/logo.svg" alt="Character Rating" class="logo" />
          <span class="logo-text">Character Rating</span>
        </router-link>
      </div>

      <!-- Navigation links (desktop) -->
      <nav v-if="isAuthenticated" class="desktop-nav">
        <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            active-class="active"
        >
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Right section with user menu -->
      <div v-if="isAuthenticated" class="user-section">
        <!-- Notifications -->
        <div class="notifications-menu">
          <button
              @click="toggleNotifications"
              class="notification-button"
              :class="{ 'has-unread': unreadCount > 0 }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
          </button>

          <!-- Notifications dropdown -->
          <div v-if="showNotifications" class="notifications-dropdown">
            <div class="dropdown-header">
              <h3 class="dropdown-title">Notifications</h3>
              <button
                  v-if="notifications.length > 0"
                  @click="markAllAsRead"
                  class="mark-all-read"
              >
                Mark all as read
              </button>
            </div>

            <div v-if="isLoading" class="notifications-loading">
              <div class="spinner"></div>
              <span>Loading notifications...</span>
            </div>

            <div v-else-if="notifications.length === 0" class="empty-notifications">
              <p>No notifications yet</p>
            </div>

            <div v-else class="notifications-list">
              <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="notification-item"
                  :class="{ 'unread': !notification.read }"
                  @click="handleNotificationClick(notification)"
              >
                <div class="notification-content">{{ notification.message }}</div>
                <div class="notification-time">{{ formatTimeAgo(notification.createdAt) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- User menu -->
        <div class="user-menu">
          <button @click="toggleUserMenu" class="user-button">
            <div class="user-avatar">
              {{ userInitials }}
            </div>
          </button>

          <!-- User dropdown -->
          <div v-if="showUserMenu" class="user-dropdown">
            <div class="dropdown-header user-info">
              <div class="user-name">{{ user?.firstName }} {{ user?.lastName }}</div>
              <div class="user-email">{{ user?.email }}</div>
            </div>

            <div class="dropdown-links">
              <router-link to="/profile" class="dropdown-link" @click="closeUserMenu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>My Profile</span>
              </router-link>

              <button @click="handleLogout" class="dropdown-link logout">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu button -->
      <div v-if="isAuthenticated" class="mobile-menu-button">
        <button @click="toggleMobileMenu" aria-label="Toggle menu">
          <svg v-if="!showMobileMenu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile navigation menu -->
    <div v-if="showMobileMenu && isAuthenticated" class="mobile-nav">
      <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="mobile-nav-link"
          active-class="active"
          @click="closeMobileMenu"
      >
        {{ item.name }}
      </router-link>

      <div class="mobile-nav-divider"></div>

      <router-link to="/profile" class="mobile-nav-link" @click="closeMobileMenu">
        My Profile
      </router-link>

      <button @click="handleLogout" class="mobile-nav-link logout">
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useNotifications } from '../../composables/useNotifications'

// Navigation items
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Contacts', path: '/contacts' }
]

// Get auth and notifications
const { user, isAuthenticated, logout } = useAuth()
const {
  notifications,
  unreadCount,
  isLoading,
  initNotifications,
  markAsRead,
  markAllAsRead
} = useNotifications()

// Local state
const showNotifications = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

// Computed properties
const userInitials = computed(() => {
  if (!user.value) return '?'

  const firstName = user.value.firstName || ''
  const lastName = user.value.lastName || ''

  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
})

// Initialize notifications
onMounted(async () => {
  if (isAuthenticated.value) {
    await initNotifications()
  }

  // Close menus when clicking outside
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})

// Toggle notifications dropdown
const toggleNotifications = (event) => {
  event.stopPropagation()
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

// Toggle user menu dropdown
const toggleUserMenu = (event) => {
  event.stopPropagation()
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// Close mobile menu
const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Close user menu
const closeUserMenu = () => {
  showUserMenu.value = false
}

// Handle notification click
const handleNotificationClick = async (notification) => {
  if (!notification.read) {
    await markAsRead(notification.id)
  }
}

// Handle logout
const handleLogout = () => {
  showUserMenu.value = false
  showMobileMenu.value = false
  logout()
}

// Close dropdowns when clicking outside
const handleOutsideClick = (event) => {
  const notificationsMenu = document.querySelector('.notifications-menu')
  const userMenu = document.querySelector('.user-menu')

  if (
      notificationsMenu &&
      !notificationsMenu.contains(event.target) &&
      showNotifications.value
  ) {
    showNotifications.value = false
  }

  if (
      userMenu &&
      !userMenu.contains(event.target) &&
      showUserMenu.value
  ) {
    showUserMenu.value = false
  }
}

// Format time ago
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Unknown'

  const now = new Date()
  const date = new Date(timestamp)
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}
</script>

<style scoped>
.app-header {
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #111827;
}

.logo {
  height: 2.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
}

.desktop-nav {
  display: flex;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 0;
}

.nav-link:hover {
  color: #4f46e5;
}

.nav-link.active {
  color: #4f46e5;
  font-weight: 600;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notifications-menu, .user-menu {
  position: relative;
}

.notification-button, .user-button {
  background: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.notification-button:hover, .user-button:hover {
  background-color: #f3f4f6;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #4b5563;
}

.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background-color: #f3f4f6;
  color: #4f46e5;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.notifications-dropdown, .user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 20rem;
  max-height: 24rem;
  overflow-y: auto;
  z-index: 20;
  margin-top: 0.5rem;
}

.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdown-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.mark-all-read {
  background: transparent;
  border: none;
  color: #4f46e5;
  font-size: 0.75rem;
  cursor: pointer;
}

.mark-all-read:hover {
  text-decoration: underline;
}

.notifications-loading, .empty-notifications {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  gap: 0.75rem;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.notifications-list {
  padding: 0.5rem 0;
}

.notification-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item.unread {
  background-color: #eff6ff;
}

.notification-item.unread:hover {
  background-color: #dbeafe;
}

.notification-content {
  font-size: 0.875rem;
  color: #111827;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.user-info {
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.user-email {
  font-size: 0.75rem;
  color: #6b7280;
}

.dropdown-links {
  padding: 0.5rem 0;
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #4b5563;
  text-decoration: none;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-link:hover {
  background-color: #f9fafb;
}

.dropdown-link.logout {
  color: #ef4444;
}

.mobile-menu-button {
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu-button {
    display: block;
  }
}

.mobile-nav {
  display: none;
  flex-direction: column;
  background-color: white;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
  }
}

.mobile-nav-link {
  padding: 1rem;
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
  width: 100%;
  text-align: left;
  background: transparent;
  border-left: none;
  border-right: none;
  border-top: none;
  font-size: 1rem;
  cursor: pointer;
}

.mobile-nav-link:hover {
  background-color: #f9fafb;
}

.mobile-nav-link.active {
  color: #4f46e5;
  font-weight: 600;
}

.mobile-nav-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 0.5rem 0;
}

.mobile-nav-link.logout {
  color: #ef4444;
}
</style>
