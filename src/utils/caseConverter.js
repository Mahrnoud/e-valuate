/**
 * Converts snake_case keys in an object or array to camelCase
 * @param {Object|Array} obj - Object or array to transform
 * @returns {Object|Array} - Transformed object or array
 */
export function camelizeKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(v => camelizeKeys(v));
    } else if (obj !== null && obj !== undefined && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            result[camelKey] = camelizeKeys(obj[key]);
            return result;
        }, {});
    }
    return obj;
}

/**
 * Converts camelCase keys in an object or array to snake_case
 * @param {Object|Array} obj - Object or array to transform
 * @returns {Object|Array} - Transformed object or array
 */
export function snakifyKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(v => snakifyKeys(v));
    } else if (obj !== null && obj !== undefined && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            result[snakeKey] = snakifyKeys(obj[key]);
            return result;
        }, {});
    }
    return obj;
}