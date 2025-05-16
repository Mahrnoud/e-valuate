// services/notificationsService.js - Notifications service
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.characterrating.com'

// Create axios instance with default config
const notificationsApi = axios.create({
    baseURL: `${API_URL}/notifications`,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add auth token to requests
notificationsApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/**
 * Get user notifications
 * @returns {Promise} - API response with notifications and unread count
 */
const getNotifications = async () => {
    const response = await notificationsApi.get('/')
    return response.data
}

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise} - API response
 */
const markAsRead = async (notificationId) => {
    const response = await notificationsApi.put(`/${notificationId}/read`)
    return response.data
}

/**
 * Mark all notifications as read
 * @returns {Promise} - API response
 */
const markAllAsRead = async () => {
    const response = await notificationsApi.put('/mark-all-read')
    return response.data
}

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise} - API response
 */
const deleteNotification = async (notificationId) => {
    const response = await notificationsApi.delete(`/${notificationId}`)
    return response.data
}

export default {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
}
