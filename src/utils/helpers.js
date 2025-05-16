// utils/helpers.js - Utility helper functions

/**
 * Format a date to a readable string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}) => {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }

    const dateObj = date instanceof Date ? date : new Date(date)
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj)
}

/**
 * Format a phone number to a readable format
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return ''

    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '')

    // Format based on length and starting digits
    if (cleaned.startsWith('1') && cleaned.length > 10) {
        // US number with country code
        return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`
    } else if (cleaned.length === 10) {
        // US number without country code
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`
    } else if (cleaned.startsWith('1') && cleaned.length <= 10) {
        // Partial US number with country code
        return `+1 ${cleaned.substring(1)}`
    }

    // If it doesn't match expected patterns, return with + for international
    return phoneNumber.startsWith('+') ? phoneNumber : `+${cleaned}`
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @param {number} maxLength - Maximum number of initials
 * @returns {string} - Initials
 */
export const getInitials = (name, maxLength = 2) => {
    if (!name) return '?'

    return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .slice(0, maxLength)
        .join('')
}

/**
 * Format time elapsed since a given date
 * @param {Date|string} date - Date to calculate time from
 * @returns {string} - Human-readable time elapsed
 */
export const timeAgo = (date) => {
    if (!date) return 'Unknown'

    const now = new Date()
    const past = date instanceof Date ? date : new Date(date)
    const diffInSeconds = Math.floor((now - past) / 1000)

    if (diffInSeconds < 60) {
        return 'Just now'
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 604800) { // Less than a week
        const days = Math.floor(diffInSeconds / 86400)
        return `${days} day${days > 1 ? 's' : ''} ago`
    } else {
        // For older dates, return the actual date
        return formatDate(past)
    }
}

/**
 * Truncate text to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add when truncated
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
    if (!text || text.length <= maxLength) return text

    return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    return JSON.parse(JSON.stringify(obj))
}

export default {
    formatDate,
    formatPhoneNumber,
    getInitials,
    timeAgo,
    truncateText,
    deepClone
}
