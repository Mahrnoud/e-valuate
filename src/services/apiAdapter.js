// services/apiAdapter.js - Updated to handle case conversion
import { camelizeKeys, snakifyKeys } from '@/utils/caseConverter';

// Helper functions to normalize API responses with case conversion
const normalizeResponse = (response, defaultValue = null) => {
    // If response is null or undefined, return default value
    if (response == null) {
        return defaultValue;
    }

    // If response has a data property (typical Axios/API response format)
    if (response && typeof response === 'object' && response.data !== undefined) {
        // Convert snake_case to camelCase
        return camelizeKeys(response.data);
    }

    // Otherwise return the response itself with case conversion
    return camelizeKeys(response);
};

const normalizeArrayResponse = (response, defaultValue = []) => {
    const data = normalizeResponse(response, defaultValue);
    return Array.isArray(data) ? data : defaultValue;
};

const normalizeObjectResponse = (response, defaultValue = {}) => {
    const data = normalizeResponse(response, defaultValue);
    return data && typeof data === 'object' && !Array.isArray(data) ? data : defaultValue;
};

// Create adapter factory function to avoid circular dependencies
export const createAdapters = (services) => {
    const { authService, contactsService, ratingsService, notificationsService } = services;

    // Wrap auth service
    const authServiceAdapter = {
        requestVerificationCode: async (phoneNumber) => {
            try {
                // Convert to snake_case for the API
                const payload = { phone_number: phoneNumber };
                const result = await authService.requestVerificationCode(payload);
                return normalizeResponse(result, true);
            } catch (error) {
                console.error('Error in requestVerificationCode:', error);
                return false;
            }
        },

        verifyCode: async (phoneNumber, code) => {
            try {
                // Convert to snake_case for the API
                const payload = { phone_number: phoneNumber, code };
                const result = await authService.verifyCode(payload);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in verifyCode:', error);
                throw error;
            }
        },

        updateProfile: async (profileData) => {
            try {
                // Convert camelCase to snake_case for the API
                const payload = snakifyKeys(profileData);
                const result = await authService.updateProfile(payload);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in updateProfile:', error);
                throw error;
            }
        },

        getCurrentUser: async () => {
            try {
                const result = await authService.getCurrentUser();
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in getCurrentUser:', error);
                throw error;
            }
        }
    };

    // Wrap contacts service
    const contactsServiceAdapter = {
        getCircles: async () => {
            try {
                const result = await contactsService.getCircles();
                return normalizeArrayResponse(result);
            } catch (error) {
                console.error('Error in getCircles:', error);
                return [];
            }
        },

        createCircle: async (circleData) => {
            try {
                // Convert camelCase to snake_case for the API
                const payload = snakifyKeys(circleData);
                const result = await contactsService.createCircle(payload);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in createCircle:', error);
                throw error;
            }
        },

        updateCircle: async (circleId, circleData) => {
            try {
                // Convert camelCase to snake_case for the API
                const payload = snakifyKeys(circleData);
                const result = await contactsService.updateCircle(circleId, payload);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in updateCircle:', error);
                throw error;
            }
        },

        deleteCircle: async (circleId) => {
            try {
                const result = await contactsService.deleteCircle(circleId);
                return normalizeResponse(result, { success: true });
            } catch (error) {
                console.error('Error in deleteCircle:', error);
                throw error;
            }
        },

        getContacts: async () => {
            try {
                const result = await contactsService.getContacts();
                return normalizeArrayResponse(result);
            } catch (error) {
                console.error('Error in getContacts:', error);
                return [];
            }
        },

        addContact: async (contactData) => {
            try {
                // Convert camelCase to snake_case for the API
                const payload = snakifyKeys(contactData);
                const result = await contactsService.addContact(payload);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in addContact:', error);
                throw error;
            }
        },

        updateContact: async (contactId, contactData) => {
            try {
                // Convert camelCase to snake_case for the API
                const payload = snakifyKeys(contactData);
                const result = await contactsService.updateContact(contactId, payload);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in updateContact:', error);
                throw error;
            }
        },

        deleteContact: async (contactId) => {
            try {
                const result = await contactsService.deleteContact(contactId);
                return normalizeResponse(result, { success: true });
            } catch (error) {
                console.error('Error in deleteContact:', error);
                throw error;
            }
        },

        sendRatingInvitations: async (contactIds) => {
            try {
                // Convert to snake_case format for the API
                const payload = { contact_ids: contactIds };
                const result = await contactsService.sendRatingInvitations(payload);
                return normalizeResponse(result, { success: true, sent: contactIds.length });
            } catch (error) {
                console.error('Error in sendRatingInvitations:', error);
                throw error;
            }
        }
    };

    // Wrap ratings service
    const ratingsServiceAdapter = {
        getTraits: async () => {
            try {
                const result = await ratingsService.getTraits();
                return normalizeArrayResponse(result);
            } catch (error) {
                console.error('Error in getTraits:', error);
                return [];
            }
        },

        getUserRatings: async (userId) => {
            try {
                const result = await ratingsService.getUserRatings(userId);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in getUserRatings:', error);
                return {};
            }
        },

        submitRating: async (userId, traitId, rating) => {
            try {
                // Convert to snake_case format for the API
                const payload = {
                    user_id: userId,
                    trait_id: traitId,
                    rating
                };
                const result = await ratingsService.submitRating(payload);
                return normalizeResponse(result, { success: true });
            } catch (error) {
                console.error('Error in submitRating:', error);
                throw error;
            }
        },

        validateRatingToken: async (token) => {
            try {
                const result = await ratingsService.validateRatingToken(token);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in validateRatingToken:', error);
                throw error;
            }
        },

        getTraitDetails: async (userId, traitId) => {
            try {
                const result = await ratingsService.getTraitDetails(userId, traitId);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in getTraitDetails:', error);
                throw error;
            }
        }
    };

    // Wrap notifications service
    const notificationsServiceAdapter = {
        getNotifications: async () => {
            try {
                const result = await notificationsService.getNotifications();
                const normalizedResult = normalizeObjectResponse(result);

                // Ensure result has expected structure
                if (!normalizedResult.notifications) {
                    // If we only got an array of notifications without metadata
                    if (Array.isArray(normalizedResult)) {
                        return {
                            notifications: normalizedResult,
                            unreadCount: normalizedResult.filter(n => !n.read).length
                        };
                    }

                    // Default empty result
                    return { notifications: [], unreadCount: 0 };
                }

                return normalizedResult;
            } catch (error) {
                console.error('Error in getNotifications:', error);
                return { notifications: [], unreadCount: 0 };
            }
        },

        markAsRead: async (notificationId) => {
            try {
                const result = await notificationsService.markAsRead(notificationId);
                return normalizeResponse(result, { success: true });
            } catch (error) {
                console.error('Error in markAsRead:', error);
                throw error;
            }
        },

        markAllAsRead: async () => {
            try {
                const result = await notificationsService.markAllAsRead();
                return normalizeResponse(result, { success: true });
            } catch (error) {
                console.error('Error in markAllAsRead:', error);
                throw error;
            }
        },

        deleteNotification: async (notificationId) => {
            try {
                const result = await notificationsService.deleteNotification(notificationId);
                return normalizeResponse(result, { success: true });
            } catch (error) {
                console.error('Error in deleteNotification:', error);
                throw error;
            }
        }
    };

    return {
        authService: authServiceAdapter,
        contactsService: contactsServiceAdapter,
        ratingsService: ratingsServiceAdapter,
        notificationsService: notificationsServiceAdapter
    };
};