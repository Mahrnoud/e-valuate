import mockApiService from './mockApiService';
import { development } from '@/config';

// Import real services
import authServiceReal from './authService';
import contactsServiceReal from './contactsService';
import ratingsServiceReal from './ratingsService';
import notificationsServiceReal from './notificationsService';

// Import adapter factory
import { createAdapters } from './apiAdapter';

// Check if we should use mock API
const useMockApi = development.useMockApi;

console.log(`Using ${useMockApi ? 'MOCK' : 'REAL'} API services`);

// Get raw services
const rawServices = useMockApi
    ? {
        authService: mockApiService.auth,
        contactsService: mockApiService.contacts,
        ratingsService: mockApiService.ratings,
        notificationsService: mockApiService.notifications
    }
    : {
        authService: authServiceReal,
        contactsService: contactsServiceReal,
        ratingsService: ratingsServiceReal,
        notificationsService: notificationsServiceReal
    };

// Create adapters from raw services
const adaptedServices = createAdapters(rawServices);

// Export the adapted services
export const {
    authService,
    contactsService,
    ratingsService,
    notificationsService
} = adaptedServices;