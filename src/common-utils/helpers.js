const parseNumber = (value, defaultValue) => {
    const num = parseInt(value, 10);
    return Number.isNaN(num) ? defaultValue : num;
};

const parseCSV = (value) =>
    value ? value.split(',').map((v) => v.trim()).filter(Boolean) : [];

/**
 * Checks if an array is non-empty.
 * @param {Array} arr - The array to check.
 * @returns {boolean} True if the array is non-empty.
 */
const isNonEmptyArray = (arr) => {
    return Array.isArray(arr) && arr.length > 0;
};

/**
 * Picks specified keys from an object.
 * @param {Object} obj - The source object.
 * @param {...string} keysToPick - Keys to pick from the object.
 * @returns {Object} New object containing only the picked keys.
 */
const pickKeysFromObj = (obj, ...keysToPick) => {
    return Object.assign(
        {},
        ...keysToPick.map((key) => ({ [key]: obj[key] }))
    );
};

export {
    parseNumber,
    parseCSV,
    isNonEmptyArray,
    pickKeysFromObj
};
