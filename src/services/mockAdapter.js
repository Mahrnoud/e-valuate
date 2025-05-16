// src/services/mockAdapter.js
import mockApiService from './mockApiService';
import { development } from '@/config';

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
    // Import real services
    authService = require('./authService').default;
    contactsService = require('./contactsService').default;
    ratingsService = require('./ratingsService').default;
    notificationsService = require('./notificationsService').default;
}

// Export services
export { authService, contactsService, ratingsService, notificationsService };