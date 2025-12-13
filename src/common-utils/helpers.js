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

import { ValidationError } from './errorHandler.js';

/**
 * Common Joi validation handler
 */
const validateWithJoi = (schema, payload) => {
    const { error, value } = schema.validate(payload, {
        abortEarly: false, // collect all errors
        stripUnknown: true, // remove unknown fields
    });

    if (error) {
        console.log("🚀 ~ validateWithJoi ~ error:", error)
        const errors = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));

        throw new ValidationError(errors);
    }

    return value;
};


export {
    parseNumber,
    parseCSV,
    isNonEmptyArray,
    pickKeysFromObj,
    validateWithJoi
};
