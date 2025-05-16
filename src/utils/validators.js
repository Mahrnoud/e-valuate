// utils/validators.js - Form validation functions

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
    if (!email) return false
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
}

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false

    // Remove all non-numeric characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '')

    // Check if it starts with + and has at least 8 digits
    if (cleaned.startsWith('+')) {
        return cleaned.length >= 9 // + plus at least 8 digits
    }

    // If it doesn't start with +, it should have at least 10 digits (US format)
    return cleaned.length >= 10
}

/**
 * Validate required field
 * @param {any} value - Value to check
 * @returns {boolean} - True if not empty, false otherwise
 */
export const isRequired = (value) => {
    if (value === null || value === undefined) return false

    if (typeof value === 'string') {
        return value.trim().length > 0
    }

    if (Array.isArray(value)) {
        return value.length > 0
    }

    return true
}

/**
 * Validate minimum length
 * @param {string} value - String to check
 * @param {number} minLength - Minimum length required
 * @returns {boolean} - True if valid, false otherwise
 */
export const hasMinLength = (value, minLength) => {
    if (!value) return false
    return String(value).length >= minLength
}

/**
 * Validate maximum length
 * @param {string} value - String to check
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} - True if valid, false otherwise
 */
export const hasMaxLength = (value, maxLength) => {
    if (!value) return true // Empty values are handled by isRequired
    return String(value).length <= maxLength
}

/**
 * Validate that two values match
 * @param {any} value1 - First value
 * @param {any} value2 - Second value
 * @returns {boolean} - True if equal, false otherwise
 */
export const valuesMatch = (value1, value2) => {
    return value1 === value2
}

/**
 * Validate numeric value within range
 * @param {number} value - Number to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if within range, false otherwise
 */
export const isInRange = (value, min, max) => {
    const num = Number(value)
    if (isNaN(num)) return false

    if (min !== undefined && num < min) return false
    if (max !== undefined && num > max) return false

    return true
}

/**
 * Validate a verification code (numbers only)
 * @param {string} code - Code to validate
 * @param {number} length - Expected length
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidVerificationCode = (code, length = 6) => {
    if (!code) return false

    const codePattern = new RegExp(`^\\d{${length}}$`)
    return codePattern.test(code)
}

export default {
    isValidEmail,
    isValidPhoneNumber,
    isRequired,
    hasMinLength,
    hasMaxLength,
    valuesMatch,
    isInRange,
    isValidVerificationCode
}
