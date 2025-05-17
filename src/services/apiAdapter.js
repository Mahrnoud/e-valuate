// Helper functions to normalize API responses
const normalizeResponse = (response, defaultValue = null) => {
    // If response is null or undefined, return default value
    if (response == null) {
        return defaultValue;
    }

    // If response has a data property (typical Axios/API response format)
    if (response && typeof response === 'object' && response.data !== undefined) {
        return response.data;
    }

    // Otherwise return the response itself
    return response;
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
                const result = await authService.requestVerificationCode(phoneNumber);
                return normalizeResponse(result, true);
            } catch (error) {
                console.error('Error in requestVerificationCode:', error);
                return false;
            }
        },

        verifyCode: async (phoneNumber, code) => {
            try {
                const result = await authService.verifyCode(phoneNumber, code);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in verifyCode:', error);
                throw error;
            }
        },

        updateProfile: async (profileData) => {
            try {
                const result = await authService.updateProfile(profileData);
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
                const result = await contactsService.createCircle(circleData);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in createCircle:', error);
                throw error;
            }
        },

        updateCircle: async (circleId, circleData) => {
            try {
                const result = await contactsService.updateCircle(circleId, circleData);
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
                const result = await contactsService.addContact(contactData);
                return normalizeObjectResponse(result);
            } catch (error) {
                console.error('Error in addContact:', error);
                throw error;
            }
        },

        updateContact: async (contactId, contactData) => {
            try {
                const result = await contactsService.updateContact(contactId, contactData);
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
                const result = await contactsService.sendRatingInvitations(contactIds);
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
                const result = await ratingsService.submitRating(userId, traitId, rating);
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