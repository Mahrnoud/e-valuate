// composables/useNotifications.js - Notifications composable
import { computed } from 'vue'
import { useNotificationsStore } from '../store/notifications'

export function useNotifications() {
    const notificationsStore = useNotificationsStore()

    // Computed properties
    const notifications = computed(() => notificationsStore.notifications)
    const unreadCount = computed(() => notificationsStore.unreadCount)
    const isLoading = computed(() => notificationsStore.isLoading)
    const error = computed(() => notificationsStore.error)

    /**
     * Initialize notifications data
     */
    const initNotifications = async () => {
        return await loadNotifications()
    }

    /**
     * Load user notifications
     */
    const loadNotifications = async () => {
        return await notificationsStore.loadNotifications()
    }

    /**
     * Mark notification as read
     * @param {string} notificationId - Notification ID
     */
    const markAsRead = async (notificationId) => {
        return await notificationsStore.markAsRead(notificationId)
    }

    /**
     * Mark all notifications as read
     */
    const markAllAsRead = async () => {
        return await notificationsStore.markAllAsRead()
    }

    /**
     * Delete notification
     * @param {string} notificationId - Notification ID
     */
    const deleteNotification = async (notificationId) => {
        return await notificationsStore.deleteNotification(notificationId)
    }

    return {
        // Computed
        notifications,
        unreadCount,
        isLoading,
        error,

        // Methods
        initNotifications,
        loadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    }
}
