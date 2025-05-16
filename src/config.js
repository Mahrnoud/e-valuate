// src/config.js
export const development = {
    // Get the mock API setting from .env or default to true
    useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
    apiBaseUrl: import.meta.env.VITE_API_URL || 'https://api.characterrating.com'
};

export default {
    development,
    production: {
        useMockApi: false,
        apiBaseUrl: import.meta.env.VITE_API_URL || 'https://api.characterrating.com'
    }
};