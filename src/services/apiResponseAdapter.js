// This new utility will help standardize responses between mock and real API
export const normalizeResponse = (response, defaultValue = null) => {
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

export const normalizeArrayResponse = (response, defaultValue = []) => {
    const data = normalizeResponse(response, defaultValue);
    return Array.isArray(data) ? data : defaultValue;
};

export const normalizeObjectResponse = (response, defaultValue = {}) => {
    const data = normalizeResponse(response, defaultValue);
    return data && typeof data === 'object' && !Array.isArray(data) ? data : defaultValue;
};