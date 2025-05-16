// src/services/mockAdapter.js
import mockApiService from './mockApiService';
import { development } from '@/config';

// Import real services (using ES module syntax)
import authServiceReal from './authService';
import contactsServiceReal from './contactsService';
import ratingsServiceReal from './ratingsService';
import notificationsServiceReal from './notificationsService';

// Check if we should use mock API
const useMockApi = development.useMockApi;

console.log(`Using ${useMockApi ? 'MOCK' : 'REAL'} API services`);

// Define exports
let authService, contactsService, ratingsService, notificationsService;

if (useMockApi) {
    authService = mockApiService.auth;
    contactsService = mockApiService.contacts;
    ratingsService = mockApiService.ratings;
    notificationsService = mockApiService.notifications;
} else {
    // Use imported real services
    authService = authServiceReal;
    contactsService = contactsServiceReal;
    ratingsService = ratingsServiceReal;
    notificationsService = notificationsServiceReal;
}

// Export services
export { authService, contactsService, ratingsService, notificationsService };