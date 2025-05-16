// store/notifications.js - Notifications store
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationsService } from '@/services/mockAdapter';

export const useNotificationsStore = defineStore('notifications', () => {
    // State
    const notifications = ref([])
    const unreadCount = ref(0)
    const isLoading = ref(false)
    const error = ref(null)

    // Actions

    /**
     * Load user notifications
     */
    async function loadNotifications() {
        isLoading.value = true
        error.value = null

        try {
            const result = await notificationsService.getNotifications()
            notifications.value = result.notifications
            unreadCount.value = result.unreadCount
            return result
        } catch (err) {
            error.value = err.message || 'Failed to load notifications'
            return []
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Mark notification as read
     * @param {string} notificationId - Notification ID
     */
    async function markAsRead(notificationId) {
        try {
            await notificationsService.markAsRead(notificationId)

            // Update local state
            const notification = notifications.value.find(n => n.id === notificationId)
            if (notification && !notification.read) {
                notification.read = true
                unreadCount.value = Math.max(0, unreadCount.value - 1)
            }

            return true
        } catch (err) {
            error.value = err.message || 'Failed to update notification'
            return false
        }
    }

    /**
     * Mark all notifications as read
     */
    async function markAllAsRead() {
        isLoading.value = true
        error.value = null

        try {
            await notificationsService.markAllAsRead()

            // Update local state
            notifications.value.forEach(notification => {
                notification.read = true
            })
            unreadCount.value = 0

            return true
        } catch (err) {
            error.value = err.message || 'Failed to update notifications'
            return false
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Delete notification
     * @param {string} notificationId - Notification ID
     */
    async function deleteNotification(notificationId) {
        try {
            await notificationsService.deleteNotification(notificationId)

            // Update local state
            const notification = notifications.value.find(n => n.id === notificationId)
            if (notification) {
                if (!notification.read) {
                    unreadCount.value = Math.max(0, unreadCount.value - 1)
                }
                notifications.value = notifications.value.filter(n => n.id !== notificationId)
            }

            return true
        } catch (err) {
            error.value = err.message || 'Failed to delete notification'
            return false
        }
    }

    return {
        // State
        notifications,
        unreadCount,
        isLoading,
        error,

        // Actions
        loadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    }
})